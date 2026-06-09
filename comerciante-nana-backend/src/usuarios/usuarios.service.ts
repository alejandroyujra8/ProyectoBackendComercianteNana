import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { LogAcceso } from './entities/log-acceso.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    
    @InjectRepository(LogAcceso)
    private readonly logRepository: Repository<LogAcceso>,
  ) {}

  // mi validador de contraseñas
  validarFuerzaContrasenia(contrasenia: string): string {
    const tieneMayuscula = /[A-Z]/.test(contrasenia);
    const tieneNumero = /[0-9]/.test(contrasenia);
    const tieneEspecial = /[$@#&!]/.test(contrasenia);
    const longitudValida = contrasenia.length >= 8;

    if (longitudValida && tieneMayuscula && tieneNumero && tieneEspecial) return 'Fuerte';
    if (longitudValida && (tieneMayuscula || tieneNumero)) return 'Intermedio';
    return 'Debil';
  }

  async registrar(datosUsuario: Partial<Usuario>) {
    // me aseguro de que la contraseña no venga vacía para que typescript no llore
    if (!datosUsuario.contrasenia) {
      throw new BadRequestException('La contraseña es obligatoria.');
    }

    const fuerza = this.validarFuerzaContrasenia(datosUsuario.contrasenia);
    
    if (fuerza === 'Debil') {
      throw new BadRequestException('La contraseña es muy débil. Usa al menos 8 caracteres, números y mayúsculas.');
    }

    if (!datosUsuario.correo) {
      throw new BadRequestException('El correo es obligatorio.');
    }

    const existe = await this.usuarioRepository.findOne({ where: { correo: datosUsuario.correo } });
    if (existe) throw new BadRequestException('Este correo ya existe.');

    const contraseniaEncriptada = await bcrypt.hash(datosUsuario.contrasenia, 10);

    // armo el objeto a mano para evitar que typeorm piense que es un array
    const nuevoUsuario = this.usuarioRepository.create({
      nombre: datosUsuario.nombre,
      apellido: datosUsuario.apellido,
      correo: datosUsuario.correo,
      contrasenia: contraseniaEncriptada,
      rol: datosUsuario.rol || 'CLIENTE',
    });

    // le indico explícitamente a typeorm que guarde y retorne un solo <Usuario>
    const usuarioGuardado = await this.usuarioRepository.save<Usuario>(nuevoUsuario);

    return {
      mensaje: `Usuario registrado. Nivel de contraseña: ${fuerza}`,
      usuario: { 
        id_usuario: usuarioGuardado.id_usuario, 
        nombre: usuarioGuardado.nombre, 
        correo: usuarioGuardado.correo 
      }
    };
  }

  async login(correo: string, contrasenia: string, ip: string, browser: string) {
    const usuario = await this.usuarioRepository.findOne({ where: { correo } });
    
    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const esValida = await bcrypt.compare(contrasenia, usuario.contrasenia);
    if (!esValida) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // guardo mi log de acceso de forma silenciosa
    const nuevoLog = this.logRepository.create({
      id_usuario: usuario.id_usuario,
      ip: ip,
      browser: browser,
      evento: 'ingreso',
    });
    await this.logRepository.save(nuevoLog);

    return {
      mensaje: 'Login exitoso',
      usuario: { id_usuario: usuario.id_usuario, nombre: usuario.nombre, rol: usuario.rol }
    };
  }
}