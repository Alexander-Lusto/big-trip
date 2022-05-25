import TripInfoComponent from "./components/trip-info";
import TripCostComponent from "./components/trip-cost";
import MenuComponent from "./components/menu";
import FilterComponent from "./components/filters";
import {generatePoints} from "./mock/generatePoints";
import {render} from "./utils/render";
import TripController from "./сontrollers/trip-controller";
import PointsModel from "./models/points";

const EVENTS_COUNT = 10;
const pointsModel = new PointsModel();
pointsModel.setPoints(generatePoints(EVENTS_COUNT));
console.log(pointsModel.getPoints());

// Отрисовка
const tripMain = document.querySelector(`.trip-main`);
const tripInfoComponent = new TripInfoComponent(pointsModel.getPoints());
const tripMainControls = tripMain.querySelector(`.trip-main__trip-controls`);
render(tripMainControls, tripInfoComponent, `beforebegin`);

const tripCostComponent = new TripCostComponent(pointsModel.getPoints());
const tripMainInfo = tripMain.querySelector(`.trip-main__trip-info`);
render(tripMainInfo, tripCostComponent);


const menuComponent = new MenuComponent();
const filterComponent = new FilterComponent();
const [tripMainControlsFirstTitle, tripMainControlsSecondTitle] = tripMain.querySelectorAll(`.trip-main__trip-controls h2`);
render(tripMainControlsFirstTitle, menuComponent, `afterend`);
render(tripMainControlsSecondTitle, filterComponent, `afterend`);

const tripEvents = document.querySelector(`.trip-events`);
const tripController = new TripController(tripEvents, pointsModel);
tripController.render();
