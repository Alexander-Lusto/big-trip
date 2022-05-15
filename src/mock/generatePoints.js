// Arrays
import {types} from "./data";
import {destinations} from "./destinations";
import {offersByType} from "./offers";
import {getRandomArrayItem, getRandomIntegerNumber, getRandomDate} from "../utils";

// Data-generation
const generatePoint = () => {
  const dateFrom = getRandomDate();
  const dateTo = getRandomDate(dateFrom, dateFrom + 3, dateFrom);
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
