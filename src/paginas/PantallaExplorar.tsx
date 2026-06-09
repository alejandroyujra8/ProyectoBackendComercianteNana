import { useState } from 'react';
import { lista_de_juegos } from '../datos_simulados';
import { TarjetaDeJuego } from '../componentes/TarjetaDeJuego';
import type { JuegoDeMesa } from '../tipos_de_datos';
import { X, ShoppingCart, Search } from 'lucide-react';
import { useCarrito } from '../contexto/CarritoContext';

export function PantallaExplorar() {
  const [juegoSeleccionado, setJuegoSeleccionado] = useState<JuegoDeMesa | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const { agregarAlCarrito } = useCarrito();

  // Filtro de búsqueda simple
  const juegosFiltrados = lista_de_juegos.filter(juego => 
    juego.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    juego.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3">
        <div>
          <h2 className="fw-bold mb-1 text-dark display-5">Catálogo</h2>
          <p className="text-muted fs-5 mb-0">Encuentra tu próximo juego favorito</p>
        </div>
        
        {/* Barra de búsqueda estilo Apple */}
        <div className="input-group" style={{ maxWidth: '350px', background: '#f3f4f6', borderRadius: '9999px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}>
          <span className="input-group-text bg-transparent border-0 text-muted px-3">
            <Search size={20} />
          </span>
          <input 
            type="text" 
            className="form-control bg-transparent border-0 py-2 shadow-none" 
            placeholder="Buscar juegos o categorías..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* Grid de todos los juegos */}
      <div className="row g-4">
        {juegosFiltrados.length > 0 ? (
          juegosFiltrados.map(juego => (
            <div className="col-12 col-md-6 col-lg-4" key={juego.id}>
              <TarjetaDeJuego 
                juego={juego} 
                alSeleccionar={setJuegoSeleccionado}
                alAgregarAlCarrito={agregarAlCarrito}
              />
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <p className="text-muted fs-5">No encontramos juegos con esa búsqueda.</p>
          </div>
        )}
      </div>

      {/* Modal / Ventanita del Juego (Mismo diseño que el inicio) */}
      {juegoSeleccionado && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
          style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1100, backdropFilter: 'blur(8px)' }}
          onClick={() => setJuegoSeleccionado(null)}
        >
          <div 
            className="bg-white p-0 shadow-lg m-3 w-100 position-relative" 
            style={{ maxWidth: '500px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '40px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={juegoSeleccionado.imagen} 
              className="w-100" 
              style={{ height: '250px', borderRadius: '40px 40px 0 0', objectFit: 'cover' }} 
              alt={juegoSeleccionado.nombre} 
            />

            <button 
              className="btn btn-light position-absolute d-flex justify-content-center align-items-center shadow-sm" 
              style={{ top: '16px', right: '16px', borderRadius: '50%', width: '36px', height: '36px', background: 'rgba(255,255,255,0.9)', border: 'none', zIndex: 10 }}
              onClick={() => setJuegoSeleccionado(null)}
            >
              <X size={20} className="text-dark" />
            </button>

            <div className="p-4 p-md-5">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h3 className="fw-bold mb-0 text-dark">{juegoSeleccionado.nombre}</h3>
                <span className="badge text-white px-3 py-2" style={{ background: 'var(--naranja-grad)', borderRadius: '12px', fontSize: '15px' }}>
                  Bs. {juegoSeleccionado.precio}
                </span>
              </div>
              <span className="badge text-muted border px-3 py-1 mb-4" style={{ borderRadius: '9999px', fontSize: '12px', fontWeight: '500', background: 'var(--bg-pill)' }}>
                {juegoSeleccionado.categoria}
              </span>

              <p className="text-muted mb-4" style={{ fontSize: '15px', lineHeight: '1.6' }}>
                {juegoSeleccionado.descripcion}
              </p>

              <button 
                className="btn w-100 py-3 mt-2 text-white fw-bold d-flex justify-content-center align-items-center gap-2" 
                style={{ background: 'var(--cafe-grad)', borderRadius: '20px', fontSize: '16px' }}
                onClick={() => {
                  agregarAlCarrito(juegoSeleccionado);
                  setJuegoSeleccionado(null);
                }}
              >
                <ShoppingCart size={20}/> Añadir al carrito
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}