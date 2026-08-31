import { ValueTransformer } from 'typeorm';

/**
 * PostgreSQL devuelve las columnas NUMERIC como string para no perder
 * precision. Este transformer las convierte a number al leer, y las deja
 * intactas al escribir.
 */
export const numericTransformer: ValueTransformer = {
  to: (value?: number) => value,
  from: (value?: string) => (value === null || value === undefined ? value : parseFloat(value)),
};