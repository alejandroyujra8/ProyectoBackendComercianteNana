import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { InscripcionesService } from './inscripciones.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('inscripciones')
export class InscripcionesController {
  constructor(private readonly inscripcionesService: InscripcionesService) {}

  @Post()
  @UseGuards(AuthGuard)
  inscribirse(
    @Body() datos: { id_evento: number },
    @Req() req: Request & { usuario?: { id_usuario: number } },
  ) {
    return this.inscripcionesService.registrarInscripcion({
      id_usuario: Number(req.usuario?.id_usuario),
      id_evento: Number(datos.id_evento),
    });
  }
}
