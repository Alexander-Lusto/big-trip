import AbstractComponent from "./abstract-component.js";

// копнка создания новой точки маршрута
const createAddNewEventButtonTemplate = () => {
  return (`
    <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>
  `);
};

export default class addNewEventButton extends AbstractComponent {
  constructor() {
    super();
    this._disabledMode = false;

    this._documentEscPressHandler = this._documentEscPressHandler.bind(this);
  }

  getTemplate() {
    return createAddNewEventButtonTemplate();
  }

  setClickHandler(cb) {
    this.getElement().addEventListener(`click`, cb);
  }

  _documentEscPressHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this.turnOffDisabledMode();
      document.removeEventListener(`keydown`, this._documentEscPressHandler);
    }
  }

  turnOffDisabledMode() {
    this._disabledMode = false;
    this.getElement().disabled = false;
  }

  turnOnDisabledMode() {
    this._disabledMode = true;
    this.getElement().disabled = true;
  }
}
