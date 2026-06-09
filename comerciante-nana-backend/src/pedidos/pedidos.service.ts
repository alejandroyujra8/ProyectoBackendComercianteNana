import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './entities/pedido.entity';
import { DetallePedido } from './entities/detalle-pedido.entity';
import { Juego } from '../juegos/entities/juego.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { ItemCarritoDto } from './dto/create-pedido.dto';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,

    @InjectRepository(DetallePedido)
    private readonly detalleRepository: Repository<DetallePedido>,

    @InjectRepository(Juego)
    private readonly juegoRepository: Repository<Juego>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async procesarCompra(idUsuario: number, itemsCarrito: ItemCarritoDto[]) {
    if (!idUsuario) {
      throw new BadRequestException('Debes iniciar sesión para comprar.');
    }

    if (!itemsCarrito || itemsCarrito.length === 0) {
      throw new BadRequestException('El carrito no puede estar vacío.');
    }

    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: idUsuario, activo: true },
    });

    if (!usuario) {
      throw new NotFoundException('El usuario no existe o está inactivo.');
    }

    let total = 0;
    const detallesPreparados: Array<{ id_juego: number; cantidad: number; precio_unitario: number }> = [];

    for (const item of itemsCarrito) {
      const idJuego = Number(item.id_juego);
      const cantidad = Number(item.cantidad);

      if (!idJuego || cantidad <= 0) {
        throw new BadRequestException('El carrito contiene datos inválidos.');
      }

      const juego = await this.juegoRepository.findOne({
        where: { id_juego: idJuego, activo: true },
      });

      if (!juego) {
        throw new NotFoundException(`El juego con ID ${idJuego} no existe o está inactivo.`);
      }

      const precioUnitario = Number(juego.precio);
      total += precioUnitario * cantidad;
      detallesPreparados.push({ id_juego: idJuego, cantidad, precio_unitario: precioUnitario });
    }

    const nuevoPedido = this.pedidoRepository.create({
      monto_total: total,
      estado_pedido: 'Completado',
      id_usuario: idUsuario,
    });

    const pedidoGuardado = await this.pedidoRepository.save(nuevoPedido);

    for (const item of detallesPreparados) {
      const nuevoDetalle = this.detalleRepository.create({
        id_pedido: pedidoGuardado.id_pedido,
        id_juego: item.id_juego,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
      });

      await this.detalleRepository.save(nuevoDetalle);
    }

    return {
      mensaje: '¡Transacción completada con éxito!',
      numero_orden: pedidoGuardado.id_pedido,
      total_pagado: total,
    };
  }

  async verHistorial(idUsuario: number) {
    return await this.pedidoRepository.find({
      where: { id_usuario: idUsuario },
      order: { fecha_pedido: 'DESC' },
    });
  }

  async juegosMasVendidos() {
    const resultado = await this.detalleRepository
      .createQueryBuilder('detalle')
      .innerJoin(Juego, 'juego', 'juego.id_juego = detalle.id_juego')
      .select('juego.nombre_juego', 'nombre')
      .addSelect('SUM(detalle.cantidad)', 'ventas')
      .groupBy('juego.nombre_juego')
      .orderBy('SUM(detalle.cantidad)', 'DESC')
      .limit(5)
      .getRawMany();

    return resultado.map((item) => ({
      nombre: item.nombre,
      ventas: Number(item.ventas),
    }));
  }
}
