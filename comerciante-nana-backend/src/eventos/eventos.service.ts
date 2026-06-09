import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { Evento } from './entities/evento.entity';

@Injectable()
export class EventosService implements OnModuleInit {
  constructor(
    @InjectRepository(Evento)
    private readonly eventoRepository: Repository<Evento>,
  ) {}

  async onModuleInit() {
    const cantidad = await this.eventoRepository.count();
    if (cantidad > 0) return;

    const eventosIniciales = this.eventoRepository.create([
      {
        nombre_evento: 'Torneo Nacional de Catan',
        tipo_evento: 'Competitivo',
        fecha_evento: new Date('2026-07-15T18:00:00'),
        id_sucursal: 1,
        descripcion: 'Torneo competitivo con premios y cupos limitados.',
        cupo_maximo: 32,
        activo: true,
      },
      {
        nombre_evento: 'Noche de Party Games',
        tipo_evento: 'Casual',
        fecha_evento: new Date('2026-07-18T19:00:00'),
        id_sucursal: 1,
        descripcion: 'Evento casual para conocer nuevos juegos y jugar en comunidad.',
        cupo_maximo: 50,
        activo: true,
      },
      {
        nombre_evento: 'Demostración: Secret Hitler',
        tipo_evento: 'Aprende a jugar',
        fecha_evento: new Date('2026-07-20T17:00:00'),
        id_sucursal: 2,
        descripcion: 'Demostración guiada para jugadores nuevos.',
        cupo_maximo: 20,
        activo: true,
      },
    ]);

    await this.eventoRepository.save(eventosIniciales);
  }

  private validarEvento(datos: Partial<CreateEventoDto>) {
    if (datos.nombre_evento !== undefined && datos.nombre_evento.trim().length < 3) {
      throw new BadRequestException('El nombre del evento debe tener al menos 3 caracteres.');
    }

    if (datos.tipo_evento !== undefined && datos.tipo_evento.trim().length < 3) {
      throw new BadRequestException('El tipo de evento debe tener al menos 3 caracteres.');
    }

    if (datos.cupo_maximo !== undefined && Number(datos.cupo_maximo) <= 0) {
      throw new BadRequestException('El cupo máximo debe ser mayor a 0.');
    }
  }

  async create(createEventoDto: CreateEventoDto) {
    this.validarEvento(createEventoDto);

    const nuevoEvento = this.eventoRepository.create({
      ...createEventoDto,
      fecha_evento: new Date(createEventoDto.fecha_evento),
      id_sucursal: Number(createEventoDto.id_sucursal || 1),
      cupo_maximo: Number(createEventoDto.cupo_maximo || 32),
      activo: true,
    });

    return await this.eventoRepository.save(nuevoEvento);
  }

  async findAll() {
    return await this.eventoRepository.find({
      where: { activo: true },
      order: { fecha_evento: 'ASC' },
    });
  }

  async findOne(id: number) {
    const evento = await this.eventoRepository.findOne({
      where: { id_evento: id, activo: true },
    });

    if (!evento) {
      throw new NotFoundException(`El evento con ID ${id} no existe o fue eliminado.`);
    }

    return evento;
  }

  async update(id: number, updateEventoDto: UpdateEventoDto) {
    this.validarEvento(updateEventoDto);

    const evento = await this.findOne(id);
    Object.assign(evento, {
      ...updateEventoDto,
      fecha_evento: updateEventoDto.fecha_evento
        ? new Date(updateEventoDto.fecha_evento)
        : evento.fecha_evento,
      id_sucursal:
        updateEventoDto.id_sucursal !== undefined ? Number(updateEventoDto.id_sucursal) : evento.id_sucursal,
      cupo_maximo:
        updateEventoDto.cupo_maximo !== undefined ? Number(updateEventoDto.cupo_maximo) : evento.cupo_maximo,
    });

    return await this.eventoRepository.save(evento);
  }

  async remove(id: number) {
    const evento = await this.findOne(id);
    evento.activo = false;
    await this.eventoRepository.save(evento);

    return { mensaje: `El evento '${evento.nombre_evento}' fue eliminado lógicamente.` };
  }
}
