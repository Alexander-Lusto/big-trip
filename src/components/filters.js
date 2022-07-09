// фильтры
import {filters, FilterType} from "../utils/const";
import {capitalizeFirstLetter} from "../utils/common";
import AbstractComponent from "./abstract-component.js";


const DEFAULT_FILTER = FilterType.EVERYTHING;


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

export default class Filters extends AbstractComponent {
  getTemplate() {
    return createFiltersTemplate();
  }

  setFilterChangeHandler(cb) {
    this.getElement().querySelectorAll(`.trip-filters__filter-input `).forEach((el) => el.addEventListener(`change`, cb));
  }
}
