import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { CarritoProvider } from './contexto/CarritoContext';
import { PantallaAdmin } from './paginas/PantallaAdmin';
import { MenuSuperior } from './componentes/MenuSuperior';
import { PieDePagina } from './componentes/PieDePagina';
import { PantallaDeInicio } from './paginas/PantallaDeInicio';
import { PantallaExplorar } from './paginas/PantallaExplorar';
import { PantallaDelMapa } from './paginas/PantallaDelMapa';
import { PantallaDeLogin } from './paginas/PantallaDeLogin';
import { PantallaAgenda } from './paginas/PantallaAgenda';
import { PantallaExito } from './paginas/PantallaExito';
import { esAdministrador } from './servicios/auth';

function RutaAdmin() {
  if (!esAdministrador()) {
    return <Navigate to="/login" replace />;
  }

  return <PantallaAdmin />;
}

function EnrutadorYDiseno() {
  const rutaActual = useLocation();
  const esPantallaLogin = rutaActual.pathname === '/login';

  return (
    <>
      {!esPantallaLogin && <MenuSuperior />}

      <div style={{ minHeight: '70vh' }}>
        <Routes>
          <Route path="/" element={<PantallaDeInicio />} />
          <Route path="/agenda" element={<PantallaAgenda />} />
          <Route path="/explorar" element={<PantallaExplorar />} />
          <Route path="/mapa" element={<PantallaDelMapa />} />
          <Route path="/login" element={<PantallaDeLogin />} />
          <Route path="/exito" element={<PantallaExito />} />
          <Route path="/admin" element={<RutaAdmin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {!esPantallaLogin && <PieDePagina />}
    </>
  );
}

function AplicacionPrincipal() {
  return (
    <BrowserRouter>
      <CarritoProvider>
        <EnrutadorYDiseno />
      </CarritoProvider>
    </BrowserRouter>
  );
}

export default AplicacionPrincipal;
