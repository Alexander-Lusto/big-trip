import FiltersComponent from "../components/filters";
import {FilterType} from "../utils/const";
import {render, remove} from "../utils/render";

export default class FilterController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._filter = FilterType.EVERYTHING;
    this._filterComponent = null;

    this._toDefaultFilter = this._toDefaultFilter.bind(this);
    this._pointsModel.setDataChangeHandler(this._toDefaultFilter);
  }

  render() {
    this._filterComponent = new FiltersComponent();
    const filterChangeHandler = (evt) => {
      const filter = evt.target.value;
      this._onFilterChange(filter);
    };

    this._filterComponent.setFilterChangeHandler(filterChangeHandler);
    render(this._container, this._filterComponent, `beforeend`);
  }

  _onFilterChange(filter) {
    this._pointsModel.setFilter(filter);
    this._filter = filter;
  }

  _toDefaultFilter() { // нигде не используется
    if (this._filterComponent) {
      remove(this._filterComponent);
      this._filterComponent = null;
    }

    this.render();
  }
}

