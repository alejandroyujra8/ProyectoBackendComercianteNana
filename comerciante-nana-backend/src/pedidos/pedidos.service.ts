import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './entities/pedido.entity';
import { DetallePedido } from './entities/detalle-pedido.entity';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    
    @InjectRepository(DetallePedido)
    private readonly detalleRepository: Repository<DetallePedido>,
  ) {}

  // funcion que recibe el id del usuario y un arreglo con los items del carrito
  async procesarCompra(idUsuario: number, itemsCarrito: any[]) {
    
    if (!itemsCarrito || itemsCarrito.length === 0) {
      throw new BadRequestException('El carrito no puede estar vacío.');
    }

    // 1. calculo mi monto total sumando (precio * cantidad) de cada item
    let total = 0;
    for (let i = 0; i < itemsCarrito.length; i++) {
      total = total + (itemsCarrito[i].precio * itemsCarrito[i].cantidad);
    }

    // 2. creo el registro principal del pedido
    const nuevoPedido = this.pedidoRepository.create({
      monto_total: total,
      estado_pedido: 'Completado',
      id_usuario: idUsuario
    });
    
    // lo guardo en la base de datos para que me genere el id_pedido
    const pedidoGuardado = await this.pedidoRepository.save(nuevoPedido);

    // 3. recorro mi carrito otra vez para guardar cada detalle de la compra
    for (let i = 0; i < itemsCarrito.length; i++) {
      const item = itemsCarrito[i];
      
      // creo el detalle asignándole el id del pedido que acabo de crear
      const nuevoDetalle = this.detalleRepository.create({
        id_pedido: pedidoGuardado.id_pedido,
        id_juego: item.id_juego,
        cantidad: item.cantidad,
        precio_unitario: item.precio
      });
      
      // guardo el detalle individual
      await this.detalleRepository.save(nuevoDetalle);
    }

    return {
      mensaje: '¡Transacción Completada con éxito!',
      numero_orden: pedidoGuardado.id_pedido,
      total_pagado: total
    };
  }

  // funcion extra para ver el historial de compras de un usuario
  async verHistorial(idUsuario: number) {
    return await this.pedidoRepository.find({
      where: { id_usuario: idUsuario }
    });
  }
}