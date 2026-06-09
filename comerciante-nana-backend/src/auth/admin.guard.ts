import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ usuario?: { rol?: string } }>();

    if (request.usuario?.rol !== 'ADMIN') {
      throw new ForbiddenException('Solo un administrador puede realizar esta acción.');
    }

    return true;
  }
}
