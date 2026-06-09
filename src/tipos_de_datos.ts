export interface JuegoDeMesa {
  id: string;
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

export interface Sucursal {
  id: string;
  ciudad: string;
  direccion: string;
  referencia: string;
}