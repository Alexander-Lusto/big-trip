import SortingComponent from "../components/sorting";
import EventEditorComponent from "../components/event-editor";
import EventComponent from "../components/event";
import TripDaysComponent from "../components/trip-days";
import NoEventsComponent from "../components/no-events";
import {render, replace} from "../utils/render";

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

    render(container, this._sortingComponent);

    this._tripDaysComponent = new TripDaysComponent(points);
    render(container, this._tripDaysComponent);

    const eventsList = container.querySelectorAll(`.trip-events__list`);

    let j = 0;
    for (let i = 0; i < EVENTS_COUNT; i++) {
      if (i === 0) { // всегда рендерим первый элемент в первый день
        renderEvent(eventsList[0], points[0]);
      } else if (points[i].dateFrom.getDate() > points[i - 1].dateFrom.getDate()) { // если (дата элемента > даты предыдущего элемента) рендерим в другой день
        j++;
        renderEvent(eventsList[j], points[i]);
      } else { // иначе рендерим в этот же день
        renderEvent(eventsList[j], points[i]);
      }
    }
  }
}

