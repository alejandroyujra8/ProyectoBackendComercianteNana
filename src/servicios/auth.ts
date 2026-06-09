import type { UsuarioSesion } from '../tipos_de_datos';

const CLAVE_USUARIO = 'usuarioNana';
const CLAVE_TOKEN = 'tokenNana';

export function guardarSesion(usuario: UsuarioSesion, token: string) {
  localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
  localStorage.setItem(CLAVE_TOKEN, token);
}

export function obtenerUsuario(): UsuarioSesion | null {
  const valor = localStorage.getItem(CLAVE_USUARIO);
  if (!valor) return null;

  try {
    return JSON.parse(valor) as UsuarioSesion;
  } catch {
    cerrarSesion();
    return null;
  }
}

export function obtenerToken(): string | null {
  return localStorage.getItem(CLAVE_TOKEN);
}

export function esAdministrador(): boolean {
  return obtenerUsuario()?.rol === 'ADMIN';
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_USUARIO);
  localStorage.removeItem(CLAVE_TOKEN);
}
