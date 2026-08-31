import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateEnvioDto } from './dto/create-envio.dto';
import { UpdateEnvioDto } from './dto/update-envio.dto';
import { EnviosService } from './envios.service';

@Controller('envios')
export class EnviosController {
  constructor(private readonly enviosService: EnviosService) {}

  // POST /api/envíos - crea un nuevo envío
  @Post()
  create(@Body() dto: CreateEnvioDto) {
    return this.enviosService.create(dto);
  }

  // GET /api/envíos - lista todos los envíos
  @Get()
  findAll() {
    return this.enviosService.findAll();
  }

  // GET /api/envíos/:guia - detalle de un envío y sus checkpoints
  @Get(':guia')
  findByGuia(@Param('guia') guia: string) {
    return this.enviosService.findByGuia(guia);
  }

  // PUT /api/envíos/:id - actualiza estado y/o destinatario
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEnvioDto) {
    return this.enviosService.update(id, dto);
  }

  // DELETE /api/envíos/:id - elimina un envío
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.enviosService.remove(id);
  }
}