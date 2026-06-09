import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JuegosService } from './juegos.service';
import { CreateJuegoDto } from './dto/create-juego.dto';
import { UpdateJuegoDto } from './dto/update-juego.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('juegos')
export class JuegosController {
  constructor(private readonly juegosService: JuegosService) {}

  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  create(@Body() datosJuego: CreateJuegoDto) {
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
  @UseGuards(AuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() datosActualizar: UpdateJuegoDto) {
    return this.juegosService.update(+id, datosActualizar);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.juegosService.remove(+id);
  }
}
