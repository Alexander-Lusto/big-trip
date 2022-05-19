// дни
import {monthes} from "../utils/const";
import AbstractComponent from "./abstract-component.js";

const createTripDaysTemplate = (points) => {
  if (!points) {
    return (`
      <ul class="trip-days">
        <li class="trip-days__item  day">
          <div class="day__info">
          </div>
          <ul class="trip-events__list"></ul>
        </li>
      </ul>
    `);
  }

  const sortedPoints = points.slice().sort((left, rigth) => left.dateFrom - rigth.dateFrom);
  const filteredPoints = sortedPoints.filter((el, i, arr) => {
    if (i === 0) { // всегда возвращаем первый элемент
      return true;
    } else if (el.dateFrom.getDate() > arr[i - 1].dateFrom.getDate()) { // если дата элемента > даты предыдущего элемента
      return true;
    } else { // иначе пропускаем этот элемент
      return false;
    }
  });

  return (`
    <ul class="trip-days">
      ${filteredPoints.map((el, i) => createTripDayMarkup(el, i + 1)).join(`\n`)}
    </ul>
  `);
};

const createTripDayMarkup = (point, day) => {
  const dateFrom = {
    year: point.dateFrom.getFullYear(),
    month: point.dateFrom.getMonth() < 10 ? `0` + point.dateFrom.getMonth() : point.dateFrom.getMonth(),
    date: point.dateFrom.getDate() < 10 ? `0` + point.dateFrom.getDate() : point.dateFrom.getDate(),
  };
  const month = monthes[point.dateFrom.getMonth()];
  const date = point.dateFrom.getDate();

  return (`
    <li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${day}</span>
        <time class="day__date" datetime="${dateFrom.year}-${dateFrom.month}-${dateFrom.date}">
          ${month} ${date}
        </time>
      </div>

      <ul class="trip-events__list">
      </ul>
    </li>
  `);
};

export default class TripDays extends AbstractComponent {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTripDaysTemplate(this._points);
  }
}

