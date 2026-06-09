# 🎲 El Comerciante Nana - Sistema de Gestión Full-Stack

¡Bienvenido al repositorio oficial de **El Comerciante Nana**! Este es un sistema integral desarrollado para la gestión administrativa, catálogo de juegos de mesa y control de eventos/torneos.

## 🚀 Tecnologías Utilizadas
Este proyecto está construido con una arquitectura moderna separando el cliente del servidor:

**Frontend (Interfaz de Usuario):**
*   **React + Vite:** Para una experiencia de usuario rápida y fluida.
*   **Recharts:** Generación de gráficos estadísticos en tiempo real.
*   **jsPDF & AutoTable:** Exportación de reportes administrativos en formato PDF.
*   **Google reCAPTCHA:** Seguridad contra bots en el registro y acceso.
*   **Bootstrap / CSS Custom:** Diseño responsivo y moderno (Efecto Cristal).

**Backend (Lógica y Servidor):**
*   **NestJS:** Framework progresivo de Node.js para un backend escalable y robusto.
*   **TypeORM:** Mapeo objeto-relacional para consultas seguras.
*   **Bcrypt:** Encriptación de contraseñas de alta seguridad.

**Base de Datos:**
*   **PostgreSQL:** Motor de base de datos relacional robusto.

## ✨ Características Principales
1.  **Autenticación y Seguridad:** Registro e inicio de sesión con encriptación de datos, validación por reCAPTCHA y registro silencioso de logs de acceso (IP, fecha y navegador).
2.  **CRUD con Eliminación Lógica:** Gestión completa del inventario de juegos (Crear, Leer, Actualizar, Eliminar). Los registros eliminados no se borran de la BD, solo se desactivan para mantener la integridad histórica.
3.  **Panel de Control Administrativo:** Dashboard exclusivo con visualización de datos estadísticos interactivos.
4.  **Generación de Reportes:** Descarga automática de inventario en PDF con un solo clic.

## 🛠️ Instalación Local (Entorno de Desarrollo)

Para ejecutar este proyecto en tu máquina local, necesitas tener instalado Node.js y PostgreSQL.

**1. Clonar el repositorio:**
\`\`\`bash
git clone https://github.com/alejandroyujra8/ProyectoBackendComercianteNana.git
\`\`\`

**2. Levantar el Backend:**
\`\`\`bash
cd comerciante-nana-backend
npm install
npm run start:dev
\`\`\`

**3. Levantar el Frontend:**
Abre una nueva terminal en la raíz del proyecto.
\`\`\`bash
npm install
npm run dev
\`\`\`
El sistema estará disponible en \`http://localhost:5173\`.

---
*Desarrollado con pasión para la materia de Backend / DevOps.*