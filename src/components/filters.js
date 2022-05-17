import {capitalizeFirstLetter, createElement} from "../utils";
const Filter = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};
const DEFAULT_FILTER = Filter.EVERYTHING;
const filters = [Filter.EVERYTHING, Filter.FUTURE, Filter.PAST];


// фильтры
const createFiltersTemplate = () => {
  return (`
    <form class="trip-filters" action="#" method="get">
      ${filters.map((el) => createFilterMarkup(el, el === DEFAULT_FILTER ? true : false)).join(`\n`)}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `);
};

const createFilterMarkup = (filterName, isChecked) => {
  return (`
    <div class="trip-filters__filter">
      <input id="filter-${filterName}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterName}" ${isChecked ? `checked` : ``}>
      <label class="trip-filters__filter-label" for="filter-${filterName}">${capitalizeFirstLetter(filterName)}</label>
    </div>
  `);
};

export default class Filters {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFiltersTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
