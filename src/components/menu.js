import AbstractComponent from "./abstract-component.js";

// меню
const createMenuTemplate = () => {
  return (`
    <nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn trip-tabs__btn--active" href="#">Table</a>
      <a class="trip-tabs__btn" href="#">Stats</a>
    </nav>
  `);
};

export default class Menu extends AbstractComponent {
  getTemplate() {
    return createMenuTemplate();
  }

  setMenuItemClickHandler(cb) {
    const menuItems = this.getElement().querySelectorAll(`.trip-tabs__btn`);

    menuItems.forEach((el) => el.addEventListener(`click`, (evt) => {

      menuItems.forEach((item) => item.classList.remove(`trip-tabs__btn--active`));
      evt.target.classList.add(`trip-tabs__btn--active`);
      cb(evt);

    }));
  }
}
