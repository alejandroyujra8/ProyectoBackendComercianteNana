import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pedido')
export class Pedido {
  @PrimaryGeneratedColumn()
  id_pedido: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_pedido: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto_total: number;

  @Column({ type: 'varchar', length: 30, default: 'Completado' })
  estado_pedido: string;

  // vinculo mi pedido con el id de mi usuario
  @Column()
  id_usuario: number;
}