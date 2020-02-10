export const setDistance = plane => {
  const rad = x => x * Math.PI / 180;

  const DomodedovoLatitude = 55.410307;

  const DomodedovoLongitude = 37.902451;

  const EarthRadius = 6378; 

  const dLat = rad(plane.latitude - DomodedovoLatitude);

  const dLong = rad(plane.longitude - DomodedovoLongitude);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(DomodedovoLatitude)) * Math.cos(rad(plane.latitude)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  plane.distanceToDomodedovo = +(EarthRadius * c).toFixed(2);
  return plane; // Возвращает объект вместе с дистанцией в километрах
};
