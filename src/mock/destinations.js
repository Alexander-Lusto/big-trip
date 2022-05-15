import {getRandomIntegerNumber, getRandomArrayItem, shuffleArray} from "../utils";
import {cities} from "./data";

const descriptions = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`,
];

const generatePictures = (picturesAmount) => {
  const pictures = [];
  for (let i = 0; i < picturesAmount; i++) {
    const picture = {
      src: `http://picsum.photos/248/152?r=${Math.random()}`,
      description: getRandomArrayItem(descriptions)
    };
    pictures.push(picture);
  }

  return pictures;
};

const generateDestination = (city, sentencesMax, picturesMax) => {
  return {
    name: city,
    description: shuffleArray(descriptions).slice(0, getRandomIntegerNumber(1, sentencesMax)).join(` `),
    pictures: generatePictures(getRandomIntegerNumber(1, picturesMax))
  };
};

export const destinations = cities.map((el) => generateDestination(el, 5, 5));
