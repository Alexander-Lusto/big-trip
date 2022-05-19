// сортировка
import {capitalizeFirstLetter} from "../utils";
import AbstractComponent from "./abstract-component.js";

const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`,
};
const sortTypes = [SortType.EVENT, SortType.TIME, SortType.PRICE];
const DEFAULT_SORT_TYPE = SortType.EVENT;

const createSortingTemplate = () => {
  return (`
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>
      ${sortTypes.map((el) => createSortMarkup(el, el === DEFAULT_SORT_TYPE ? true : false)).join(`\n`)}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>
  `);
};

const createSortMarkup = (sortType, isChecked) => {
  return (`
    <div class="trip-sort__item  trip-sort__item--${sortType}">
      <input id="sort-${sortType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortType}" ${isChecked ? `checked` : ``}>
      <label class="trip-sort__btn" for="sort-${sortType}">
        ${capitalizeFirstLetter(sortType)}
      </label>
    </div>
  `);
};

export default class Sorting extends AbstractComponent {
  getTemplate() {
    return createSortingTemplate();
  }
}
