import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Juego } from './entities/juego.entity';
import { CreateJuegoDto } from './dto/create-juego.dto';
import { UpdateJuegoDto } from './dto/update-juego.dto';

@Injectable()
export class JuegosService implements OnModuleInit {
  constructor(
    @InjectRepository(Juego)
    private readonly juegoRepository: Repository<Juego>,
  ) {}

  async onModuleInit() {
    const cantidad = await this.juegoRepository.count();
    if (cantidad > 0) return;

    const juegosIniciales: CreateJuegoDto[] = [
      {
        nombre_juego: 'Tulio Lulo Lana Tarro Patana',
        precio: 60,
        jugadores_rango: '2 - 8',
        tiempo_estimado: '15 min',
        edad_sugerida: '8+',
        imagen_ruta: '/imagenes/Tulio31Minutos.png',
        descripcion: 'Un juego de cartas rápido basado en 31 Minutos. ¡Diversión garantizada!',
        id_categoria: 1,
      },
      {
        nombre_juego: 'Pop Up Pirate',
        precio: 30,
        jugadores_rango: '2 - 4',
        tiempo_estimado: '10 min',
        edad_sugerida: '3+',
        imagen_ruta: '/imagenes/PopUpPirate.png',
        descripcion: 'El clásico juego de suspenso del barril.',
        id_categoria: 3,
      },
      {
        nombre_juego: 'Secret Hitler',
        precio: 150,
        jugadores_rango: '5 - 10',
        tiempo_estimado: '45 min',
        edad_sugerida: '13+',
        imagen_ruta: '/imagenes/SecretHitler.png',
        descripcion: 'Intriga política, deducción social y traición.',
        id_categoria: 2,
      },
      {
        nombre_juego: 'Dobble',
        precio: 85,
        jugadores_rango: '2 - 8',
        tiempo_estimado: '15 min',
        edad_sugerida: '6+',
        imagen_ruta: '/imagenes/Dobble.png',
        descripcion: 'Encuentra el símbolo idéntico antes que nadie.',
        id_categoria: 1,
      },
      {
        nombre_juego: 'UNO',
        precio: 45,
        jugadores_rango: '2 - 10',
        tiempo_estimado: '20 min',
        edad_sugerida: '7+',
        imagen_ruta: '/imagenes/UNO.png',
        descripcion: 'No olvides gritar ¡UNO!',
        id_categoria: 4,
      },
    ];

    await this.juegoRepository.save(this.juegoRepository.create(juegosIniciales));
  }

  private validarDatosJuego(datosJuego: Partial<CreateJuegoDto>) {
    if (datosJuego.nombre_juego !== undefined && datosJuego.nombre_juego.trim().length < 2) {
      throw new BadRequestException('El nombre del juego debe tener al menos 2 caracteres.');
    }

    if (datosJuego.precio !== undefined && Number(datosJuego.precio) <= 0) {
      throw new BadRequestException('El precio debe ser mayor a 0.');
    }
  }

  async create(datosJuego: CreateJuegoDto): Promise<Juego> {
    this.validarDatosJuego(datosJuego);

    const nuevoJuego = this.juegoRepository.create({
      ...datosJuego,
      precio: Number(datosJuego.precio),
      jugadores_rango: datosJuego.jugadores_rango || '2 - 4',
      tiempo_estimado: datosJuego.tiempo_estimado || '30 min',
      edad_sugerida: datosJuego.edad_sugerida || '8+',
      imagen_ruta: datosJuego.imagen_ruta || '/imagenes/default.png',
      id_categoria: Number(datosJuego.id_categoria || 1),
      activo: true,
    });

    return await this.juegoRepository.save(nuevoJuego);
  }

  async findAll(): Promise<Juego[]> {
    return await this.juegoRepository.find({
      where: { activo: true },
      order: { id_juego: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Juego> {
    const juego = await this.juegoRepository.findOne({
      where: { id_juego: id, activo: true },
    });

    if (!juego) {
      throw new NotFoundException(`El juego con ID ${id} no existe o fue eliminado.`);
    }

    return juego;
  }

  async update(id: number, datosActualizar: UpdateJuegoDto): Promise<Juego> {
    this.validarDatosJuego(datosActualizar);

    const juego = await this.findOne(id);
    Object.assign(juego, {
      ...datosActualizar,
      precio: datosActualizar.precio !== undefined ? Number(datosActualizar.precio) : juego.precio,
      id_categoria:
        datosActualizar.id_categoria !== undefined ? Number(datosActualizar.id_categoria) : juego.id_categoria,
    });

    return await this.juegoRepository.save(juego);
  }

  async remove(id: number): Promise<{ mensaje: string }> {
    const juego = await this.findOne(id);
    juego.activo = false;
    await this.juegoRepository.save(juego);

    return { mensaje: `El juego '${juego.nombre_juego}' fue eliminado lógicamente.` };
  }
}
