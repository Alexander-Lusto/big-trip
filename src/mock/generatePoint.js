// Arrays
const types = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`, `Restaurant`];
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

const cities = [
  `London`,
  `Paris`,
  `Los-Angeles`,
  `Moscow`,
  `Saint-Peterburg`,
  `Tbilisi`,
  `Batumi`,
  `Lviv`,
  `Odessa`,
  `New-York`,
];

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

// Utility Functions
const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const getRandomDate = (startDate) => {
  const targetDate = startDate ? new Date(startDate) : new Date();
  const duration = {
    days: getRandomIntegerNumber(0, 3),
    hours: getRandomIntegerNumber(0, 24),
    minutes: getRandomIntegerNumber(0, 60),
  };

  targetDate.setDate(targetDate.getDate() + duration.days);
  targetDate.setHours(targetDate.getHours() + duration.hours, targetDate.getMinutes() + duration.minutes);

  return targetDate;
};

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};


// Data-generation
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

const offers = generateOffers(5);

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

const generateDestination = (commentsMax, picturesMax) => {
  return {
    name: getRandomArrayItem(cities),
    description: shuffleArray(descriptions).slice(0, getRandomIntegerNumber(1, commentsMax)),
    pictures: generatePictures(getRandomIntegerNumber(1, picturesMax))
  };
};

const generatePoint = () => {
  const dateFrom = getRandomDate();
  const dateTo = getRandomDate(dateFrom, dateFrom + 3, dateFrom);
  const type = getRandomArrayItem(types);
  return {
    price: getRandomIntegerNumber(20, 600),
    dateFrom,
    dateTo,
    destination: generateDestination(5, 5).name,
    isFavorite: Math.random() > 0.8 ? true : false,
    offers: offers.find((it) => it.type === type).offers,
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
