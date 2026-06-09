import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { verificarTokenUsuario } from './token.util';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request & { usuario?: any }>();
    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Debes iniciar sesión para acceder a esta ruta.');
    }

    const token = authorization.replace('Bearer ', '').trim();

    try {
      request.usuario = verificarTokenUsuario(token);
      return true;
    } catch {
      throw new UnauthorizedException('Sesión inválida o expirada.');
    }
  }
}
