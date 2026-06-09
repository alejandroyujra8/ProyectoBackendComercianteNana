import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCarrito } from '../contexto/CarritoContext';

export function MenuSuperior() {
  const ruta = useLocation().pathname;
  const { cantidadTotal, abrirCarrito } = useCarrito();

  return (
    <nav className="navbar navbar-expand-lg sticky-top py-3 bg-white bg-opacity-75" style={{ backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
      <div className="container d-flex justify-content-between align-items-center">
        
        <Link className="navbar-brand d-flex align-items-center gap-3" to="/">
          <img src="/IconoComercianteNana.png" alt="Nana" style={{ width: '45px', height: '45px', objectFit: 'contain', borderRadius: '12px' }} />
          <div className="d-flex flex-column" style={{ lineHeight: '1.2' }}>
            <span className="fw-bold text-dark" style={{ fontSize: '18px' }}>El Comerciante Nana</span>
            <span className="text-muted" style={{ fontSize: '13px' }}>Tienda de Juegos</span>
          </div>
        </Link>

        <div className="d-none d-lg-flex bg-light p-1 rounded-pill">
          <Link to="/" className={`px-4 py-2 rounded-pill text-decoration-none fw-medium ${ruta === '/' ? 'bg-white shadow-sm text-dark' : 'text-muted'}`}>Inicio</Link>
          <Link to="/agenda" className={`px-4 py-2 rounded-pill text-decoration-none fw-medium ${ruta === '/agenda' ? 'bg-white shadow-sm text-dark' : 'text-muted'}`}>Torneos</Link>
          <Link to="/explorar" className={`px-4 py-2 rounded-pill text-decoration-none fw-medium ${ruta === '/explorar' ? 'bg-white shadow-sm text-dark' : 'text-muted'}`}>Catálogo</Link>
          <Link to="/mapa" className={`px-4 py-2 rounded-pill text-decoration-none fw-medium ${ruta === '/mapa' ? 'bg-white shadow-sm text-dark' : 'text-muted'}`}>Sucursales</Link>
        </div>

        <div className="d-flex align-items-center gap-2">
          <div 
            className="position-relative p-2 bg-light rounded-circle shadow-sm" 
            style={{ width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
            onClick={abrirCarrito}
          >
            <ShoppingCart size={20} className="text-dark" />
            {cantidadTotal > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill" style={{ fontSize: '11px', background: 'var(--naranja-grad)', color: 'white' }}>
                {cantidadTotal}
              </span>
            )}
          </div>
          <Link to="/login" className="btn btn-dark rounded-pill px-4 ms-2 fw-medium shadow-sm">Ingresar</Link>
        </div>

      </div>
    </nav>
  );
}