import FiltersComponent from "../components/filters";
import {FilterType} from "../utils/const";
import {render} from "../utils/render";

export default class FilterController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._filter = FilterType.EVERYTHING;
    this._filterComponent = new FiltersComponent();
  }

  render() {
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
}

