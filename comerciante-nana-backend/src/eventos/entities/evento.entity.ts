import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('evento')
export class Evento {
  @PrimaryGeneratedColumn()
  id_evento: number;

  @Column({ type: 'varchar', length: 100 })
  nombre_evento: string;

  @Column({ type: 'varchar', length: 50 })
  tipo_evento: string;

  @Column({ type: 'timestamp' })
  fecha_evento: Date;

  // mi llave foranea para saber en que sucursal es el torneo
  @Column()
  id_sucursal: number;
}