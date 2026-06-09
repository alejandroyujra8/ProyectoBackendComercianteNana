import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInicio() {
    return {
      sistema: 'El Comerciante Nana',
      descripcion:
        'Aplicación web full-stack para la gestión de juegos de mesa, eventos, torneos, usuarios, pedidos e inventario.',
      materia: 'Desarrollo Web Backend',
      tecnologias: {
        frontend: 'React + Vite',
        backend: 'NodeJS + NestJS',
        base_datos: 'PostgreSQL',
        despliegue: 'Render + Vercel',
        contenedores: 'Docker',
        orquestacion: 'Kubernetes',
      },
      funcionalidades: [
        'Menú de navegación',
        'CRUD de juegos con eliminación lógica',
        'Autenticación de usuarios con permisos',
        'Validación de contraseña débil, intermedia y fuerte',
        'Contraseñas encriptadas con bcrypt',
        'CAPTCHA en login y registro',
        'Logs de acceso con ingreso y salida',
        'Reporte PDF',
        'Gráfico estadístico',
        'Eventos y torneos',
        'Carrito y pedidos',
      ],
      endpoints_publicos: {
        inicio_backend: '/',
        juegos: '/juegos',
        eventos: '/eventos',
        estadisticas: '/pedidos/estadisticas/mas-vendidos',
      },
      enlaces: {
        frontend: 'https://comerciante-nana.vercel.app',
        backend: 'https://comerciante-nana-backend.onrender.com',
        github: 'https://github.com/alejandroyujra8/ProyectoBackendComercianteNana',
      },
      estado: 'Backend funcionando correctamente',
    };
  }
}
