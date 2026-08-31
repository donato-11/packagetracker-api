/*
Calcula la distancia en linea recta (km) entre dos coordenadas usando la
formula de Haversine.
*/
export function haversineDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371; // radio de la tierra en km
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/*
Calcula el ETA (minutos) en base a la distancia faltante y la velocidad
promedio del repartidor.

-Si la distancia es 0 (ya llego a destino), el ETA es 0 minutos.
-La velocidad promedio debe ser un numero positivo.
-La distancia no puede ser negativa.
*/
export function calculateEtaMinutes(distanceKm: number, avgSpeedKmh: number): number {
  if (typeof distanceKm !== 'number' || Number.isNaN(distanceKm)) {
    throw new Error('La distancia debe ser un numero valido.');
  }
  if (typeof avgSpeedKmh !== 'number' || Number.isNaN(avgSpeedKmh)) {
    throw new Error('La velocidad promedio debe ser un numero valido.');
  }
  if (distanceKm < 0) {
    throw new Error('La distancia no puede ser negativa.');
  }
  if (avgSpeedKmh <= 0) {
    throw new Error('La velocidad promedio debe ser mayor a 0.');
  }

  if (distanceKm === 0) {
    return 0;
  }

  const hours = distanceKm / avgSpeedKmh;
  return Math.round(hours * 60 * 10) / 10;
}

// Calcula el ETA de un envio a partir de su posicion actual y su destino.
export function calculateEtaFromCoords(
  currentLat: number,
  currentLng: number,
  destLat: number,
  destLng: number,
  avgSpeedKmh: number,
): number {
  const distanceKm = haversineDistanceKm(currentLat, currentLng, destLat, destLng);
  return calculateEtaMinutes(distanceKm, avgSpeedKmh);
}