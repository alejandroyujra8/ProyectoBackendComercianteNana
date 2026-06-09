export interface JuegoDeMesa {
  id: string;
  id_juego?: number;
  nombre: string;
  categoria: string;
  precio: number;
  jugadores: string;
  tiempo: string;
  edad: string;
  imagen: string;
  descripcion: string;
  en_stock: boolean;
}

export interface JuegoApi {
  id_juego: number;
  nombre_juego: string;
  precio: number | string;
  jugadores_rango: string;
  tiempo_estimado: string;
  edad_sugerida: string;
  imagen_ruta: string;
  descripcion: string | null;
  id_categoria: number | null;
  activo: boolean;
}

export interface EventoApi {
  id_evento: number;
  nombre_evento: string;
  tipo_evento: string;
  fecha_evento: string;
  id_sucursal: number;
  descripcion: string | null;
  cupo_maximo: number;
  activo: boolean;
}

export interface Sucursal {
  id: string;
  ciudad: string;
  direccion: string;
  referencia: string;
}

export interface UsuarioSesion {
  id_usuario: number;
  nombre: string;
  apellido?: string;
  correo?: string;
  rol: 'ADMIN' | 'CLIENTE' | string;
}
