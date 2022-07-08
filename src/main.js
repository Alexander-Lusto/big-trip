import TripInfoComponent from "./components/trip-info";
import TripCostComponent from "./components/trip-cost";
import MenuComponent from "./components/menu";
import NewEventButtonComponent from "./components/add-new-event-button";
import {generatePoints} from "./mock/generatePoints";
import {render} from "./utils/render";
import TripController from "./сontrollers/trip-controller";
import PointsModel from "./models/points";
import FilterController from "./сontrollers/filter-controller";

const EVENTS_COUNT = 10;
const pointsModel = new PointsModel();
pointsModel.setPoints(generatePoints(EVENTS_COUNT));

// Отрисовка
const tripMain = document.querySelector(`.trip-main`);
const tripEvents = document.querySelector(`.trip-events`);

const tripInfoComponent = new TripInfoComponent(pointsModel.getPoints());
const tripMainControls = tripMain.querySelector(`.trip-main__trip-controls`);
render(tripMainControls, tripInfoComponent, `beforebegin`);

const tripCostComponent = new TripCostComponent(pointsModel.getPoints());
const tripMainInfo = tripMain.querySelector(`.trip-main__trip-info`);
render(tripMainInfo, tripCostComponent);

const tripController = new TripController(tripEvents, pointsModel);
const newEventButton = new NewEventButtonComponent();
tripController.addNewEventButtonComponent(newEventButton);
newEventButton.setClickHandler(tripController._onNewEventButtonClick);
render(tripMain, newEventButton);

const menuComponent = new MenuComponent();

const tripComtrols = tripMain.querySelector(`.trip-controls`);
const tripMainControlsFirstTitle = tripMain.querySelector(`.trip-main__trip-controls h2`);
render(tripMainControlsFirstTitle, menuComponent, `afterend`);

const filterController = new FilterController(tripComtrols, pointsModel);
filterController.render();
tripController.render();
