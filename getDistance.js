export const getDistance = plane => {
  const rad = x => {
    return x * Math.PI / 180;
  };

  const domodedovoLatitude = 55.410307;

  const domodedovoLongitude = 37.902451;

  const R = 6378; // Радиус Земли

  const dLat = rad(plane.latitude - domodedovoLatitude);

  const dLong = rad(plane.longitude - domodedovoLongitude);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(domodedovoLatitude)) * Math.cos(rad(plane.latitude)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  plane.distanceToDemodedovo = +(R * c).toFixed(2);
  return plane; // Возвращает объект вместе с дистанцией в километрах
};
