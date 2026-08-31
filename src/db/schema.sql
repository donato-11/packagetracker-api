-- Este esquema es el equivalente manual a lo que TypeORM genera automaticamente
-- con `synchronize: true` en desarrollo (ver src/app.module.ts). Usalo para
-- inicializar la base de datos en produccion o entornos donde synchronize
-- este desactivado.

CREATE TABLE IF NOT EXISTS envios (
    id SERIAL PRIMARY KEY,
    guia VARCHAR(50) UNIQUE NOT NULL,
    destinatario VARCHAR(100) NOT NULL,
    origen_lat NUMERIC(9,6) NOT NULL,
    origen_lng NUMERIC(9,6) NOT NULL,
    destino_lat NUMERIC(9,6) NOT NULL,
    destino_lng NUMERIC(9,6) NOT NULL,
    estado VARCHAR(20) DEFAULT 'En Almacén',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS checkpoints (
    id SERIAL PRIMARY KEY,
    envio_id INT REFERENCES envios(id) ON DELETE CASCADE,
    latitud NUMERIC(9,6) NOT NULL,
    longitud NUMERIC(9,6) NOT NULL,
    orden INT NOT NULL
);