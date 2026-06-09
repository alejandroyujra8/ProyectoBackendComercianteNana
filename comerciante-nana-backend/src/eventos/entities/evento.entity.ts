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

  @Column({ type: 'int', default: 1 })
  id_sucursal: number;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'int', default: 32 })
  cupo_maximo: number;

  @Column({ type: 'boolean', default: true })
  activo: boolean;
}
