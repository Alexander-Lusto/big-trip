import {getTripInfo} from "./components/tripInfo";
import {getTripCost} from "./components/tripCost";
import {getMenu} from "./components/menu";
import {getFilters} from "./components/filters";
import {getSorting} from "./components/sorting";
import {getEditForm} from "./components/editForm";
import {getEvent} from "./components/event";
import {getTripDays} from "./components/tripDays";
import {getTripDay} from "./components/tripDay";
import {generatePoints} from "./mock/generatePoints";

// Отрисовка
const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const tripMain = document.querySelector(`.trip-main`);
const tripMainControls = tripMain.querySelector(`.trip-main__trip-controls`);

render(tripMainControls, getTripInfo(), `beforebegin`);

const tripMainInfo = tripMain.querySelector(`.trip-main__trip-info`);
render(tripMainInfo, getTripCost());

const [tripMainControlsFirstTitle, tripMainControlsSecondTitle] = tripMain.querySelectorAll(`.trip-main__trip-controls h2`);
render(tripMainControlsFirstTitle, getMenu(), `afterend`);
render(tripMainControlsSecondTitle, getFilters(), `afterend`);

const tripEvents = document.querySelector(`.trip-events`);
render(tripEvents, getSorting());
render(tripEvents, getEditForm());
render(tripEvents, getTripDays());

const tripDays = tripEvents.querySelector(`.trip-days`);
render(tripDays, getTripDay());

const eventsList = tripEvents.querySelector(`.trip-events__list`);
const EVENTS_COUNT = 20;
const points = generatePoints(EVENTS_COUNT);
console.log(points);

for (let i = 0; i < EVENTS_COUNT; i++) {
  render(eventsList, getEvent(points[i]));
}
