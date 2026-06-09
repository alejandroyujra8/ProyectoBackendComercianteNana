import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario } from './entities/usuario.entity';
import { LogAcceso } from './entities/log-acceso.entity';

@Module({
  // Agregué LogAcceso para poder registrar las IPs y navegadores
  imports: [TypeOrmModule.forFeature([Usuario, LogAcceso])],
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsuariosModule {}