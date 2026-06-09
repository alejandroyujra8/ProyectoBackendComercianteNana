export class CreateEventoDto {
  nombre_evento: string;
  tipo_evento: string;
  fecha_evento: string;
  id_sucursal?: number;
  descripcion?: string;
  cupo_maximo?: number;
}
