import EventEditorComponent from "../components/event-editor";
import EventComponent from "../components/event";
import {render, replace, remove} from "../utils/render";
import {offersByType} from "../mock/offers";
import {destinations} from "../mock/destinations";

export default class EventController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

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
      this._onViewChange();
      this._editMode = true;
    };

    const eventEditorRollupButtonClickHandler = () => {
      replace(this._eventComponent, this._eventEditorComponent);
      document.removeEventListener(`keydown`, documentEscPressHandler);
      this._eventEditorComponent.removeFlatpicr();
      this._editMode = false;
    };

    const eventResetButtonClickHandler = () => {
      replace(this._eventComponent, this._eventEditorComponent);
      document.removeEventListener(`keydown`, documentEscPressHandler);
      this._eventEditorComponent.removeFlatpicr();
      this._editMode = false;
    };

    const eventSaveButtonClickHandler = () => {
      replace(this._eventComponent, this._eventEditorComponent);
      document.removeEventListener(`keydown`, documentEscPressHandler);
      this._eventEditorComponent.removeFlatpicr();
      this._editMode = false;
    };

    const documentEscPressHandler = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        replace(this._eventComponent, this._eventEditorComponent);
        document.removeEventListener(`keydown`, documentEscPressHandler);
        this._eventEditorComponent.removeFlatpicr();
        this._editMode = false;
      }
    };

    const addToFavoriteButtonClickHandler = () => {
      const newPoint = Object.assign({}, point, {isFavorite: !point.isFavorite});
      this._onDataChange(point, newPoint);
    };

    const eventTypeInputChangeHandler = (evt) => {
      const type = evt.target.value;
      const newPoint = Object.assign({}, point, {type, offers: offersByType.find((it) => it.type === type).offers});
      this._onDataChange(point, newPoint);
    };

    const eventDestinationInputChangeHandler = (evt) => {
      const destination = destinations.find((it) => it.name === evt.target.value);
      const newPoint = Object.assign({}, point, {destination});
      this._onDataChange(point, newPoint);
    };

    this._eventComponent.setRollupButtonClickHandler(eventRollupButtonClickHandler);
    this._eventEditorComponent.setSaveButtonClickHandler(eventResetButtonClickHandler);
    this._eventEditorComponent.setResetButtonClickHandler(eventSaveButtonClickHandler);
    this._eventEditorComponent.setRollupButtonClickHandler(eventEditorRollupButtonClickHandler);
    this._eventEditorComponent.setAddToFavoriteButtonClickHandler(addToFavoriteButtonClickHandler);
    this._eventEditorComponent.setEventTypeInputChangeHandler(eventTypeInputChangeHandler);
    this._eventEditorComponent.setEventDestinationInputChangeHandler(eventDestinationInputChangeHandler);
    this._eventEditorComponent.setStartTimeInputFocusHandler();
    this._eventEditorComponent.setEndTimeInputFocusHandler();

    if (this._editMode === true) {
      render(this._container, this._eventEditorComponent, `afterbegin`);
    } else {
      render(this._container, this._eventComponent);
    }
  }

  setDefaultView() {
    if (this._editMode) {
      replace(this._eventComponent, this._eventEditorComponent);
      this._editMode = false;
    }
  }
}
