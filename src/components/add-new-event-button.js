import AbstractComponent from "./abstract-component.js";

// конпка добавления новой точки маршрута
const addNewEventButtonTemplate = () => {
  return (`
    <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>
  `);
};

export default class AddNewEventButton extends AbstractComponent {

  getTemplate() {
    return addNewEventButtonTemplate();
  }

  setClickHandler(cb) {
    this._getElement().addEventListener(`click`, cb);
  }
}
