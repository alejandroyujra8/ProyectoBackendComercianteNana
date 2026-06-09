import { Controller, Post, Body, Ip, Headers } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './entities/usuario.entity';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('registro') 
  registrar(@Body() datosUsuario: Partial<Usuario>) {
    return this.usuariosService.registrar(datosUsuario);
  }

  @Post('login')
  login(
    @Body() credenciales: { correo: string, contrasenia: string },
    @Ip() ip: string,
    @Headers('user-agent') browser: string
  ) {
    // le paso valores por defecto seguros por si el navegador no manda la ip
    return this.usuariosService.login(
      credenciales.correo,
      credenciales.contrasenia,
      ip || '0.0.0.0',
      browser || 'Navegador desconocido'
    );
  }
}