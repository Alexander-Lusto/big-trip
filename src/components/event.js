// точка маршрута
import {activityTypes} from "../mock/data";
import {capitalizeFirstLetter} from "../utils/common";
import AbstractComponent from "./abstract-component.js";
import moment from "../../node_modules/moment";

const Preposition = {
  TO: `to`,
  IN: `in`,
};

const SHOWNING_OFFERS_COUNT = 3;
const DEFAULT_DATE_FORMAT = `YYYY-MM-DD[T]HH:MM`;
const DEAULT_TIME_FORMAT = `HH:MM`;

const createEventTemplate = (point) => {
  const {type, destination, price, offers} = point;

  const dateFrom = moment(point.dateFrom).format(DEFAULT_DATE_FORMAT);
  const dateTo = moment(point.dateTo).format(DEFAULT_DATE_FORMAT);
  const timeFrom = moment(point.dateFrom).format(DEAULT_TIME_FORMAT);
  const timeTo = moment(point.dateTo).format(DEAULT_TIME_FORMAT);

  const interval = moment(point.dateTo) - moment(point.dateFrom);
  const durationDays = moment.duration(interval).days();
  const durationHours = moment.duration(interval).hours();
  const durationMinutes = moment.duration(interval).minutes();

  return (`
    <li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${capitalizeFirstLetter(type)} ${activityTypes.some((el) => el === type) ? Preposition.IN : Preposition.TO} ${destination.name}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">
              ${timeFrom}
            </time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">
              ${timeTo}
            </time>
          </p>
          <p class="event__duration">
            ${durationDays ? `${durationDays}D` : ``}
            ${durationHours ? `${durationHours}H` : ``}
            ${durationMinutes}M
          </p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offers.slice(0, SHOWNING_OFFERS_COUNT).map((offer) => createOfferMarkup(offer)).join(`\n`)}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `);
};

const createOfferMarkup = (offer) => {
  return (`
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
    </li>
  `);
};

export default class Event extends AbstractComponent {
  constructor(point) {
    super();
    this._point = point;
  }

  getTemplate() {
    return createEventTemplate(this._point);
  }

  setRollupButtonClickHandler(cb) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, cb);
  }
}
