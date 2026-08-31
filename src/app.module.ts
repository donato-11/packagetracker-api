import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebsocketsModule } from './websockets/websockets.module';
import { SimulatorModule } from './simulator/simulator.module';
import { EnviosModule } from './envios/envios.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        /*
        Solo en desarrollo: crea/actualiza las tablas automaticamente a partir
        de las entidades. En produccion se recomienda usar migraciones y
        aplicar src/db/schema.sql manualmente.
        */
        synchronize: config.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    WebsocketsModule,
    SimulatorModule,
    EnviosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
