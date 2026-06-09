import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// @Entity le dice a NestJS que esta clase representa la tabla 'juego' en Postgres
@Entity('juego')
export class Juego {
  
  // PrimaryGeneratedColumn es para la llave primaria que se auto incrementa
  @PrimaryGeneratedColumn()
  id_juego: number;

  // @Column define cada campo. Le decimos el tipo exacto que usamos en SQL
  @Column({ type: 'varchar', length: 100 })
  nombre_juego: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ type: 'varchar', length: 20 })
  jugadores_rango: string;

  @Column({ type: 'varchar', length: 20 })
  tiempo_estimado: string;

  @Column({ type: 'varchar', length: 10 })
  edad_sugerida: string;

  @Column({ type: 'varchar', length: 255 })
  imagen_ruta: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'int', nullable: true })
  id_categoria: number;

  // ESTA ES LA CLAVE PARA LA ELIMINACION LOGICA DEL DOCENTE
  @Column({ type: 'boolean', default: true })
  activo: boolean;
}
