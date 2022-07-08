// сортировка
import {capitalizeFirstLetter} from "../utils/common";
import AbstractComponent from "./abstract-component.js";
import {sortTypes, SortType} from "../utils/const";

const DEFAULT_SORT_TYPE = SortType.EVENT;

const createSortingTemplate = (sortType) => {
  return (`
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>
      ${sortTypes.map((el) => createSortMarkup(el, el === sortType ? true : false)).join(`\n`)}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>
  `);
};

const createSortMarkup = (sortType, isChecked) => {
  return (`
    <div class="trip-sort__item  trip-sort__item--${sortType}">
      <input id="sort-${sortType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
        value="sort-${sortType}" ${isChecked ? `checked` : ``} data-sort-type="${sortType}"
      >
      <label class="trip-sort__btn" for="sort-${sortType}">
        ${capitalizeFirstLetter(sortType)}
      </label>
    </div>
  `);
};

export default class Sorting extends AbstractComponent {
  constructor() {
    super();
    this._sortType = DEFAULT_SORT_TYPE;
  }

  getTemplate() {
    return createSortingTemplate(this._sortType);
  }

  get sortType() {
    return this._sortType;
  }

  set sortType(type) {
    this._sortType = type;
  }

  setSortTypeChangeHandler(cb) {
    this.getElement().querySelectorAll(`.trip-sort__item`).forEach((el) => el.addEventListener(`change`, cb));
  }
}
