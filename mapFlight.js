export const mapFlight = (flight) => ({
  latitude: flight[1],
  longitude: flight[2],
  speed: flight[5],
  course: flight[3],
  altitude: flight[4],
  departureAirport: flight[11],
  destinationAiroport: flight[12],
  flightNumber: flight[16],
  distanceToDemodedovo: '',
});
