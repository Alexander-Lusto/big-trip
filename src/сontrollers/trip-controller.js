import SortingComponent from "../components/sorting";
import TripDaysComponent from "../components/trip-days";
import NoEventsComponent from "../components/no-events";
import EventController from "./event-controller";
import {render, remove} from "../utils/render";
import {SortType} from "../utils/const";

export default class TripController {
  constructor(container) {
    this._container = container;

    this._noEventsComponent = new NoEventsComponent();
    this._sortingComponent = new SortingComponent();
    this._tripDaysComponent = null;
    this._eventControllers = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  render(points) {
    const container = this._container;
    this._points = points;

    if (points.length === 0) {
      render(container, this._noEventsComponent);
      return;
    }

    this._sortingComponent.setSortTypeChangeHandler((evt) => {
      const sortType = evt.target.dataset.sortType;
      let sortedPoints = points.slice();

      switch (sortType) {
        case SortType.EVENT: {
          this.renderDays(sortedPoints);
          this.renderEvents(sortedPoints);
          break;
        }

        case SortType.PRICE: {
          sortedPoints = sortedPoints.sort((a, b) => b.price - a.price);
          this.renderDays();
          this.renderEvents(sortedPoints);
          break;
        }

        case SortType.TIME: {
          sortedPoints = sortedPoints.sort((a, b) => (b.dateTo - b.dateFrom) - (a.dateTo - a.dateFrom));
          this.renderDays();
          this.renderEvents(sortedPoints);
          break;
        }
      }
      this._sortingComponent.sortType = sortType;
    });
    render(container, this._sortingComponent);

    this.renderDays(points);
    this.renderEvents(points);
  }

  renderDays(points) {
    if (this._tripDaysComponent) {
      remove(this._tripDaysComponent);
    }
    this._tripDaysComponent = new TripDaysComponent(points);
    render(this._container, this._tripDaysComponent);
  }

  renderEvent(container, point) {
    const eventController = new EventController(container, this._onDataChange, this._onViewChange);
    this._eventControllers.push(eventController);
    eventController.render(point);
  }

  renderEvents(points) {
    const days = this._tripDaysComponent.getElement().querySelectorAll(`.trip-events__list`);

    if (days.length === 1) { // если у нас один день (режим сортировки) то рендерим всё в него
      points.forEach((point) => {
        this.renderEvent(days[0], point);
      });
      return;
    }

    let j = 0;
    for (let i = 0; i < points.length; i++) {
      if (i === 0) { // всегда рендерим первый элемент в первый день
        this.renderEvent(days[0], points[0]);
      } else if (points[i].dateFrom.getDate() > points[i - 1].dateFrom.getDate()) {
        j++; // если (дата элемента > даты предыдущего элемента) рендерим в другой день
        this.renderEvent(days[j], points[i]);
      } else { // иначе рендерим в этот же день
        this.renderEvent(days[j], points[i]);
      }
    }
  }

  _onDataChange(oldData, newData) {
    const index = this._points.findIndex((it) => it === oldData);
    if (index === -1) {
      return;
    }

    this._points = [].concat(this._points.slice(0, index), newData, this._points.slice(index + 1));
    this._eventControllers[index].render(this._points[index]);
  }

  _onViewChange() {
    this._eventControllers.forEach((el) => el.setDefaultView());
  }
}

