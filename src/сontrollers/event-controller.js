import EventEditorComponent from "../components/event-editor";
import EventComponent from "../components/event";
import {render, replace, remove} from "../utils/render";

export default class EventController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;

    this._eventComponent = null;
    this._eventEditorComponent = null;
    this._editMode = false;
  }

  render(point) {
    if (this._eventComponent && this._eventEditorComponent) {
      remove(this._eventComponent);
      remove(this._eventEditorComponent);
    }

    this._eventComponent = new EventComponent(point);
    this._eventEditorComponent = new EventEditorComponent(point);

    const eventRollupButtonClickHandler = () => {
      replace(this._eventEditorComponent, this._eventComponent);
      document.addEventListener(`keydown`, documentEscPressHandler);
      this._editMode = true;
    };

    const eventEditorRollupButtonClickHandler = () => {
      replace(this._eventComponent, this._eventEditorComponent);
      document.removeEventListener(`keydown`, documentEscPressHandler);
      this._editMode = false;
    };

    const eventResetButtonClickHandler = () => {
      replace(this._eventComponent, this._eventEditorComponent);
      document.removeEventListener(`keydown`, documentEscPressHandler);
      this._editMode = false;
    };

    const eventSaveButtonClickHandler = () => {
      replace(this._eventComponent, this._eventEditorComponent);
      document.removeEventListener(`keydown`, documentEscPressHandler);
      this._editMode = false;
    };

    const documentEscPressHandler = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        replace(this._eventComponent, this._eventEditorComponent);
        document.removeEventListener(`keydown`, documentEscPressHandler);
        this._editMode = false;
      }
    };

    const addToFavoriteButtonClickHandler = () => {
      const newPoint = Object.assign({}, point, { isFavorite: !point.isFavorite });
      this._onDataChange(point, newPoint);
    };

    this._eventComponent.setRollupButtonClickHandler(eventRollupButtonClickHandler);
    this._eventEditorComponent.setSaveButtonClickHandler(eventResetButtonClickHandler);
    this._eventEditorComponent.setResetButtonClickHandler(eventSaveButtonClickHandler);
    this._eventEditorComponent.setRollupButtonClickHandler(eventEditorRollupButtonClickHandler);
    this._eventEditorComponent.setAddToFavoriteButtonClickHandler(addToFavoriteButtonClickHandler);

    if (this._editMode === true) {
      render(this._container, this._eventEditorComponent, `afterbegin`);
    } else {
      render(this._container, this._eventComponent);
    }
  }
}
