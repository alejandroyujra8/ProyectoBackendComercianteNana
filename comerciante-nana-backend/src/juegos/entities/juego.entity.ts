import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('juego')
export class Juego {
  @PrimaryGeneratedColumn()
  id_juego: number;

  @Column({ type: 'varchar', length: 100 })
  nombre_juego: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ type: 'varchar', length: 20, default: '2 - 4' })
  jugadores_rango: string;

  @Column({ type: 'varchar', length: 20, default: '30 min' })
  tiempo_estimado: string;

  @Column({ type: 'varchar', length: 10, default: '8+' })
  edad_sugerida: string;

  @Column({ type: 'varchar', length: 255, default: '/imagenes/default.png' })
  imagen_ruta: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'int', nullable: true })
  id_categoria: number;

  @Column({ type: 'boolean', default: true })
  activo: boolean;
}
