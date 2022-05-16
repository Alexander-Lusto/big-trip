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
    days: getRandomIntegerNumber(0, 2),
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

const upperCaseFirstLetter = (string) => {
  return string.slice(0, 1).toUpperCase() + string.slice(1, string.length);
};

export {getRandomArrayItem, getRandomIntegerNumber, getRandomDate, shuffleArray, upperCaseFirstLetter};
