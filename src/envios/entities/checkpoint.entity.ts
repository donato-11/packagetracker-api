import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { numericTransformer } from '../../common/numeric.transformer';
import { Envio } from './envio.entity';

@Entity('checkpoints')
export class Checkpoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'envio_id' })
  envio_id: number;

  @ManyToOne(() => Envio, (envio) => envio.checkpoints, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'envio_id' })
  envio: Envio;

  @Column('numeric', { precision: 9, scale: 6, transformer: numericTransformer })
  latitud: number;

  @Column('numeric', { precision: 9, scale: 6, transformer: numericTransformer })
  longitud: number;

  @Column()
  orden: number;
}