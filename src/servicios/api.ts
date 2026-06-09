import axios from 'axios';
import type { JuegoApi, JuegoDeMesa } from '../tipos_de_datos';
import { obtenerToken } from './auth';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = obtenerToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function nombreCategoria(idCategoria?: number | null): string {
  const categorias: Record<number, string> = {
    1: 'Party Games',
    2: 'Estrategia',
    3: 'Familiares',
    4: 'Cartas',
  };

  return categorias[Number(idCategoria || 1)] || 'General';
}

export function convertirJuegoDesdeApi(juego: JuegoApi): JuegoDeMesa {
  return {
    id: String(juego.id_juego),
    id_juego: juego.id_juego,
    nombre: juego.nombre_juego,
    categoria: nombreCategoria(juego.id_categoria),
    precio: Number(juego.precio),
    jugadores: juego.jugadores_rango || '2 - 4',
    tiempo: juego.tiempo_estimado || '30 min',
    edad: juego.edad_sugerida || '8+',
    imagen: juego.imagen_ruta || '/imagenes/default.png',
    descripcion: juego.descripcion || 'Sin descripción registrada.',
    en_stock: juego.activo,
  };
}
