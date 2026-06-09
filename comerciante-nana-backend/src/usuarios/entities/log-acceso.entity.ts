import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('log_acceso')
export class LogAcceso {
  @PrimaryGeneratedColumn()
  id_log: number;

  @Column()
  id_usuario: number;

  @Column({ type: 'varchar', length: 50 })
  ip: string;

  @Column({ type: 'varchar', length: 20 })
  evento: string; // Nota: Aquí guardaré si es 'ingreso' o 'salida'

  @Column({ type: 'varchar', length: 255 })
  browser: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_hora: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}