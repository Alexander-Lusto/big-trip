import {FilterType} from "../utils/const";

const getPointsByFilter = (points, filter) => {
  let filteredArray = [];
  switch (filter) {
    case FilterType.EVERYTHING:
      filteredArray = points.slice();
      break;

    case FilterType.FUTURE:
      filteredArray = points.slice().filter((point) => point.dateFrom > new Date());
      break;

    case FilterType.PAST:
      filteredArray = points.slice().filter((point) => point.dateFrom < new Date());
      break;
  }

  return filteredArray;
};

export default class Points {
  constructor() {
    this._points = [];
    this._allPoints = [];

    this._filterChangeHandlers = [];
    this._dataChangeHandlers = [];
    this._filter = FilterType.EVERYTHING;
  }

  getAllPoints() {
    return this._points;
  }

  getPoints() {
    return getPointsByFilter(this._points, this._filter);
  }

  setPoints(points) {
    this._points = points;
    this._callHandlers(this._dataChangeHandlers);
  }

  updatePoint(id, newPoint) {
    const index = this._points.findIndex((it) => it.id === id);
    if (index === -1) {
      return false;
    }

    this._points = [].concat(this._points.slice(0, index), newPoint, this._points.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  removePoint(id) {
    const index = this._points.findIndex((it) => it.id === id);
    if (index === -1) {
      return false;
    }

    this._points = [].concat(this._points.slice(0, index), this._points.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  addPoint(newPoint) {
    this._points = [].concat(this._points, newPoint);
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setFilter(filter) {
    this._filter = filter;
    this._callHandlers(this._filterChangeHandlers);
  }

  getFilter() {
    return this._filter;
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
