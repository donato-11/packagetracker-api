import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EstadoEnvio } from '../enums/estado-envio.enum';

export class UpdateEnvioDto {
  @IsOptional()
  @IsEnum(EstadoEnvio, {
    message: `estado debe ser uno de: ${Object.values(EstadoEnvio).join(', ')}`,
  })
  estado?: EstadoEnvio;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  destinatario?: string;
}