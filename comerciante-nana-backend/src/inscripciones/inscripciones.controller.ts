import { Controller, Post, Body } from '@nestjs/common';
import { InscripcionesService } from './inscripciones.service';

@Controller('inscripciones')
export class InscripcionesController {
  constructor(private readonly inscripcionesService: InscripcionesService) {}

  @Post()
  inscribirse(@Body() datos: { id_usuario: number, id_evento: number }) {
    return this.inscripcionesService.registrarInscripcion(datos);
  }
}