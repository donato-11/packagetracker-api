import { calculateEtaMinutes, haversineDistanceKm } from './eta.util';

describe('calculateEtaMinutes', () => {
  it('Test 1: calculo correcto de ETA para distancias validas', () => {
    // 30 km a 60 km/h -> 30 minutos
    expect(calculateEtaMinutes(30, 60)).toBe(30);
    // 10 km a 40 km/h -> 15 minutos
    expect(calculateEtaMinutes(10, 40)).toBe(15);
  });

  it('Test 2: retorna 0 minutos cuando el paquete llega a las coordenadas destino (Entregado)', () => {
    expect(calculateEtaMinutes(0, 40)).toBe(0);
  });

  it('Test 3: maneja errores ante velocidades invalidas o distancias negativas', () => {
    expect(() => calculateEtaMinutes(-5, 40)).toThrow('La distancia no puede ser negativa.');
    expect(() => calculateEtaMinutes(10, 0)).toThrow('La velocidad promedio debe ser mayor a 0.');
    expect(() => calculateEtaMinutes(10, -20)).toThrow('La velocidad promedio debe ser mayor a 0.');
  });
});

describe('haversineDistanceKm', () => {
  it('la distancia entre un punto y si mismo es 0', () => {
    expect(haversineDistanceKm(19.4326, -99.1332, 19.4326, -99.1332)).toBeCloseTo(0, 5);
  });

  it('calcula una distancia aproximada conocida (CDMX -> Guadalajara)', () => {
    const km = haversineDistanceKm(19.4326, -99.1332, 20.6597, -103.3496);
    // Distancia real aprox. 430-500 km en linea recta
    expect(km).toBeGreaterThan(430);
    expect(km).toBeLessThan(500);
  });
});