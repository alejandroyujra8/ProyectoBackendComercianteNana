import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JuegosModule } from './juegos/juegos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PedidosModule } from './pedidos/pedidos.module'; 
import { EventosModule } from './eventos/eventos.module';
import { InscripcionesModule } from './inscripciones/inscripciones.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres', 
      password: '12345678', 
      database: 'comerciante_nana',
      autoLoadEntities: true,
      synchronize: false, 
    }),
    JuegosModule,
    UsuariosModule,
    PedidosModule, // lo registro aqui
    EventosModule,
    InscripcionesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}