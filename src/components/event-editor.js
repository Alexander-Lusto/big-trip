// форма создания / редактирования
import {capitalizeFirstLetter} from "../utils/common";
import {transferTypes, activityTypes, cities} from "../mock/data";
import {offersByType} from "../mock/offers";
import AbstractComponent from "./abstract-component";
import flatpickr from "../../node_modules/flatpickr";
import "../../node_modules/flatpickr/dist/flatpickr.min.css";
import moment from "../../node_modules/moment";

const Preposition = {
  TO: `to`,
  IN: `in`,
};
const DEFAULT_MOMENT_DATE_FORMAT = `DD/MM/YY HH:MM`;
const DEFAULT_FLATPICR_DATE_FORMAT = `d/m/y H:i`;
const DEFAULT_TYPE = `flight`;

const createEventEditorTemplate = (point) => {
  const {type, destination, price, isFavorite} = point;

  const allOffers = offersByType.find((it) => it.type === type).offers;
  const offers = point ? point.offers : offersByType.find((el) => el.type === DEFAULT_TYPE).offers;
  const dateFrom = moment(point.dateFrom).format(DEFAULT_MOMENT_DATE_FORMAT);
  const dateTo = moment(point.dateTo).format(DEFAULT_MOMENT_DATE_FORMAT);

  return (`
    <form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${transferTypes.map((el) => createTypeMarkup(el, el === type)).join(`\n`)}
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${activityTypes.map((el) => createTypeMarkup(el, el === type)).join(`\n`)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${capitalizeFirstLetter(type)} ${activityTypes.some((el) => el === type) ? Preposition.IN : Preposition.TO}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination"
            value="${destination ? destination.name : ``}" list="destination-list-1"
            pattern="${cities.map((el) => (el)).join(`|`)}"
            required
          >
          <datalist id="destination-list-1">
            ${cities.map((el) => createDestinationOptionMarkup(el)).join(`\n`)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
            value="${dateFrom}"
          >
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
            value="${dateTo}"
          >
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price}" min="0" required>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        ${isFavorite !== null ? (`
        <button class="event__reset-btn" type="reset">Delete</button>
        `) : (`
        <button class="event__reset-btn" type="reset">Cancel</button>
        `)}
        ${isFavorite !== null ? (`
        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
        `) : ``}
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${allOffers.map((offer) => createOfferMarkup(offer, offer === offers.find((checkedOffer) => checkedOffer === offer))).join(`\n`)}
          </div>
        </section>
        ${destination ? (`
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">
            ${destination.description}
          </p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${destination.pictures.map((el) => createDestinationPhotoMarkup(el)).join(`\n`)}
            </div>
          </div>
        </section>
        `) : ``}
      </section>
    </form>
  `);
};

const createTypeMarkup = (type, isChecked) => {
  return (`
    <div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isChecked ? `checked` : ``}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalizeFirstLetter(type)}</label>
    </div>
  `);
};

const createDestinationOptionMarkup = (city) => {
  return `<option value="${city}"></option>`;
};

const createOfferMarkup = (offer, isChecked) => {
  const array = offer.title.toLowerCase().split(` `);
  const id = array.slice(array.length - 2).join(`-`);
  const name = array.join(`-`);
  return (`
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}-1" type="checkbox" name="${name}" ${isChecked ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${id}-1">
        <span class="event__offer-title">${offer.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
  `);
};

const createDestinationPhotoMarkup = (picture) => {
  return (`
    <img class="event__photo" src="${picture.src}" alt="${picture.description}">
  `);
};

export default class EventEditor extends AbstractComponent {
  constructor(point) {
    super();
    this._point = point;
    this._flatpicrStart = null;
    this._flatpicrEnd = null;
  }

  getTemplate() {
    return createEventEditorTemplate(this._point);
  }

  setSaveButtonClickHandler(cb) {
    this.getElement().querySelector(`.event__save-btn`).addEventListener(`click`, cb);
  }

  setResetButtonClickHandler(cb) {
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, cb);
  }

  setRollupButtonClickHandler(cb) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, cb);
  }

  setAddToFavoriteButtonClickHandler(cb) {
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, cb);
  }

  setEventTypeInputChangeHandler(cb) {
    this.getElement().querySelectorAll(`.event__type-input`).forEach((el) => el.addEventListener(`change`, cb));
  }

  setEventDestinationInputChangeHandler(cb) {
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, cb);
  }

  setStartTimeInputChangeHandler(cb) {
    const inputFrom = this.getElement().querySelector(`#event-start-time-1`);
    const startTimeInputFocusHandler = () => {
      this.removeFlatpicr();
      this._flatpicrStart = flatpickr(inputFrom, {
        enableTime: true,
        dateFormat: DEFAULT_FLATPICR_DATE_FORMAT,
        [`time_24hr`]: true,
        minDate: `today`,
      });
    };
    inputFrom.addEventListener(`focus`, startTimeInputFocusHandler);
    inputFrom.addEventListener(`change`, cb);
  }

  setEndTimeInputChangeHandler(cb) {
    const inputTo = this.getElement().querySelector(`#event-end-time-1`);
    const endTimeInputFocusHandler = () => {
      this.removeFlatpicr();
      this._flatpicrEnd = flatpickr(inputTo, {
        enableTime: true,
        dateFormat: DEFAULT_FLATPICR_DATE_FORMAT,
        [`time_24hr`]: true,
        minDate: moment(this._point.dateFrom).format(DEFAULT_MOMENT_DATE_FORMAT),
      });
    };
    inputTo.addEventListener(`focus`, endTimeInputFocusHandler);
    inputTo.addEventListener(`change`, cb);
  }

  setPriceInputChangeHandler(cb) {
    this.getElement().querySelector(`.event__input--price`).addEventListener(`change`, cb);
  }

  setOffersChangeHandler(cb) {
    this.getElement().querySelectorAll(`.event__offer-checkbox`).forEach((el) => {
      el.addEventListener(`change`, cb);
    });
  }

  removeFlatpicr() {
    if (this._flatpicrStart) {
      this._flatpicrStart.destroy();
      this._flatpicrStart = null;
    }

    if (this._flatpicrEnd) {
      this._flatpicrEnd.destroy();
      this._flatpicrEnd = null;
    }
  }
}
