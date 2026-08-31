import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Envio } from '../envios/entities/envio.entity';
import { WebsocketsModule } from '../websockets/websockets.module';
import { SimulatorService } from './simulator.service';

@Module({
  imports: [TypeOrmModule.forFeature([Envio]), WebsocketsModule],
  providers: [SimulatorService],
})
export class SimulatorModule {}
