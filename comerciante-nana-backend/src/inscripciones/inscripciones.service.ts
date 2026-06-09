import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inscripcion } from './entities/inscripcion.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Evento } from '../eventos/entities/evento.entity';

@Injectable()
export class InscripcionesService {
  constructor(
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    @InjectRepository(Evento)
    private readonly eventoRepository: Repository<Evento>,
  ) {}

  async registrarInscripcion(datos: { id_usuario: number; id_evento: number }) {
    if (!datos.id_usuario || !datos.id_evento) {
      throw new BadRequestException('El usuario y el evento son obligatorios.');
    }

    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: Number(datos.id_usuario), activo: true },
    });

    if (!usuario) {
      throw new NotFoundException('El usuario no existe o está inactivo.');
    }

    const evento = await this.eventoRepository.findOne({
      where: { id_evento: Number(datos.id_evento), activo: true },
    });

    if (!evento) {
      throw new NotFoundException('El evento no existe o está inactivo.');
    }

    const inscritos = await this.inscripcionRepository.count({
      where: { id_evento: Number(datos.id_evento) },
    });

    if (inscritos >= evento.cupo_maximo) {
      throw new BadRequestException('Ya no hay cupos disponibles para este evento.');
    }

    const yaInscrito = await this.inscripcionRepository.findOne({
      where: {
        id_usuario: Number(datos.id_usuario),
        id_evento: Number(datos.id_evento),
      },
    });

    if (yaInscrito) {
      throw new BadRequestException('Ya estás inscrito a este torneo.');
    }

    const nuevaInscripcion = this.inscripcionRepository.create({
      id_usuario: Number(datos.id_usuario),
      id_evento: Number(datos.id_evento),
    });

    const inscripcionGuardada = await this.inscripcionRepository.save(nuevaInscripcion);

    return {
      mensaje: '¡Inscripción exitosa! Prepara tus dados.',
      inscripcion: inscripcionGuardada,
    };
  }
}
