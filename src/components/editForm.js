// форма создания / редактирования
import {upperCaseFirstLetter} from "../utils";
import {transferTypes, activityTypes, cities} from "../mock/data";
import {offersByType} from "../mock/offers";


const Preposition = {
  TO: `to`,
  IN: `in`,
};

const DEFAULT_TYPE = `flight`;
const DEFAULT_DATE = {
  year: new Date().getFullYear() >= 2100 ? new Date().getFullYear().toString().slice(1) : new Date().getFullYear().toString().slice(2),
  month: new Date().getMonth() < 9 ? `0` + (new Date().getMonth() + 1) : new Date().getMonth() + 1,
  date: new Date().getDate() < 10 ? `0` + new Date().getDate() : new Date().getDate(),
  hour: new Date().getHours() < 10 ? `0` + new Date().getHours() : new Date().getHours(),
  minute: new Date().getMinutes() < 10 ? `0` + new Date().getMinutes() : new Date().getMinutes(),
};

export const createEditFormTemplate = (point) => {
  const type = point ? point.type : DEFAULT_TYPE;
  const destination = point ? point.destination : ``;
  const offers = point ? point.offers : offersByType.find((el) => el.type === DEFAULT_TYPE).offers;
  const price = point ? point.price : ``;

  const dateTo = point ? {
    year: point.dateTo.getFullYear(),
    month: point.dateTo.getMonth() < 9 ? `0` + (point.dateTo.getMonth() + 1) : point.dateTo.getMonth() + 1,
    date: point.dateTo.getDate() < 10 ? `0` + point.dateTo.getDate() : point.dateTo.getDate(),
    hour: point.dateTo.getHours() < 10 ? `0` + point.dateTo.getHours() : point.dateTo.getHours(),
    minute: point.dateTo.getMinutes() < 10 ? `0` + point.dateTo.getMinutes() : point.dateTo.getMinutes(),
  } : DEFAULT_DATE;
  const dateFrom = point ? {
    year: point.dateFrom.getFullYear(),
    month: point.dateFrom.getMonth() < 9 ? `0` + (point.dateFrom.getMonth() + 1) : point.dateFrom.getMonth() + 1,
    date: point.dateFrom.getDate() < 10 ? `0` + point.dateFrom.getDate() : point.dateFrom.getDate(),
    hour: point.dateFrom.getHours() < 10 ? `0` + point.dateFrom.getHours() : point.dateFrom.getHours(),
    minute: point.dateFrom.getMinutes() < 10 ? `0` + point.dateFrom.getMinutes() : point.dateFrom.getMinutes(),
  } : DEFAULT_DATE;

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
            ${upperCaseFirstLetter(type)} ${activityTypes.some((el) => el === type) ? Preposition.IN : Preposition.TO}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination"
            value="${destination ? destination.name : ``}" list="destination-list-1"
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
            value="${dateFrom.year}-${dateFrom.month}-${dateFrom.date} ${dateFrom.hour}:${dateFrom.minute}"
          >
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
            value="${dateTo.year}-${dateTo.month}-${dateTo.date} ${dateTo.hour}:${dateTo.minute}"
          >
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${offers.map((el) => createOfferMarkup(el)).join(`\n`)}
          </div>
        </section>
        ${ destination ? (`
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
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${upperCaseFirstLetter(type)}</label>
    </div>
  `);
};

const createDestinationOptionMarkup = (city) => {
  return `<option value="${city}"></option>`;
};

const createOfferMarkup = (offer, isChecked) => {
  const array = offer.title.split(` `);
  const id = array.length > 3 ? array.slice(array.length - 2).join(` `) : array[array.length - 1];
  return (`
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}-1" type="checkbox" name="event-offer-${id}" ${isChecked ? `checked` : ``}>
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
