import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { PedidosService } from './pedidos.service';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  // ruta para procesar la compra desde react
  @Post('comprar')
  procesarCompra(@Body() datosCompra: { id_usuario: number, carrito: any[] }) {
    return this.pedidosService.procesarCompra(datosCompra.id_usuario, datosCompra.carrito);
  }

  // ruta para que el cliente vea sus compras pasadas
  @Get('historial/:id')
  verHistorial(@Param('id') id: string) {
    return this.pedidosService.verHistorial(+id);
  }
}