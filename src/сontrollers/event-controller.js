import EventEditorComponent from "../components/event-editor";
import EventComponent from "../components/event";
import {render, replace, remove} from "../utils/render";
import {offersByType} from "../mock/offers";
import {destinations} from "../mock/destinations";
import moment from "../../node_modules/moment";

const DEFAULT_MOMENT_DATE_FORMAT = `DD/MM/YY HH:MM`;

export default class EventController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._eventStartTime = null;
    this._eventEndTime = null;
    this._offers = null;

    this._eventComponent = null;
    this._eventEditorComponent = null;
    this._point = null;

    this._oldEventComponent = null;
    this._oldEventEditorComponent = null;
    this._oldPoint = null;

    this._editMode = false;
    this._creationMode = false;
    this._documentEscPressHandler = this._documentEscPressHandler.bind(this);
  }

  render(point, isCreating = false) {
    if (isCreating) {
      this._creationMode = true;
      this._editMode = true;
      document.addEventListener(`keydown`, this._documentEscPressHandler);
    }


    if (this._eventComponent && this._eventEditorComponent) {
      remove(this._eventComponent);
      remove(this._eventEditorComponent);
    }

    this._point = point;
    this._offers = this._point.offers;
    this._eventStartTime = this._point.dateFrom;
    this._eventEndTime = this._point.dateTo;

    this._eventComponent = new EventComponent(point);
    this._eventEditorComponent = new EventEditorComponent(point);

    const eventRollupButtonClickHandler = () => {
      this._oldEventComponent = this._eventComponent;
      this._oldEventEditorComponent = this._eventEditorComponent;
      this._oldPoint = point;

      replace(this._eventEditorComponent, this._eventComponent);
      document.addEventListener(`keydown`, this._documentEscPressHandler);
      this._onViewChange();
      this._editMode = true;
    };

    const eventEditorRollupButtonClickHandler = () => {
      document.removeEventListener(`keydown`, this._documentEscPressHandler);
      this._eventEditorComponent.removeFlatpicr();
      this._editMode = false;

      this._eventComponent = this._oldEventComponent;
      this._eventEditorComponent = this._oldEventEditorComponent;
      this._onDataChange(this._point, this._oldPoint);
    };

    const eventResetButtonClickHandler = () => {
      document.removeEventListener(`keydown`, this._documentEscPressHandler);
      this._eventEditorComponent.removeFlatpicr();
      this._onDataChange(point, null);
    };

    const eventSaveButtonClickHandler = (evt) => {
      evt.preventDefault();
      document.removeEventListener(`keydown`, this._documentEscPressHandler);
      this._eventEditorComponent.removeFlatpicr();

      this._editMode = false;
      this._creationMode = false;
      const isFavorite = (point.isFavorite === null) ? (point.isFavorite = false) : point.isFavorite; // null => false для отрисовки блоков favorite и rollup button

      const newPoint = Object.assign({}, point, {offers: this._offers}, {isFavorite}, {dateFrom: this._eventStartTime}, {dateTo: this._eventEndTime});
      this._onDataChange(point, newPoint);
    };

    const addToFavoriteButtonClickHandler = () => {
      const newPoint = Object.assign({}, point, {offers: this._offers}, {isFavorite: !point.isFavorite}, {dateFrom: this._eventStartTime}, {dateTo: this._eventEndTime});
      this._onDataChange(point, newPoint);
    };

    const eventTypeInputChangeHandler = (evt) => {
      const type = evt.target.value;
      const offers = [];

      const newPoint = Object.assign({}, point, {offers}, {type}, {dateFrom: this._eventStartTime}, {dateTo: this._eventEndTime});
      this._onDataChange(point, newPoint);
    };

    const eventDestinationInputChangeHandler = (evt) => {
      const destination = destinations.find((it) => it.name === evt.target.value);
      const newPoint = Object.assign({}, point, {offers: this._offers}, {destination}, {dateFrom: this._eventStartTime}, {dateTo: this._eventEndTime});
      this._onDataChange(point, newPoint);
    };

    const priceInputChangeHandler = (evt) => {
      const newPoint = Object.assign({}, point, {price: Number(evt.target.value)}, {dateFrom: this._eventStartTime}, {dateTo: this._eventEndTime});
      this._onDataChange(point, newPoint);
    };

    const startTimeInputChangeHandler = (evt) => {
      this._eventStartTime = new Date(moment(evt.target.value, DEFAULT_MOMENT_DATE_FORMAT)); // не можем перерендеривать при изменении даты, поэтмоу сохраняем дату в свойство класса
    };

    const endTimeInputChangeHandler = (evt) => {
      this._eventEndTime = new Date(moment(evt.target.value, DEFAULT_MOMENT_DATE_FORMAT)); // не можем перерендеривать при изменении даты, поэтмоу сохраняем дату в свойство класса
    };

    const offersChangeHandler = (evt) => {
      const offerName = evt.target.name.split(`-`).join(` `);
      const allOffers = offersByType.find((el) => this._point.type === el.type).offers;
      const changedOffer = allOffers.find((el) => el.title.toLowerCase() === offerName);
      const isRemoving = this._offers.find((offer) => offer === changedOffer);

      if (isRemoving) {
        this._offers = this._offers.filter((offer) => offer !== changedOffer);
      } else {
        this._offers = this._offers.concat(changedOffer);
      }
    };

    this._eventComponent.setRollupButtonClickHandler(eventRollupButtonClickHandler);
    this._eventEditorComponent.setSaveButtonClickHandler(eventSaveButtonClickHandler);
    this._eventEditorComponent.setResetButtonClickHandler(eventResetButtonClickHandler);
    this._eventEditorComponent.setEventTypeInputChangeHandler(eventTypeInputChangeHandler);
    this._eventEditorComponent.setEventDestinationInputChangeHandler(eventDestinationInputChangeHandler);
    this._eventEditorComponent.setPriceInputChangeHandler(priceInputChangeHandler);
    this._eventEditorComponent.setStartTimeInputChangeHandler(startTimeInputChangeHandler);
    this._eventEditorComponent.setEndTimeInputChangeHandler(endTimeInputChangeHandler);
    this._eventEditorComponent.setOffersChangeHandler(offersChangeHandler);

    if (this._creationMode === false) {
      this._eventEditorComponent.setRollupButtonClickHandler(eventEditorRollupButtonClickHandler);
      this._eventEditorComponent.setAddToFavoriteButtonClickHandler(addToFavoriteButtonClickHandler);
    }

    if (this._editMode === true && this._creationMode === false) { // редактирование
      render(this._container, this._eventEditorComponent, `afterbegin`);
    } else if (this._creationMode === true) { // создание (1 раз)
      const sorting = this._container.querySelector(`.trip-sort`);
      const isNoEvents = sorting ? false : true;
      if (isNoEvents) {
        render(this._container, this._eventEditorComponent);
      } else {
        sorting.insertAdjacentElement(`afterend`, this._eventEditorComponent.getElement());
      }
    } else { // обычный рендер
      render(this._container, this._eventComponent);
    }
  }

  _documentEscPressHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {

      if (this._creationMode) { // удаление при режиме создания
        this._onDataChange(this._point, null);
      } else { // замена на точку маршрута в режиме редактирования
        this._eventComponent = this._oldEventComponent;
        this._eventEditorComponent = this._oldEventEditorComponent;

        this._creationMode = false;
        this._editMode = false;

        this._onDataChange(this._point, this._oldPoint);
      }

      this._eventEditorComponent.removeFlatpicr();
      document.removeEventListener(`keydown`, this._documentEscPressHandler);
    }
  }

  setDefaultView() {
    if (this._editMode) {
      replace(this._eventComponent, this._eventEditorComponent);
      this._editMode = false;
    }
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditorComponent);
    document.removeEventListener(`keydown`, this._documentEscPressHandler);
  }
}
