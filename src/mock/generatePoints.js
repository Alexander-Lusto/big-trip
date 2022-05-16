// Arrays
import {types} from "./data";
import {destinations} from "./destinations";
import {offersByType} from "./offers";
import {getRandomArrayItem, getRandomIntegerNumber, getRandomDate} from "../utils";

let previousDate = null;

// Data-generation
const generatePoint = () => {
  const dateFrom = previousDate ? getRandomDate(previousDate) : getRandomDate();
  const dateTo = getRandomDate(dateFrom);
  previousDate = dateTo;
  const type = getRandomArrayItem(types);

  return {
    price: getRandomIntegerNumber(20, 600),
    dateFrom,
    dateTo,
    destination: getRandomArrayItem(destinations),
    isFavorite: Math.random() > 0.8 ? true : false,
    offers: offersByType.find((it) => it.type === type).offers,
    type
  };
};

export const generatePoints = (number) => {
  const points = [];
  for (let i = 0; i < number; i++) {
    points.push(generatePoint());
  }
  return points;
};
