import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JuegosService } from './juegos.service';
import { Juego } from './entities/juego.entity';

@Controller('juegos') // La ruta será: http://localhost:3000/juegos
export class JuegosController {
  constructor(private readonly juegosService: JuegosService) {}

  @Post()
  create(@Body() datosJuego: Partial<Juego>) {
    return this.juegosService.create(datosJuego);
  }

  @Get()
  findAll() {
    return this.juegosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.juegosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() datosActualizar: Partial<Juego>) {
    return this.juegosService.update(+id, datosActualizar);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.juegosService.remove(+id);
  }
}