import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { numericTransformer } from '../../common/numeric.transformer';
import { EstadoEnvio } from '../enums/estado-envio.enum';
import { Checkpoint } from './checkpoint.entity';

@Entity('envios')
export class Envio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  guia: string;

  @Column({ length: 100 })
  destinatario: string;

  @Column('numeric', { precision: 9, scale: 6, transformer: numericTransformer })
  origen_lat: number;

  @Column('numeric', { precision: 9, scale: 6, transformer: numericTransformer })
  origen_lng: number;

  @Column('numeric', { precision: 9, scale: 6, transformer: numericTransformer })
  destino_lat: number;

  @Column('numeric', { precision: 9, scale: 6, transformer: numericTransformer })
  destino_lng: number;

  @Column({ length: 20, default: EstadoEnvio.EN_ALMACEN })
  estado: EstadoEnvio;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @OneToMany(() => Checkpoint, (checkpoint) => checkpoint.envio)
  checkpoints: Checkpoint[];
}