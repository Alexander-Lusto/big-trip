import {createTripInfoTemplate} from "./components/tripInfo";
import {createTripCostTemplate} from "./components/tripCost";
import {createMenuTemplate} from "./components/menu";
import {createFiltersTemplate} from "./components/filters";
import {createSortingTemplate} from "./components/sorting";
import {createEditFormTemplate} from "./components/editForm";
import {createEventTemplate} from "./components/event";
import {createTripDaysTemplate} from "./components/tripDays";
import {generatePoints} from "./mock/generatePoints";

const EVENTS_COUNT = 20;
const points = generatePoints(EVENTS_COUNT);

// Отрисовка
const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const tripMain = document.querySelector(`.trip-main`);
const tripMainControls = tripMain.querySelector(`.trip-main__trip-controls`);

render(tripMainControls, createTripInfoTemplate(), `beforebegin`);

const tripMainInfo = tripMain.querySelector(`.trip-main__trip-info`);
render(tripMainInfo, createTripCostTemplate());

const [tripMainControlsFirstTitle, tripMainControlsSecondTitle] = tripMain.querySelectorAll(`.trip-main__trip-controls h2`);
render(tripMainControlsFirstTitle, createMenuTemplate(), `afterend`);
render(tripMainControlsSecondTitle, createFiltersTemplate(), `afterend`);

const tripEvents = document.querySelector(`.trip-events`);
render(tripEvents, createSortingTemplate());
render(tripEvents, createEditFormTemplate());
render(tripEvents, createTripDaysTemplate(points));

const eventsList = tripEvents.querySelectorAll(`.trip-events__list`);

let j = 0;
for (let i = 0; i < EVENTS_COUNT; i++) {
  if (i === 0) { // всегда рендерим первый элемент в первый день
    render(eventsList[0], createEventTemplate(points[0]));
  } else if (points[i].dateFrom.getDate() > points[i - 1].dateFrom.getDate()) { // если (дата элемента > даты предыдущего элемента) рендерим в другой день
    j++;
    render(eventsList[j], createEventTemplate(points[i]));
  } else { // иначе рендерим в этот же день
    render(eventsList[j], createEventTemplate(points[i]));
  }
}
