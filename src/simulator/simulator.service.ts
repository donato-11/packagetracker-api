import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { haversineDistanceKm } from '../eta/eta.util';
import { Envio } from '../envios/entities/envio.entity';
import { EstadoEnvio } from '../envios/enums/estado-envio.enum';
import { TrackingGateway } from '../websockets/tracking.gateway';

@Injectable()
export class SimulatorService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SimulatorService.name);
  private intervalRef: NodeJS.Timeout;

  // Progreso en memoria por envio: 0 = en origen, 1 = en destino
  private readonly progressByEnvioId = new Map<number, number>();

  private readonly avgSpeedKmh: number;
  private readonly tickMs: number;

  constructor(
    @InjectRepository(Envio)
    private readonly enviosRepo: Repository<Envio>,
    private readonly gateway: TrackingGateway,
    private readonly config: ConfigService,
  ) {
    this.avgSpeedKmh = Number(this.config.get('AVERAGE_SPEED_KMH') ?? 40);
    this.tickMs = Number(this.config.get('SIMULATOR_TICK_MS') ?? 2000);
  }

  onModuleInit() {
    this.intervalRef = setInterval(() => {
      this.tick().catch((err) => this.logger.error('Error en simulador de posición:', err));
    }, this.tickMs);
  }

  onModuleDestroy() {
    clearInterval(this.intervalRef);
  }

  private lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  private async tick() {
    const envios = await this.enviosRepo.find({
      where: { estado: EstadoEnvio.EN_TRANSITO },
    });

    for (const envio of envios) {
      const distanceKm = haversineDistanceKm(
        envio.origen_lat,
        envio.origen_lng,
        envio.destino_lat,
        envio.destino_lng,
      );

      const totalMinutes = distanceKm === 0 ? 0 : (distanceKm / this.avgSpeedKmh) * 60;
      const totalTicks =
        totalMinutes > 0 ? Math.max(1, Math.ceil((totalMinutes * 60 * 1000) / this.tickMs)) : 1;

      const currentProgress = this.progressByEnvioId.get(envio.id) || 0;
      const nextProgress = Math.min(1, currentProgress + 1 / totalTicks);
      this.progressByEnvioId.set(envio.id, nextProgress);

      const lat = this.lerp(envio.origen_lat, envio.destino_lat, nextProgress);
      const lng = this.lerp(envio.origen_lng, envio.destino_lng, nextProgress);

      this.gateway.emitPosicionActualizada({
        guia: envio.guia,
        lat,
        lng,
        progreso: nextProgress,
      });

      if (nextProgress >= 1) {
        envio.estado = EstadoEnvio.ENTREGADO;
        await this.enviosRepo.save(envio);
        this.progressByEnvioId.delete(envio.id);
        this.gateway.emitEnvioEntregado({ guia: envio.guia });
      }
    }
  }
}