export interface ItemCarritoDto {
  id_juego: number;
  cantidad: number;
}

export class CreatePedidoDto {
  carrito: ItemCarritoDto[];
}
