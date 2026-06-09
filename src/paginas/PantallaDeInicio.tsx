import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { lista_de_juegos } from '../datos_simulados';
import { TarjetaDeJuego } from '../componentes/TarjetaDeJuego';
import type { JuegoApi, JuegoDeMesa } from '../tipos_de_datos';
import { ArrowRight, MapPin, ShoppingBag, ShoppingCart, Sparkles, Trophy, X } from 'lucide-react';
import { useCarrito } from '../contexto/CarritoContext';
import { api, convertirJuegoDesdeApi } from '../servicios/api';

export function PantallaDeInicio() {
  const [categoria, setCategoria] = useState('Todos');
  const [juegos, setJuegos] = useState<JuegoDeMesa[]>([]);
  const [juegoSeleccionado, setJuegoSeleccionado] = useState<JuegoDeMesa | null>(null);
  const { agregarAlCarrito } = useCarrito();

  useEffect(() => {
    const cargarJuegos = async () => {
      try {
        const respuesta = await api.get<JuegoApi[]>('/juegos');
        setJuegos(respuesta.data.map(convertirJuegoDesdeApi));
      } catch {
        setJuegos(lista_de_juegos);
      }
    };

    cargarJuegos();
  }, []);

  const filtrados = categoria === 'Todos' ? juegos : juegos.filter((juego) => juego.categoria === categoria);

  return (
    <div className="container mt-4 mb-5">
      <section
        className="position-relative d-flex flex-column justify-content-end p-4 p-md-5 text-white mb-5 shadow-sm"
        style={{
          minHeight: '450px',
          borderRadius: '45px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent), url(/imagenes/SecretHitler.png) center/cover',
        }}
      >
        <div className="position-relative z-1">
          <span className="badge bg-white text-dark mb-3 px-3 py-2 rounded-pill fw-bold">JUEGO DEL MES</span>
          <h1 className="fw-bold display-3 mb-2">Secret Hitler</h1>
          <p className="fs-5 mb-4 opacity-75">¿Podrás encontrar al impostor antes de que sea tarde?</p>
          <Link to="/explorar" className="btn btn-light fw-bold px-4 py-3 rounded-pill d-flex align-items-center gap-2 text-decoration-none" style={{ width: 'fit-content' }}>
            Ver Catálogo <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <div className="row g-3 g-md-4 mb-5">
        <div className="col-6 col-lg-3">
          <Link to="/explorar" className="text-decoration-none">
            <div className="p-4 text-white h-100 d-flex flex-column justify-content-between shadow-sm" style={{ background: 'var(--naranja-grad)', borderRadius: '28px', minHeight: '160px' }}>
              <Sparkles size={30} className="mb-3" />
              <div><h5 className="fw-bold mb-1">Novedades</h5><small className="opacity-75">Recién llegados</small></div>
            </div>
          </Link>
        </div>
        <div className="col-6 col-lg-3">
          <Link to="/explorar" className="text-decoration-none">
            <div className="p-4 text-white h-100 d-flex flex-column justify-content-between shadow-sm" style={{ background: 'var(--cafe-grad)', borderRadius: '28px', minHeight: '160px' }}>
              <ShoppingBag size={30} className="mb-3" />
              <div><h5 className="fw-bold mb-1">Catálogo</h5><small className="opacity-75">Ver todo</small></div>
            </div>
          </Link>
        </div>
        <div className="col-6 col-lg-3">
          <Link to="/mapa" className="text-decoration-none">
            <div className="p-4 text-dark h-100 d-flex flex-column justify-content-between shadow-sm" style={{ background: 'var(--crema-grad)', borderRadius: '28px', minHeight: '160px' }}>
              <MapPin size={30} className="mb-3" />
              <div><h5 className="fw-bold mb-1">Sucursales</h5><small className="opacity-75">Encuéntranos</small></div>
            </div>
          </Link>
        </div>
        <div className="col-6 col-lg-3">
          <Link to="/agenda" className="text-decoration-none">
            <div className="p-4 text-white h-100 d-flex flex-column justify-content-between shadow-sm" style={{ background: 'var(--verde-grad)', borderRadius: '28px', minHeight: '160px' }}>
              <Trophy size={30} className="mb-3" />
              <div><h5 className="fw-bold mb-1">Torneos</h5><small className="opacity-75">Inscripciones</small></div>
            </div>
          </Link>
        </div>
      </div>

      <h6 className="text-muted fw-bold mb-3 small" style={{ letterSpacing: '1.5px' }}>CATEGORÍAS</h6>
      <div className="d-flex gap-2 overflow-auto pb-3 mb-4" style={{ scrollbarWidth: 'none' }}>
        {['Todos', 'Party Games', 'Estrategia', 'Familiares', 'Cartas'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoria(cat)}
            className={`btn px-4 py-2 rounded-pill fw-medium flex-shrink-0 shadow-sm ${categoria === cat ? 'text-white' : 'bg-white text-dark border'}`}
            style={{ background: categoria === cat ? 'var(--text-main)' : '#FFFFFF', fontSize: '14px' }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="row g-4">
        {filtrados.map((juego) => (
          <div className="col-12 col-md-6 col-lg-4" key={juego.id}>
            <TarjetaDeJuego
              juego={juego}
              alSeleccionar={setJuegoSeleccionado}
              alAgregarAlCarrito={agregarAlCarrito}
            />
          </div>
        ))}
      </div>

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
            <img src={juegoSeleccionado.imagen} className="w-100" style={{ height: '250px', borderRadius: '40px 40px 0 0', objectFit: 'cover' }} alt={juegoSeleccionado.nombre} />

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
                <ShoppingCart size={20} /> Añadir al carrito
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
