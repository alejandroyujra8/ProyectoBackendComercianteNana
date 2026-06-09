import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inscripcion } from './entities/inscripcion.entity';

@Injectable()
export class InscripcionesService {
  constructor(
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
  ) {}

  // mi funcion para guardar el cupo del jugador
  async registrarInscripcion(datos: { id_usuario: number, id_evento: number }) {
    // verifico que no se inscriba dos veces al mismo torneo
    const yaInscrito = await this.inscripcionRepository.findOne({
      where: { id_usuario: datos.id_usuario, id_evento: datos.id_evento }
    });

    if (yaInscrito) {
      throw new BadRequestException('Ya estás inscrito a este torneo.');
    }

    const nuevaInscripcion = this.inscripcionRepository.create({
      id_usuario: datos.id_usuario,
      id_evento: datos.id_evento
    });

    await this.inscripcionRepository.save(nuevaInscripcion);

    return { mensaje: '¡Inscripción exitosa! Prepara tus dados.' };
  }
}