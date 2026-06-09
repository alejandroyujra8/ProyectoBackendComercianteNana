import { Body, Controller, Get, Headers, Ip, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from '../auth/admin.guard';

type RequestConUsuario = Request & {
  usuario?: {
    id_usuario: number;
    nombre: string;
    rol: string;
  };
};

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('registro')
  registrar(@Body() datosUsuario: CreateUsuarioDto) {
    return this.usuariosService.registrar(datosUsuario);
  }

  @Post('login')
  login(
    @Body() credenciales: { correo: string; contrasenia: string; captchaToken?: string },
    @Ip() ip: string,
    @Headers('user-agent') browser: string,
  ) {
    return this.usuariosService.login(
      credenciales.correo,
      credenciales.contrasenia,
      ip || '0.0.0.0',
      browser || 'Navegador desconocido',
      credenciales.captchaToken,
    );
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  logout(
    @Req() request: RequestConUsuario,
    @Ip() ip: string,
    @Headers('user-agent') browser: string,
  ) {
    return this.usuariosService.logout(
      Number(request.usuario?.id_usuario),
      ip || '0.0.0.0',
      browser || 'Navegador desconocido',
    );
  }

  @Get('logs')
  @UseGuards(AuthGuard, AdminGuard)
  listarLogs() {
    return this.usuariosService.listarLogs();
  }
}