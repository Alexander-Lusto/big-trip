// информация о маршруте
import {monthes} from "../const";
import {createElement} from "../utils";

const createTripInfoTemplate = (points) => {
  const place = {
    first: points[0].destination.name,
    second: points[1].destination.name,
    third: points[2].destination.name,
    last: points[points.length - 1].destination.name,
  };

  const dateFrom = {
    month: points[0].dateFrom.getMonth(),
    date: points[0].dateFrom.getDate(),
  };

  const dateTo = {
    month: points[points.length - 1].dateFrom.getMonth(),
    date: points[points.length - 1].dateFrom.getDate(),
  };

  return (`
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">
          ${place.first}
          &mdash; ${points.length > 3 ? `...` : place.second}
          &mdash; ${points.length > 3 ? place.last : place.third}
        </h1>
        <p class="trip-info__dates">
          ${monthes[dateFrom.month]} ${dateFrom.date}
          &nbsp;&mdash;&nbsp;
          ${dateFrom.month === dateTo.month ? `` : monthes[dateTo.month]} ${dateTo.date}
          </p>
      </div>
    </section>
  `);
};

export default class TripInfo {
  constructor(points) {
    this._points = points;
    this._element = null;
  }

  getTemplate() {
    return createTripInfoTemplate(this._points);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
