// Arrays
import {types} from "./data";
import {destinations} from "./destinations";
import {offersByType} from "./offers";
import {getRandomArrayItem, getRandomIntegerNumber, getRandomDate, shuffleArray} from "../utils/common";

let previousDate = null;

// Data-generation
const generatePoint = () => {
  const dateFrom = previousDate ? getRandomDate(previousDate) : getRandomDate(new Date(2022, 4, 20));
  const dateTo = getRandomDate(dateFrom);
  previousDate = dateTo;
  const type = getRandomArrayItem(types);
  const allOffers = offersByType.find((it) => it.type === type).offers;
  const checkedOffers = shuffleArray(allOffers).slice(0, getRandomIntegerNumber(0, allOffers.length - 1));

  return {
    id: Math.random() / Math.random() / Math.random() / Math.random(),
    price: getRandomIntegerNumber(20, 600),
    dateFrom,
    dateTo,
    destination: getRandomArrayItem(destinations),
    isFavorite: Math.random() > 0.8 ? true : false,
    offers: checkedOffers,
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
