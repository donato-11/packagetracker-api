import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Checkpoint } from './entities/checkpoint.entity';
import { Envio } from './entities/envio.entity';
import { EnviosController } from './envios.controller';
import { EnviosService } from './envios.service';

@Module({
  imports: [TypeOrmModule.forFeature([Envio, Checkpoint])],
  controllers: [EnviosController],
  providers: [EnviosService],
  exports: [EnviosService, TypeOrmModule],
})
export class EnviosModule {}
