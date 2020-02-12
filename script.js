import { mapFlight } from './mapFlight.js';
import { setDistance } from './setDistance.js';

const FeetInOneMeter = 3.281;
const KilometersInOneKnot = 1.85;

const tbody = document.getElementById('tbody');

const render = (flights = []) => {
  flights.forEach((item, index) => tbody.insertAdjacentHTML('beforeend',
      `<tr>
        <th scope='row'>${index}</th>
        <td>Широта: ${item.latitude}\nДолгота: ${item.longitude}</td>
        <td>${(item.speed * KilometersInOneKnot).toFixed(2)}</td>
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

async function getFlights() {
  try {
    const flights = await loadFlights();
    const flightsWithDistance = getMapFlight(flights).map(item => setDistance(item));
    const sortedFlights = flightsWithDistance.sort((a, b) => a.distanceToDomodedovo - b.distanceToDomodedovo);
    clearElem(tbody);
    render(sortedFlights);
    return;
  }
  catch (err) {
    console.log(err);
  }
}

getFlights();

let timerId = setTimeout(function timer() {
  getFlights().finally(timerId = setTimeout(timer, 5000));
}, 5000);
