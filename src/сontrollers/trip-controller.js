import SortingComponent from "../components/sorting";
import TripDaysComponent from "../components/trip-days";
import NoEventsComponent from "../components/no-events";
import EventController from "./event-controller";
import {render, remove} from "../utils/render";
import {SortType} from "../utils/const";
import {FilterType} from "../utils/const";
import {types} from "../mock/data";

const createDefaultPoint = () => {
  return {
    id: Math.random(),
    price: ``,
    dateFrom: new Date(),
    dateTo: new Date(),
    destination: ``,
    isFavorite: null,
    offers: [],
    type: types[0],
  };
};

const DEFAULT_FILTER = FilterType.EVERYTHING;
const DEFAULT_SORT_TYPE = SortType.EVENT;


export default class TripController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._points = [];
    this._eventControllers = [];

    this._sortType = SortType.EVENT;
    this._creationMode = false;
    this._statisticMode = false;

    this._sortingComponent = null;
    this._tripDaysComponent = null;
    this._newEventButton = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onNewEventButtonClick = this._onNewEventButtonClick.bind(this);

    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const container = this._container;
    const points = this._pointsModel.getPoints();
    this._points = points;

    if (points.length === 0) {
      this._noEventsComponent = new NoEventsComponent();
      render(container, this._noEventsComponent);
      return;
    }

    this._renderSorting(container);
    this._renderDays(points);
    this._renderEvents(points);
  }

  hide() {

    this._statisticMode = true;
    this._container.classList.add(`hidden`);
  }

  show() {
    this._statisticMode = false;
    this._onViewChange(); // закрываем открытые формы редактирования

    if (this._sortType !== DEFAULT_SORT_TYPE) { // если сортировка не дефолтная, сбрасываем и перерисовываем сортировку и доску
      this._removeSorting();
      this._renderSorting(this._container);
      this._rerenderBoard();
    }

    this._container.classList.remove(`hidden`);
  }

  _onNewEventButtonClick() {
    if (this._creationMode || this._statisticMode) {
      return;
    }
    this._toDefaultBoardSettings();
    this._onDataChange(null, createDefaultPoint());
    this._newEventButton.turnOnDisabledMode();
  }

  addNewEventButtonComponent(newEventButton) {
    this._newEventButton = newEventButton;
  }

  _renderSorting(container) {
    this._sortingComponent = new SortingComponent();

    this._sortingComponent.setSortTypeChangeHandler((evt) => {

      this._sortType = evt.target.dataset.sortType;
      let sortedPoints = this._points.slice();

      switch (this._sortType) {
        case SortType.EVENT: {
          this._renderDays(sortedPoints);
          this._renderEvents(sortedPoints);
          break;
        }

        case SortType.PRICE: {
          sortedPoints = sortedPoints.sort((a, b) => b.price - a.price);
          this._renderDays();
          this._renderEvents(sortedPoints);
          break;
        }

        case SortType.TIME: {
          sortedPoints = sortedPoints.sort((a, b) => (b.dateTo - b.dateFrom) - (a.dateTo - a.dateFrom));
          this._renderDays();
          this._renderEvents(sortedPoints);
          break;
        }
      }
      this._sortingComponent.sortType = this._sortType;
    });
    render(container, this._sortingComponent);
  }

  _renderDays(points) {
    if (this._tripDaysComponent) {
      remove(this._tripDaysComponent);
    }
    this._tripDaysComponent = new TripDaysComponent(points);
    render(this._container, this._tripDaysComponent);
  }

  _renderEvent(container, point) {
    const eventController = new EventController(container, this._onDataChange, this._onViewChange);
    this._eventControllers.push(eventController);
    eventController.render(point);
  }

  _renderEvents(points) {
    const days = this._tripDaysComponent.getElement().querySelectorAll(`.trip-events__list`);

    if (days.length === 1) { // если у нас один день (режим сортировки) то рендерим всё в него
      points.forEach((point) => {
        this._renderEvent(days[0], point);
      });
      return;
    }

    let j = 0;
    for (let i = 0; i < points.length; i++) {

      if (i === 0) { // всегда рендерим первый элемент в первый день
        this._renderEvent(days[0], points[0]);
        continue;
      }

      const isDateHigher = points[i].dateFrom.getDate() > points[i - 1].dateFrom.getDate();
      const isMonthHigher = points[i].dateFrom.getMonth() > points[i - 1].dateFrom.getMonth();

      if (isDateHigher || isMonthHigher) { // если (дата элемента > даты предыдущего элемента) рендерим в другой день
        j++;
        this._renderEvent(days[j], points[i]);
      } else { // иначе рендерим в этот же день
        this._renderEvent(days[j], points[i]);
      }
    }
  }

  _onDataChange(oldData, newData) {
    const index = this._points.findIndex((it) => it === oldData);

    if (newData === null) { // DELETING
      this._pointsModel.removePoint(oldData.id);
      this._points = this._pointsModel.getPoints();

      this._eventControllers[index].destroy();
      this._eventControllers = [].concat(this._eventControllers.slice(0, index), this._eventControllers.slice(index + 1));

      this._creationMode = false;
      this._newEventButton.turnOffDisabledMode();
      this._rerenderBoard();
    } else if (oldData === null) { // ADDING

      this._creationMode = true;
      this._pointsModel.addPoint(newData);
      this._points = this._pointsModel.getPoints();

      const eventController = new EventController(this._container, this._onDataChange, this._onViewChange);
      this._eventControllers.push(eventController);
      eventController.render(newData, true);
    } else { // UPDATING
      this._pointsModel.updatePoint(oldData.id, newData);
      this._points = this._pointsModel.getPoints();

      if (this._eventControllers[index]._editMode === true) { // редактирование
        this._eventControllers[index].render(this._points[index]);
      } else { // выход из редактирования
        this._rerenderBoard();
        this._creationMode = false;
        this._newEventButton.turnOffDisabledMode();
      }
    }

  }

  _onViewChange() { // закрываем открытые формы редактирования
    this._eventControllers.forEach((el) => el.setDefaultView());
  }

  _removePoints() {
    this._eventControllers.forEach((controller) => controller.destroy());
    this._eventControllers = [];
    if (this._tripDaysComponent) {
      remove(this._tripDaysComponent);
    }
  }

  _removeSorting() {
    if (this._sortingComponent) {
      remove(this._sortingComponent);
      this._sortingComponent = null;
    }
  }

  _removeNoEvents() {
    if (this._noEventsComponent) {
      remove(this._noEventsComponent);
      this._noEventsComponent = null;
    }
  }

  _onFilterChange() {
    this._removeSorting();
    this._removeNoEvents();
    this._removePoints();
    this.render();
  }

  _rerenderBoard() {
    if (this._points.length === 0) {
      this.render();
      return;
    }

    if (this._points.length === 1 && !this._sortingComponent) { // проверка чтобы не рендерить лишнюю сортировку
      this._removePoints();
      this.render();
      return;
    }


    this._sortType = this._sortingComponent.sortType;
    this._removePoints();

    let sortedPoints = this._points.slice();
    switch (this._sortType) {
      case SortType.EVENT: {
        this._renderDays(sortedPoints);
        this._renderEvents(sortedPoints);
        break;
      }

      case SortType.PRICE: {
        sortedPoints = sortedPoints.sort((a, b) => b.price - a.price);
        this._renderDays();
        this._renderEvents(sortedPoints);
        break;
      }

      case SortType.TIME: {
        sortedPoints = sortedPoints.sort((a, b) => (b.dateTo - b.dateFrom) - (a.dateTo - a.dateFrom));
        this._renderDays();
        this._renderEvents(sortedPoints);
        break;
      }
    }
  }

  _toDefaultBoardSettings() {
    this._onViewChange(); // закрываем открытые формы редактирования

    if (this._noEventsComponent) {
      this._removeNoEvents();
    }

    if (this._sortType !== DEFAULT_SORT_TYPE) { // если сортировка не дефолтная, сбрасываем и перерисовываем сортировку и доску
      this._removeSorting();
      this._renderSorting(this._container);
      this._rerenderBoard();
    }

    if (this._pointsModel.getFilter() !== DEFAULT_FILTER) { // если фильтр не дефолтный, перерисовываем фильтр и доску
      this._pointsModel.setFilter(DEFAULT_FILTER);
    }
  }
}

