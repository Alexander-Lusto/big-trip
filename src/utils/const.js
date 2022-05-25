const Month = {
  JAN: `JAN`,
  FEB: `FEB`,
  MAR: `MAR`,
  APR: `APR`,
  MAY: `MAY`,
  JUN: `JUN`,
  JUL: `JUL`,
  AUG: `AUG`,
  SEP: `SEP`,
  OCT: `OCT`,
  NOV: `NOV`,
  DEC: `DEC`,
};

const monthes = [
  Month.JAN,
  Month.FEB,
  Month.MAR,
  Month.APR,
  Month.MAY,
  Month.JUN,
  Month.JUL,
  Month.AUG,
  Month.SEP,
  Month.OCT,
  Month.NOV,
  Month.DEC,
];

const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`,
};
const sortTypes = Object.values(SortType);

const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};
const filters = Object.values(FilterType);

export {monthes, sortTypes, SortType, filters, FilterType};
