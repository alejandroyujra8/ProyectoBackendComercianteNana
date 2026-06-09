import { Body, Controller, ForbiddenException, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { PedidosService } from './pedidos.service';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { CreatePedidoDto } from './dto/create-pedido.dto';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post('comprar')
  @UseGuards(AuthGuard)
  procesarCompra(
    @Body() datosCompra: CreatePedidoDto,
    @Req() req: Request & { usuario?: { id_usuario: number } },
  ) {
    return this.pedidosService.procesarCompra(Number(req.usuario?.id_usuario), datosCompra.carrito);
  }

  @Get('historial/:id')
  @UseGuards(AuthGuard)
  verHistorial(
    @Param('id') id: string,
    @Req() req: Request & { usuario?: { id_usuario: number; rol: string } },
  ) {
    const idConsultado = Number(id);
    const usuarioToken = req.usuario;

    if (usuarioToken?.rol !== 'ADMIN' && Number(usuarioToken?.id_usuario) !== idConsultado) {
      throw new ForbiddenException('No puedes revisar compras de otro usuario.');
    }

    return this.pedidosService.verHistorial(idConsultado);
  }

  @Get('estadisticas/mas-vendidos')
  @UseGuards(AuthGuard, AdminGuard)
  juegosMasVendidos() {
    return this.pedidosService.juegosMasVendidos();
  }
}
