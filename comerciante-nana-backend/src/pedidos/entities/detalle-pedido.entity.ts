import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('detalle_pedido')
export class DetallePedido {
  @PrimaryGeneratedColumn()
  id_detalle: number;

  @Column()
  id_pedido: number;

  @Column()
  id_juego: number;

  @Column()
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_unitario: number;
}