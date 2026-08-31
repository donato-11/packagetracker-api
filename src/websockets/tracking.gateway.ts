import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

export interface PosicionActualizadaPayload {
  guia: string;
  lat: number;
  lng: number;
  progreso: number;
}

export interface EnvioEntregadoPayload {
  guia: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
})
export class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(TrackingGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Cliente WebSocket conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente WebSocket desconectado: ${client.id}`);
  }

  emitPosicionActualizada(payload: PosicionActualizadaPayload) {
    this.server.emit('posicion_actualizada', payload);
  }

  emitEnvioEntregado(payload: EnvioEntregadoPayload) {
    this.server.emit('envio_entregado', payload);
  }
}