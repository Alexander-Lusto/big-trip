import AbstractComponent from "./abstract-component.js";

// стоимость поездки
const createTripCostTemplate = (points) => {
  const price = points ? points.reduce((sum, current) => sum + current.price, 0) : 0;

  return (`
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
    </p>
  `);
};

export default class TripCost extends AbstractComponent {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTripCostTemplate(this._points);
  }
}
