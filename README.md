# packagetracker-api (NestJS)

Backend de **PackageTracker Lite** reescrito con **NestJS**, sobre el proyecto ya
generado con:
```bash
npm i -g @nestjs/cli
nest new packagetracker-api
```

## Cómo integrar estos archivos
Copia el contenido de esta carpeta dentro de tu proyecto `packagetracker-api`,
**reemplazando** `src/main.ts` y `src/app.module.ts` (los que genera `nest new`)
y agregando las carpetas nuevas: `src/envios/`, `src/websockets/`, `src/simulator/`,
`src/eta/`, `src/common/` y `src/db/`. También reemplaza `Dockerfile` y agrega
`docker-compose.yml` y `.env.example` en la raíz del proyecto.

> Puedes dejar `src/app.controller.ts`, `src/app.service.ts` y sus `.spec.ts` tal
> como los generó Nest (quedan como health-check en `GET /api`), o eliminarlos si
> no los necesitas.

## Dependencias adicionales
`nest new` ya incluye `@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express`,
`rxjs`, `reflect-metadata` y Jest configurado. Falta instalar:
```bash
npm install @nestjs/config @nestjs/typeorm typeorm pg \
            @nestjs/websockets @nestjs/platform-socket.io socket.io \
            class-validator class-transformer
```

## Variables de entorno
```bash
cp .env.example .env
```

## Levantar con Docker (API + PostgreSQL)
```bash
docker compose up --build
```
La API queda disponible en `http://localhost:4000/api`. El esquema SQL
(`src/db/schema.sql`) se aplica automáticamente al crear el contenedor de la
base de datos (el contenedor corre con `NODE_ENV=production`, por lo que el
`synchronize` de TypeORM queda desactivado a propósito).

## Levantar en local sin Docker
```bash
cp .env.example .env
npm install
# con una instancia de Postgres corriendo y DATABASE_URL configurada,
# y NODE_ENV=development en tu .env, TypeORM crea las tablas automáticamente:
npm run start:dev
```

## Pruebas automatizadas
```bash
npm install
npm test
```
Suite de pruebas (`src/eta/eta.util.spec.ts`) sobre la lógica pura de ETA:
1. Cálculo correcto de ETA para distancias válidas.
2. Retorno de 0 minutos cuando el paquete llega a las coordenadas destino.
3. Manejo de errores ante velocidades inválidas o distancias negativas.

## Endpoints REST (prefijo global `/api`, definido en `main.ts`)
| Método | Ruta               | Descripción                                   |
|--------|---------------------|------------------------------------------------|
| POST   | /api/envios         | Crea un envío                                  |
| GET    | /api/envios         | Lista todos los envíos                         |
| GET    | /api/envios/:guia   | Detalle de un envío + checkpoints              |
| PUT    | /api/envios/:id     | Actualiza estado y/o destinatario              |
| DELETE | /api/envios/:id     | Elimina un envío                               |

## WebSockets (`TrackingGateway`, Socket.IO en el namespace raíz)
- Evento emitido `posicion_actualizada`: `{ guia, lat, lng, progreso }`, emitido
  cada `SIMULATOR_TICK_MS` para cada envío en estado `En tránsito`.
- Evento emitido `envio_entregado`: `{ guia }`, cuando el simulador determina
  que llegó a destino (marca el envío como `Entregado` automáticamente).

Para simular una entrega: crea un envío y luego actualiza su estado a
`En tránsito` con `PUT /api/envios/:id`.

## Estructura relevante
```
src/
  main.ts                          -> Bootstrap: CORS, ValidationPipe, prefijo /api
  app.module.ts                    -> ConfigModule + TypeOrmModule + modulos de la app
  eta/
    eta.util.ts                    -> Funciones puras: Haversine + calculo de ETA
    eta.util.spec.ts               -> Suite de pruebas (Jest) pedida en el documento
  common/
    numeric.transformer.ts         -> Convierte columnas NUMERIC (string) a number
  envios/
    entities/envio.entity.ts       -> Entidad TypeORM "envios"
    entities/checkpoint.entity.ts  -> Entidad TypeORM "checkpoints"
    enums/estado-envio.enum.ts     -> Estados validos de un envio
    dto/create-envio.dto.ts        -> Validacion del POST
    dto/update-envio.dto.ts        -> Validacion del PUT
    envios.controller.ts           -> Rutas REST /api/envios
    envios.service.ts              -> Logica CRUD contra la base de datos
    envios.module.ts
  websockets/
    tracking.gateway.ts            -> Gateway Socket.IO (posicion_actualizada, envio_entregado)
    websockets.module.ts
  simulator/
    simulator.service.ts           -> Mueve el repartidor cada SIMULATOR_TICK_MS
    simulator.module.ts
  db/
    schema.sql                     -> Esquema SQL equivalente a las entidades (uso en produccion)
```
