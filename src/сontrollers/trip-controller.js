import SortingComponent from "../components/sorting";
import TripDaysComponent from "../components/trip-days";
import NoEventsComponent from "../components/no-events";
import EventController from "./event-controller";
import {render, remove} from "../utils/render";
import {SortType} from "../utils/const";

export default class TripController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._points = [];
    this._sortType = SortType.EVENT;

    this._noEventsComponent = new NoEventsComponent();
    this._sortingComponent = null;
    this._tripDaysComponent = null;
    this._eventControllers = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const container = this._container;
    const points = this._pointsModel.getPoints();
    this._points = points;

    if (points.length === 0) {
      render(container, this._noEventsComponent);
      return;
    }

    this._renderSorting(container);
    this._renderDays(points);
    this._renderEvents(points);
  }

  _renderSorting(container) {
    this._sortingComponent = new SortingComponent();

    this._sortingComponent.setSortTypeChangeHandler((evt) => {
      const sortType = evt.target.dataset.sortType;
      let sortedPoints = this._points.slice();

      switch (sortType) {
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
      this._sortingComponent.sortType = sortType;
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
      } else if (points[i].dateFrom.getDate() > points[i - 1].dateFrom.getDate()) {
        j++; // если (дата элемента > даты предыдущего элемента) рендерим в другой день
        this._renderEvent(days[j], points[i]);
      } else { // иначе рендерим в этот же день
        this._renderEvent(days[j], points[i]);
      }
    }
  }

  _onDataChange(oldData, newData) {
    const index = this._points.findIndex((it) => it.id === oldData.id);
    if (index === -1) {
      return;
    }

    if (newData === null) { // DELETING
      this._eventControllers[index].destroy();
      this._pointsModel.removePoint(oldData.id);
      this._eventControllers = [].concat(this._eventControllers.slice(0, index), this._eventControllers.slice(index + 1));

      this._points = this._pointsModel.getPoints();
      this._rerenderBoard();
      console.log(this._points);
    } else {
      this._points = [].concat(this._points.slice(0, index), newData, this._points.slice(index + 1));
      this._eventControllers[index].render(this._points[index]);
    }

  }

  _onViewChange() {
    this._eventControllers.forEach((el) => el.setDefaultView());
  }

  _removePoints() {
    this._eventControllers.forEach((controller) => controller.destroy());
    this._eventControllers = [];
  }

  _removeSorting() {
    remove(this._sortingComponent);
    this._sortingComponent = null;
  }

  _onFilterChange() {
    this._removePoints();
    this._removeSorting();
    this.render();
  }

  _rerenderBoard() {
    const sortType = this._sortingComponent.sortType;
    this._removePoints();

    let sortedPoints = this._points.slice();
    switch (sortType) {
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
}

