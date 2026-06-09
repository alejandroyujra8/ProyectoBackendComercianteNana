import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('inscripcion')
export class Inscripcion {
  @PrimaryGeneratedColumn()
  id_inscripcion: number;

  @Column()
  id_usuario: number;

  @Column()
  id_evento: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_inscripcion: Date;
}