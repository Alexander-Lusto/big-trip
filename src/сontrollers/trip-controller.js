import SortingComponent from "../components/sorting";
import EventEditorComponent from "../components/event-editor";
import EventComponent from "../components/event";
import TripDaysComponent from "../components/trip-days";
import NoEventsComponent from "../components/no-events";
import {render, replace, remove} from "../utils/render";
import {SortType} from "../utils/const";

const EVENTS_COUNT = 20;

const renderEvent = (container, point) => {
  const eventComponent = new EventComponent(point);
  const eventEditorComponent = new EventEditorComponent(point);

  const rollupButtonClickHandler = () => {
    replace(eventEditorComponent, eventComponent);
    document.addEventListener(`keydown`, documentEscPressHandler);
  };

  const eventResetButtonClickHandler = () => {
    replace(eventComponent, eventEditorComponent);
    document.removeEventListener(`keydown`, documentEscPressHandler);
  };

  const eventSaveButtonClickHandler = () => {
    replace(eventComponent, eventEditorComponent);
    document.removeEventListener(`keydown`, documentEscPressHandler);
  };

  const documentEscPressHandler = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      replace(eventComponent, eventEditorComponent);
      document.removeEventListener(`keydown`, documentEscPressHandler);
    }
  };

  eventComponent.setRollupButtonClickHandler(rollupButtonClickHandler);
  eventEditorComponent.setSaveButtonClickHandler(eventResetButtonClickHandler);
  eventEditorComponent.setResetButtonClickHandler(eventSaveButtonClickHandler);

  render(container, eventComponent);
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._noEventsComponent = new NoEventsComponent();
    this._sortingComponent = new SortingComponent();
    this._tripDaysComponent = null;
  }

  render(points) {
    const container = this._container;
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

  renderEvents(points) {
    const days = this._tripDaysComponent.getElement().querySelectorAll(`.trip-events__list`);

    if (days.length === 1) { // если у нас один день (режим сортировки) то рендерим всё в него
      points.forEach((el) => renderEvent(days[0], el));
      return;
    }

    let j = 0;
    for (let i = 0; i < EVENTS_COUNT; i++) {
      if (i === 0) { // всегда рендерим первый элемент в первый день
        renderEvent(days[0], points[0]);
      } else if (points[i].dateFrom.getDate() > points[i - 1].dateFrom.getDate()) { // если (дата элемента > даты предыдущего элемента) рендерим в другой день
        j++;
        renderEvent(days[j], points[i]);
      } else { // иначе рендерим в этот же день
        renderEvent(days[j], points[i]);
      }
    }
  }
}

