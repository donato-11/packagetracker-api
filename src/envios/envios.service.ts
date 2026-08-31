import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEnvioDto } from './dto/create-envio.dto';
import { UpdateEnvioDto } from './dto/update-envio.dto';
import { Envio } from './entities/envio.entity';

@Injectable()
export class EnviosService {
  constructor(
    @InjectRepository(Envio)
    private readonly enviosRepo: Repository<Envio>,
  ) {}

  async create(dto: CreateEnvioDto): Promise<Envio> {
    const envio = this.enviosRepo.create(dto);
    try {
      return await this.enviosRepo.save(envio);
    } catch (err: any) {
      // 23505 = unique_violation en PostgreSQL (guia duplicada)
      if (err.code === '23505') {
        throw new ConflictException(`Ya existe un envío con la guía ${dto.guia}.`);
      }
      throw err;
    }
  }

  findAll(): Promise<Envio[]> {
    return this.enviosRepo.find({ order: { created_at: 'DESC' } });
  }

  async findByGuia(guia: string): Promise<Envio> {
    const envio = await this.enviosRepo.findOne({
      where: { guia },
      relations: { checkpoints: true },
      order: { checkpoints: { orden: 'ASC' } },
    });

    if (!envio) {
      throw new NotFoundException(`No se encontró el envío con guía ${guia}.`);
    }

    return envio;
  }

  async update(id: number, dto: UpdateEnvioDto): Promise<Envio> {
    const envio = await this.enviosRepo.findOne({ where: { id } });

    if (!envio) {
      throw new NotFoundException(`No se encontró el envío con id ${id}.`);
    }

    Object.assign(envio, dto);
    return this.enviosRepo.save(envio);
  }

  async remove(id: number): Promise<void> {
    const result = await this.enviosRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`No se encontró el envío con id ${id}.`);
    }
  }
}