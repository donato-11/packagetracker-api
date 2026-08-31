import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateEnvioDto {
  @IsString()
  @IsNotEmpty()
  guia: string;

  @IsString()
  @IsNotEmpty()
  destinatario: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  origen_lat: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  origen_lng: number;

  @IsNumber()
  @Min(-90)
  @Max(90)
  destino_lat: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  destino_lng: number;
}