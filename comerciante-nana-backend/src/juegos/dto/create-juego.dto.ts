export class CreateJuegoDto {
  nombre_juego: string;
  precio: number;
  jugadores_rango?: string;
  tiempo_estimado?: string;
  edad_sugerida?: string;
  imagen_ruta?: string;
  descripcion?: string;
  id_categoria?: number;
}
