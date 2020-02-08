import { mapFlight } from './mapFlight.js';
import { getDistance } from './getDistance.js';

const tbody = document.getElementById('tbody');

const render = (flights = []) => {
  flights.forEach((item, index) => tbody.insertAdjacentHTML('beforeend',
      `<tr>
        <th scope='row'>${index}</th>
        <td>Широта: ${item.latitude}\nДолгота: ${item.longitude}</td>
        <td>${item.speed}</td>
        <td>${item.course}</td>
        <td>${+(item.altitude / 3.281).toFixed(2)}</td>
        <td>${item.departureAirport}</td>
        <td>${item.destinationAiroport}</td>
        <td>${item.flightNumber}</td>
        <td>${item.distanceToDemodedovo}</td>
      </tr>`
    ));
};

const getMapFlight = (data) => {
  const flights = [];

  for (let key in data) {
    if (Array.isArray(data[key])) {
      flights.push(mapFlight(data[key]));
    }
  }
  return flights;
};

async function loadFlights() {
  try {
    const r = await fetch('https://data-live.flightradar24.com/zones/fcgi/feed.js?bounds=56.84,55.27,33.48,41.48');
    if (r.status !== 200) {
      console.log('Status code: ' + r.status);
      return;
    }
    return r.json();
  }
  catch (err) {
    return console.log('Fetch Error:' + err);
  }
}

const clearElem = (elem) => {
  elem.innerHTML = '';
};

const getFlights = () => {
  return loadFlights()
    .then(r => getMapFlight(r)) //Создаем мапу для полученных данных
    .catch(error => new Error(error))
    .then(r => r.map(item => getDistance(item))) //Счиатем дистанцию до Домодедово
    .catch(error => new Error(error))
    .then(r => r.sort((a, b) => a.distanceToDemodedovo - b.distanceToDemodedovo))
    .catch(error => new Error(error))
    .then(clearElem(tbody)) //Поставил очистку перед отрисовкой,
                // т.к. при медленном интернете возникает долгая пауза. 
                //Буду рад услышать, как это сделать лучше.
    .then(r => render(r)) // Отрисовка
    .catch(error => new Error(error));
};

getFlights();

setInterval(() => { //Загружаем данные и обновляем таблицу каждые 5 сек
  getFlights();
}, 5000);
