import EventEditorComponent from "../components/event-editor";
import EventComponent from "../components/event";
import {render, replace} from "../utils/render";

export default class EventController {
  constructor(container) {
    this._container = container;

    this._eventComponent = null;
    this._eventEditorComponent = null;
  }

  render(point) {
    this._eventComponent = new EventComponent(point);
    this._eventEditorComponent = new EventEditorComponent(point);

    const rollupButtonClickHandler = () => {
      replace(this._eventEditorComponent, this._eventComponent);
      document.addEventListener(`keydown`, documentEscPressHandler);
    };

    const eventResetButtonClickHandler = () => {
      replace(this._eventComponent, this._eventEditorComponent);
      document.removeEventListener(`keydown`, documentEscPressHandler);
    };

    const eventSaveButtonClickHandler = () => {
      replace(this._eventComponent, this._eventEditorComponent);
      document.removeEventListener(`keydown`, documentEscPressHandler);
    };

    const documentEscPressHandler = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        replace(this._eventComponent, this._eventEditorComponent);
        document.removeEventListener(`keydown`, documentEscPressHandler);
      }
    };

    this._eventComponent.setRollupButtonClickHandler(rollupButtonClickHandler);
    this._eventEditorComponent.setSaveButtonClickHandler(eventResetButtonClickHandler);
    this._eventEditorComponent.setResetButtonClickHandler(eventSaveButtonClickHandler);

    render(this._container, this._eventComponent);
  }
}
