// Статистика
import AbstractComponent from "./abstract-component.js";
import Chart from "../../node_modules/chart.js/auto";
import ChartDataLabels from '../../node_modules/chartjs-plugin-datalabels';
import moment from "../../node_modules/moment";
import {render, remove} from "../utils/render";

const labledEventTransportTypes = [
  [`taxi`, `🚕 TAXI`],
  [`bus`, `🚌 BUS`],
  [`train`, `🚂 TRAIN`],
  [`ship`, `⚓ SHIP`],
  [`transport`, `🚆 TRANSPORT`],
  [`drive`, `🚗 DRIVE`],
  [`flight`, `✈ FLIGHT`],
];

const labledEventPlaceTypes = [
  [`check-in`, `🏨 CHECK-IN`],
  [`sightseeing`, `🏛 SIGHTSEEING`],
  [`restaurant`, `🍔 RESTAURANT`],
];

const labledEventTypes = labledEventTransportTypes.concat(labledEventPlaceTypes);

const StatisticType = {
  MONEY: `MONEY`,
  TRANSPORT: `TRANSPORT`,
  TIME: `TIME`,
};

const calculateStatisticByType = (eventTypes, events, statisticType) => {
  let data = {};

  if (statisticType === StatisticType.MONEY) {
    for (let i = 0; i < eventTypes.length; i++) {
      const price = events.filter((event) => event.type === eventTypes[i][0]).reduce((acc, currentValue) => acc + currentValue.price, 0);
      if (price > 0) {
        data[eventTypes[i][1]] = price;
      }
    }
  } else if (statisticType === StatisticType.TRANSPORT) {
    for (let i = 0; i < eventTypes.length; i++) {
      const number = events.filter((event) => event.type === eventTypes[i][0]).length;
      if (number > 0) {
        data[eventTypes[i][1]] = number;
      }
    }
  } else if (statisticType === StatisticType.TIME) {
    for (let i = 0; i < eventTypes.length; i++) {
      const time = events.filter((event) => event.type === eventTypes[i][0]).reduce((acc, currentValue) => {
        const interval = moment(currentValue.dateTo) - moment(currentValue.dateFrom);
        const durationHours = moment.duration(interval).hours();
        return acc + durationHours;
      }, 0);
      if (time > 0) {
        data[eventTypes[i][1]] = time;
      }
    }
  }
  const sortedDataArray = Object.entries(data).sort((left, right) => right[1] - left[1]);
  const sortedDataObject = sortedDataArray.reduce((acc, current) => {
    acc[current[0]] = current[1];
    return acc;
  }, {});

  return sortedDataObject;
};

const createStatisticTemplate = () => {
  return (`
    <section class="statistics hidden">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>
  `);
};

export default class Stats extends AbstractComponent {
  constructor(pointsModel) {
    super();
    this._pointsModel = pointsModel;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;
  }

  getTemplate() {
    return createStatisticTemplate();
  }

  renderStatistic() {
    this.removeStatistic();

    const moneyCtx = document.querySelector(`.statistics__chart--money`);
    const transportCtx = document.querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = document.querySelector(`.statistics__chart--time`);
    // Рассчитаем высоту канваса в зависимости от того, сколько данных в него будет передаваться
    const BAR_HEIGHT = 30;
    moneyCtx.height = BAR_HEIGHT * 6;
    transportCtx.height = BAR_HEIGHT * 4;
    timeSpendCtx.height = BAR_HEIGHT * 4;

    const moneySpentByType = calculateStatisticByType(labledEventTypes, this._pointsModel.getAllPoints(), StatisticType.MONEY);
    this._moneyChart = new Chart(moneyCtx, {
      plugins: [ChartDataLabels],
      type: `bar`,
      data: {
        labels: Object.keys(moneySpentByType),
        datasets: [{
          label: StatisticType.MONEY,
          data: Object.values(moneySpentByType),
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        indexAxis: `y`,
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `€ ${val}`,
            padding: {
              right: 30
            }
          },
          legend: {
            display: false,
          },
          tooltips: {
            enabled: false,
          }
        },
        title: {
          display: true,
          text: `MONEY`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          y: {
            title: {
              display: true,
              align: `center`,
              text: `MONEY`,
              color: `#000000`,
              font: {
                size: 23,
              }
            },
            ticks: {
              fontColor: `#000000`,
              padding: 2.5,
              font: {
                size: 13
              },
            },
            grid: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          },
          x: {
            ticks: {
              display: false,
              beginAtZero: true,
            },
            grid: {
              display: false,
              drawBorder: false
            },
            minBarLength: 2.50
          },
        }
      }
    });

    const transportUsedByType = calculateStatisticByType(labledEventTransportTypes, this._pointsModel.getAllPoints(), StatisticType.TRANSPORT);
    this._transportChart = new Chart(transportCtx, {
      plugins: [ChartDataLabels],
      type: `bar`,
      data: {
        labels: Object.keys(transportUsedByType),
        datasets: [{
          label: StatisticType.TRANSPORT,
          data: Object.values(transportUsedByType),
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        indexAxis: `y`,
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `${val}x`,
            padding: {
              right: 30
            }
          },
          legend: {
            display: false,
          },
          tooltips: {
            enabled: false,
          }
        },
        scales: {
          y: {
            title: {
              display: true,
              align: `center`,
              text: `TRANSPORT`,
              color: `#000000`,
              font: {
                size: 23,
              }
            },
            ticks: {
              fontColor: `#000000`,
              padding: 2.5,
              font: {
                size: 13
              },
            },
            grid: {
              display: false,
              drawBorder: false,
            },
            barThickness: 44,
          },
          x: {
            ticks: {
              display: false,
              beginAtZero: true,
            },
            grid: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          },
        },
      }
    });

    const timeSpendByType = calculateStatisticByType(labledEventTransportTypes, this._pointsModel.getAllPoints(), StatisticType.TIME);
    this._timeChart = new Chart(timeSpendCtx, {
      plugins: [ChartDataLabels],
      type: `bar`,
      data: {
        labels: Object.keys(timeSpendByType),
        datasets: [{
          label: StatisticType.TIME,
          data: Object.values(timeSpendByType),
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        indexAxis: `y`,
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `${val}H`,
            padding: {
              right: 30
            }
          },
          legend: {
            display: false,
          },
          tooltips: {
            enabled: false,
          }
        },
        scales: {
          y: {
            title: {
              display: true,
              align: `center`,
              text: `TRANSPORT`,
              color: `#000000`,
              font: {
                size: 23,
              }
            },
            ticks: {
              fontColor: `#000000`,
              padding: 2.5,
              font: {
                size: 13
              },
            },
            grid: {
              display: false,
              drawBorder: false,
            },
            barThickness: 44,
          },
          x: {
            ticks: {
              display: false,
              beginAtZero: true,
            },
            grid: {
              display: false,
              drawBorder: false
            },
            minBarLength: 2.50
          },
        },
      }
    });
  }

  removeStatistic() {
    if (this._moneyChart && this._transportChart && this._timeChart) {
      this._moneyChart.destroy();
      this._transportChart.destroy();
      this._timeChart.destroy();
    }
  }

  show() {
    this.renderStatistic();
    super.show();
  }
}
