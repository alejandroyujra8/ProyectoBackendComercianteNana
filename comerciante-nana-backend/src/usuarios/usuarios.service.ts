import {
  BadRequestException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { LogAcceso } from './entities/log-acceso.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { generarTokenUsuario } from '../auth/token.util';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService implements OnModuleInit {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    @InjectRepository(LogAcceso)
    private readonly logRepository: Repository<LogAcceso>,
  ) {}

  async onModuleInit() {
    const correoAdmin = process.env.ADMIN_EMAIL || 'admin@nana.com';

    const existeAdmin = await this.usuarioRepository.findOne({
      where: { correo: correoAdmin },
    });

    if (existeAdmin) return;

    const admin = this.usuarioRepository.create({
      nombre: 'Administrador',
      apellido: 'Nana',
      correo: correoAdmin,
      contrasenia: await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin123!', 10),
      rol: 'ADMIN',
      activo: true,
    });

    await this.usuarioRepository.save(admin);
  }

  validarFuerzaContrasenia(contrasenia: string): string {
    const tieneMayuscula = /[A-Z]/.test(contrasenia);
    const tieneMinuscula = /[a-z]/.test(contrasenia);
    const tieneNumero = /[0-9]/.test(contrasenia);
    const tieneEspecial = /[$@#&!*.?_-]/.test(contrasenia);
    const longitudValida = contrasenia.length >= 8;

    if (longitudValida && tieneMayuscula && tieneMinuscula && tieneNumero && tieneEspecial) {
      return 'Fuerte';
    }

    if (longitudValida && tieneMayuscula && tieneMinuscula && tieneNumero) {
      return 'Intermedio';
    }

    return 'Debil';
  }

  private validarCorreo(correo: string) {
    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoCorreo.test(correo)) {
      throw new BadRequestException('El correo no tiene un formato válido.');
    }
  }

  private async verificarCaptcha(captchaToken?: string) {
    const secret = process.env.RECAPTCHA_SECRET;

    if (!secret || secret === 'clave_recaptcha_dev') {
      return true;
    }

    if (!captchaToken) {
      throw new BadRequestException('Debes completar el reCAPTCHA.');
    }

    const params = new URLSearchParams();
    params.append('secret', secret);
    params.append('response', captchaToken);

    const respuesta = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    const resultado = (await respuesta.json()) as { success: boolean };

    if (!resultado.success) {
      throw new BadRequestException('No se pudo validar el reCAPTCHA.');
    }

    return true;
  }

  private async registrarLog(
    idUsuario: number,
    ip: string,
    browser: string,
    evento: 'ingreso' | 'salida',
  ) {
    const nuevoLog = this.logRepository.create({
      id_usuario: idUsuario,
      ip,
      browser,
      evento,
    });

    await this.logRepository.save(nuevoLog);
  }

  async registrar(datosUsuario: CreateUsuarioDto) {
    await this.verificarCaptcha(datosUsuario.captchaToken);

    if (!datosUsuario.nombre?.trim()) {
      throw new BadRequestException('El nombre es obligatorio.');
    }

    if (!datosUsuario.apellido?.trim()) {
      throw new BadRequestException('El apellido es obligatorio.');
    }

    if (!datosUsuario.correo?.trim()) {
      throw new BadRequestException('El correo es obligatorio.');
    }

    if (!datosUsuario.contrasenia) {
      throw new BadRequestException('La contraseña es obligatoria.');
    }

    this.validarCorreo(datosUsuario.correo);

    const fuerza = this.validarFuerzaContrasenia(datosUsuario.contrasenia);

    if (fuerza === 'Debil') {
      throw new BadRequestException(
        'La contraseña es débil. Usa mínimo 8 caracteres, mayúscula, minúscula, número y símbolo.',
      );
    }

    const existe = await this.usuarioRepository.findOne({
      where: { correo: datosUsuario.correo.trim().toLowerCase() },
    });

    if (existe) {
      throw new BadRequestException('Este correo ya está registrado.');
    }

    const usuario = this.usuarioRepository.create({
      nombre: datosUsuario.nombre.trim(),
      apellido: datosUsuario.apellido.trim(),
      correo: datosUsuario.correo.trim().toLowerCase(),
      contrasenia: await bcrypt.hash(datosUsuario.contrasenia, 10),
      rol: 'CLIENTE',
      activo: true,
    });

    const usuarioGuardado = await this.usuarioRepository.save(usuario);

    return {
      mensaje: `Usuario registrado correctamente. Nivel de contraseña: ${fuerza}`,
      fuerza_contrasenia: fuerza,
      usuario: {
        id_usuario: usuarioGuardado.id_usuario,
        nombre: usuarioGuardado.nombre,
        apellido: usuarioGuardado.apellido,
        correo: usuarioGuardado.correo,
        rol: usuarioGuardado.rol,
      },
    };
  }

  async login(
    correo: string,
    contrasenia: string,
    ip: string,
    browser: string,
    captchaToken?: string,
  ) {
    await this.verificarCaptcha(captchaToken);

    if (!correo || !contrasenia) {
      throw new BadRequestException('Correo y contraseña son obligatorios.');
    }

    const usuario = await this.usuarioRepository.findOne({
      where: { correo: correo.trim().toLowerCase(), activo: true },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    const esValida = await bcrypt.compare(contrasenia, usuario.contrasenia);

    if (!esValida) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    await this.registrarLog(usuario.id_usuario, ip, browser, 'ingreso');

    const usuarioRespuesta = {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      rol: usuario.rol,
    };

    return {
      mensaje: 'Login exitoso',
      usuario: usuarioRespuesta,
      token: generarTokenUsuario({
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        rol: usuario.rol,
      }),
    };
  }

  async logout(idUsuario: number, ip: string, browser: string) {
    if (!idUsuario) {
      throw new BadRequestException('No se pudo identificar al usuario.');
    }

    await this.registrarLog(idUsuario, ip, browser, 'salida');

    return {
      mensaje: 'Salida registrada correctamente.',
    };
  }

  async listarLogs() {
    return await this.logRepository.find({
      relations: { usuario: true },
      order: { fecha_hora: 'DESC' },
      take: 100,
    });
  }
}