//
import {shuffleArray, getRandomIntegerNumber} from "../utils/common";
import {types} from "./data";


const offersOptions = [
  {
    title: `Choose meal`,
    price: 180
  }, {
    title: `Upgrade to comfort class`,
    price: 50
  },
  {
    title: `Upgrade to a business class`,
    price: 120
  },
  {
    title: `Choose the radio station`,
    price: 60
  },
  {
    title: `Add meal`,
    price: 15
  },
  {
    title: `Travel by train`,
    price: 40
  },
  {
    title: `Chose seats`,
    price: 5
  }
];

const generateOffers = (offersMax) => {
  const offers = [];
  for (let i = 0; i < types.length; i++) {
    const offer = {
      type: types[i],
      offers: shuffleArray(offersOptions).slice(0, getRandomIntegerNumber(0, offersMax)),
    };
    offers.push(offer);
  }

  return offers;
};
export const offersByType = generateOffers(5);
