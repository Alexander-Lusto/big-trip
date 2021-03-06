import {createElement} from "../utils/render";


export default class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate Abstract class, only concrete one.`);
    }
    this._element = null;
  }

  getTemplate() {
    throw new Error(`Abstract method not implemented: ${this.getTemplate.name}`);
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

  show() {
    this._element.classList.remove(`hidden`);
  }

  hide() {
    this._element.classList.add(`hidden`);
  }
}
