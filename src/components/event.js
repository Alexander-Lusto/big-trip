// точка маршрута
import {activityTypes} from "../mock/data";
import {capitalizeFirstLetter} from "../utils";
import AbstractComponent from "./abstract-component.js";

const Preposition = {
  TO: `to`,
  IN: `in`,
};

const SHOWNING_OFFERS_COUNT = 3;

const createEventTemplate = (point) => {
  const {type, destination, price, offers} = point;

  const dateFrom = {
    year: point.dateFrom.getFullYear(),
    month: point.dateFrom.getMonth() < 10 ? `0` + point.dateFrom.getMonth() : point.dateFrom.getMonth(),
    date: point.dateFrom.getDate() < 10 ? `0` + point.dateFrom.getDate() : point.dateFrom.getDate(),
    hour: point.dateFrom.getHours() < 10 ? `0` + point.dateFrom.getHours() : point.dateFrom.getHours(),
    minute: point.dateFrom.getMinutes() < 10 ? `0` + point.dateFrom.getMinutes() : point.dateFrom.getMinutes(),
  };

  const dateTo = {
    year: point.dateTo.getFullYear(),
    month: point.dateTo.getMonth() < 10 ? `0` + point.dateTo.getMonth() : point.dateTo.getMonth(),
    date: point.dateTo.getDate() < 10 ? `0` + point.dateTo.getDate() : point.dateTo.getDate(),
    hour: point.dateTo.getHours() < 10 ? `0` + point.dateTo.getHours() : point.dateTo.getHours(),
    minute: point.dateTo.getMinutes() < 10 ? `0` + point.dateTo.getMinutes() : point.dateTo.getMinutes(),
  };

  const durationMinutes = Math.floor((point.dateTo.getTime() - point.dateFrom.getTime()) / 1000 / 60 % 60);
  const durationHours = Math.floor((point.dateTo.getTime() - point.dateFrom.getTime()) / 1000 / 60 / 60 % 24);
  const durationDays = Math.floor((point.dateTo.getTime() - point.dateFrom.getTime()) / 1000 / 60 / 60 / 24);

  let duration = ``;
  duration += durationDays ? `${durationDays}D ` : ``;
  duration += durationHours ? `${durationHours}H ` : ``;
  duration += `${durationMinutes}M`;

  return (`
    <li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${capitalizeFirstLetter(type)} ${activityTypes.some((el) => el === type) ? Preposition.IN : Preposition.TO} ${destination.name}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom.year}-${dateFrom.month}-${dateFrom.date}T${dateFrom.hour}:${dateFrom.minute}">
              ${dateFrom.hour}:${dateFrom.minute}
            </time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo.year}-${dateTo.month}-${dateTo.date}T${dateTo.hour}:${dateTo.minute}">
              ${dateTo.hour}:${dateTo.minute}
            </time>
          </p>
          <p class="event__duration">
            ${duration}
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
}


