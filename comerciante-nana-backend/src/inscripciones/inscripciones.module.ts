import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InscripcionesService } from './inscripciones.service';
import { InscripcionesController } from './inscripciones.controller';
import { Inscripcion } from './entities/inscripcion.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Evento } from '../eventos/entities/evento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inscripcion, Usuario, Evento])],
  controllers: [InscripcionesController],
  providers: [InscripcionesService],
})
export class InscripcionesModule {}
