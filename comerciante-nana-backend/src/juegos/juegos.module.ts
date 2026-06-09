import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JuegosService } from './juegos.service';
import { JuegosController } from './juegos.controller';
import { Juego } from './entities/juego.entity';

@Module({
  // Importamos TypeOrmModule.forFeature y le pasamos nuestra clase Juego
  imports: [TypeOrmModule.forFeature([Juego])],
  controllers: [JuegosController],
  providers: [JuegosService],
})
export class JuegosModule {}