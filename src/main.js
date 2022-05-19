import TripInfoComponent from "./components/trip-info";
import TripCostComponent from "./components/trip-cost";
import MenuComponent from "./components/menu";
import FilterComponent from "./components/filters";
import SortingComponent from "./components/sorting";
import EventEditorComponent from "./components/event-editor";
import EventComponent from "./components/event";
import TripDaysComponent from "./components/trip-days";
import NoEventsComponent from "./components/no-events";
import {generatePoints} from "./mock/generatePoints";

const EVENTS_COUNT = 20;
const events = generatePoints(EVENTS_COUNT);

// Отрисовка
const render = (container, component, place = `beforeend`) => {
  const element = component.getElement();
  container.insertAdjacentElement(place, element);
};

const replace = (newComponent, oldComponent) => {
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();
  const parentElement = oldComponent.getElement().parentElement;

  const isExistElements = !!(parentElement && newElement && oldElement);
  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replace(newElement, oldElement);
  }
};

const renderEvent = (container, point) => {
  const eventComponent = new EventComponent(point);
  const event = eventComponent.getElement();
  const rollupButton = event.querySelector(`.event__rollup-btn`);

  const eventEditorComponent = new EventEditorComponent(point);
  const eventEditor = eventEditorComponent.getElement();
  const eventResetButton = eventEditor.querySelector(`.event__reset-btn`);
  const eventSaveButton = eventEditor.querySelector(`.event__save-btn`);

  const rollupButtonClickHandler = () => {
    replace(eventEditorComponent, eventComponent);
    document.addEventListener(`keydown`, documentEscPressHandler);
  };

  const eventResetButtonClickHandler = () => {
    replace(eventComponent, eventEditorComponent);
    document.removeEventListener(`keydown`, documentEscPressHandler);
  };

  const eventSaveButtonClickHandler = () => {
    replace(eventComponent, eventEditorComponent);
    document.removeEventListener(`keydown`, documentEscPressHandler);
  };

  const documentEscPressHandler = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      replace(eventComponent, eventEditorComponent);
      document.removeEventListener(`keydown`, documentEscPressHandler);
    }
  };

  rollupButton.addEventListener(`click`, rollupButtonClickHandler);
  eventResetButton.addEventListener(`click`, eventResetButtonClickHandler);
  eventSaveButton.addEventListener(`click`, eventSaveButtonClickHandler);

  render(container, eventComponent);
};

const renderTrip = (container, points) => {
  if (points.length === 0) {
    const noEventsComponent = new NoEventsComponent();
    render(container, noEventsComponent);
    return;
  }

  const sortingComponent = new SortingComponent();
  render(container, sortingComponent);

  const tripDaysComponent = new TripDaysComponent(points);
  render(container, tripDaysComponent);

  const eventsList = container.querySelectorAll(`.trip-events__list`);

  let j = 0;
  for (let i = 0; i < EVENTS_COUNT; i++) {
    if (i === 0) { // всегда рендерим первый элемент в первый день
      renderEvent(eventsList[0], points[0]);
    } else if (points[i].dateFrom.getDate() > points[i - 1].dateFrom.getDate()) { // если (дата элемента > даты предыдущего элемента) рендерим в другой день
      j++;
      renderEvent(eventsList[j], points[i]);
    } else { // иначе рендерим в этот же день
      renderEvent(eventsList[j], points[i]);
    }
  }
};

const tripMain = document.querySelector(`.trip-main`);
const tripInfoComponent = new TripInfoComponent(events);
const tripMainControls = tripMain.querySelector(`.trip-main__trip-controls`);
render(tripMainControls, tripInfoComponent, `beforebegin`);

const tripCostComponent = new TripCostComponent(events);
const tripMainInfo = tripMain.querySelector(`.trip-main__trip-info`);
render(tripMainInfo, tripCostComponent);


const menuComponent = new MenuComponent();
const filterComponent = new FilterComponent();
const [tripMainControlsFirstTitle, tripMainControlsSecondTitle] = tripMain.querySelectorAll(`.trip-main__trip-controls h2`);
render(tripMainControlsFirstTitle, menuComponent, `afterend`);
render(tripMainControlsSecondTitle, filterComponent, `afterend`);

const tripEvents = document.querySelector(`.trip-events`);

renderTrip(tripEvents, events);
