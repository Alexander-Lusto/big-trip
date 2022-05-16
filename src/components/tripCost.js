// стоимость поездки
export const createTripCostTemplate = (points) => {
  const price = points.reduce((sum, current) => sum + current.price, 0);

  return (`
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
    </p>
  `);
};
