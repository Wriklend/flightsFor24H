import { mapFlight } from './mapFlight.js';
import { setDistance } from './setDistance.js';

const FeetInOneMeter = 3.281;

const tbody = document.getElementById('tbody');

const render = (flights = []) => {
  flights.forEach((item, index) => tbody.insertAdjacentHTML('beforeend',
      `<tr>
        <th scope='row'>${index}</th>
        <td>Широта: ${item.latitude}\nДолгота: ${item.longitude}</td>
        <td>${item.speed}</td>
        <td>${item.course}</td>
        <td>${(item.altitude / FeetInOneMeter).toFixed(2)}</td>
        <td>${item.departureAirport}</td>
        <td>${item.destinationAirport}</td>
        <td>${item.flightNumber}</td>
        <td>${item.distanceToDomodedovo.toFixed(2)}</td>
      </tr>`
    ));
};

const getMapFlight = (data) => {
  let flights = [];

  for (let [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      flights.push(mapFlight(value));
    }
  }
  return flights;
};

async function loadFlights() {
  try {
    const r = await fetch('https://data-live.flightradar24.com/zones/fcgi/feed.js?bounds=56.84,55.27,33.48,41.48');
    if (!r.ok) {
      console.log('Status code: ' + r.status);
      return;
    }
    return r.json();
  }
  catch (err) {
    console.log('Fetch Error:' + err);
  }
}

const clearElem = (elem) => {
  elem.innerHTML = '';
};

const getFlights = () => {
  return loadFlights()
    .then(r => getMapFlight(r))
    .catch(error => new Error(error))
    .then(r => r.map(item => setDistance(item)))
    .catch(error => new Error(error))
    .then(r => r.sort((a, b) => a.distanceToDomodedovo - b.distanceToDomodedovo))
    .catch(error => new Error(error))
    .then(clearElem(tbody)) //Поставил очистку перед отрисовкой,
                // т.к. при медленном интернете возникает долгая пауза. 
                //Буду рад услышать, как это сделать лучше.
    .then(r => render(r))
    .catch(error => new Error(error));
};

getFlights();

setInterval(getFlights, 5000); //Загружаем данные и обновляем таблицу каждые 5 сек
