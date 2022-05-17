import TripInfoComponent from "./components/tripInfo";
import TripCostComponent from "./components/tripCost";
import MenuComponent from "./components/menu";
import FilterComponent from "./components/filters";
import SortingComponent from "./components/sorting";
import EventEditorComponent from "./components/event-editor";
import EventComponent from "./components/event";
import TripDaysComponent from "./components/tripDays";
import {generatePoints} from "./mock/generatePoints";

const EVENTS_COUNT = 20;
const points = generatePoints(EVENTS_COUNT);


// Отрисовка
const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentElement(place, template);
};

const tripMain = document.querySelector(`.trip-main`);
const tripInfoComponent = new TripInfoComponent(points);
const tripMainControls = tripMain.querySelector(`.trip-main__trip-controls`);
render(tripMainControls, tripInfoComponent.getElement(), `beforebegin`);

const tripCostComponent = new TripCostComponent(points);
const tripMainInfo = tripMain.querySelector(`.trip-main__trip-info`);
render(tripMainInfo, tripCostComponent.getElement());


const menuComponent = new MenuComponent();
const filterComponent = new FilterComponent();
const [tripMainControlsFirstTitle, tripMainControlsSecondTitle] = tripMain.querySelectorAll(`.trip-main__trip-controls h2`);
render(tripMainControlsFirstTitle, menuComponent.getElement(), `afterend`);
render(tripMainControlsSecondTitle, filterComponent.getElement(), `afterend`);

const sortingComponent = new SortingComponent();
const tripEvents = document.querySelector(`.trip-events`);
render(tripEvents, sortingComponent.getElement());

const eventEditorComponent = new EventEditorComponent(points[0]);
render(tripEvents, eventEditorComponent.getElement());

const tripDaysComponent = new TripDaysComponent(points);
render(tripEvents, tripDaysComponent.getElement());


const eventsList = tripEvents.querySelectorAll(`.trip-events__list`);

let j = 0;
for (let i = 0; i < EVENTS_COUNT; i++) {
  if (i === 0) { // всегда рендерим первый элемент в первый день
    render(eventsList[0], new EventComponent(points[0]).getElement());
  } else if (points[i].dateFrom.getDate() > points[i - 1].dateFrom.getDate()) { // если (дата элемента > даты предыдущего элемента) рендерим в другой день
    j++;
    render(eventsList[j], new EventComponent(points[i]).getElement());
  } else { // иначе рендерим в этот же день
    render(eventsList[j], new EventComponent(points[i]).getElement());
  }
}
