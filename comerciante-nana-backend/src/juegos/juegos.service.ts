import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Juego } from './entities/juego.entity';

@Injectable()
export class JuegosService {
  constructor(
    @InjectRepository(Juego)
    private readonly juegoRepository: Repository<Juego>,
  ) {}

  // 1. CREAR un nuevo juego
  async create(datosJuego: Partial<Juego>): Promise<Juego> {
    const nuevoJuego = this.juegoRepository.create(datosJuego);
    return await this.juegoRepository.save(nuevoJuego);
  }

  // 2. LEER todos los juegos (SOLO LOS ACTIVOS)
  async findAll(): Promise<Juego[]> {
    return await this.juegoRepository.find({
      where: { activo: true }, // Esto asegura que no mostremos los eliminados logicamente
    });
  }

  // 3. LEER un solo juego por su ID
  async findOne(id: number): Promise<Juego> {
    const juego = await this.juegoRepository.findOne({
      where: { id_juego: id, activo: true },
    });
    if (!juego) {
      throw new NotFoundException(`El juego con ID ${id} no existe o fue eliminado.`);
    }
    return juego;
  }

  // 4. ACTUALIZAR un juego
  async update(id: number, datosActualizar: Partial<Juego>): Promise<Juego> {
    const juego = await this.findOne(id); // Verificamos que exista primero
    Object.assign(juego, datosActualizar);
    return await this.juegoRepository.save(juego);
  }

  // 5. ELIMINAR LÓGICAMENTE (Requisito de tu docente)
  async remove(id: number): Promise<{ mensaje: string }> {
    const juego = await this.findOne(id); // Verificamos que exista
    juego.activo = false; // Cambiamos el estado en lugar de borrarlo
    await this.juegoRepository.save(juego);
    return { mensaje: `El juego '${juego.nombre_juego}' ha sido eliminado lógicamente (desactivado).` };
  }
}