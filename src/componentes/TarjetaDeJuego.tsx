import type { JuegoDeMesa } from '../tipos_de_datos';
import { Users, Clock, Plus } from 'lucide-react';
import { useState } from 'react';

interface PropsTarjeta {
  juego: JuegoDeMesa;
  alSeleccionar: (j: JuegoDeMesa) => void;
  alAgregarAlCarrito: (j: JuegoDeMesa) => void;
}

export function TarjetaDeJuego({ juego, alSeleccionar, alAgregarAlCarrito }: PropsTarjeta) {
  const [animando, setAnimando] = useState(false);

  const clickRapido = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que se abra el modal al tocar el botón de comprar
    setAnimando(true);
    alAgregarAlCarrito(juego);
    setTimeout(() => setAnimando(false), 200);
  };

  return (
    <div 
      className="tarjeta_efecto_cristal bg-white h-100 d-flex flex-column position-relative shadow-sm" 
      style={{ cursor: 'pointer', padding: '12px', borderRadius: '28px', transition: 'transform 0.3s', border: '1px solid rgba(0,0,0,0.05)' }}
      onClick={() => alSeleccionar(juego)}
    >
      <div className="position-relative mb-3 overflow-hidden" style={{ borderRadius: '20px' }}>
        <img 
          src={juego.imagen} 
          alt={juego.nombre} 
          className="w-100 object-fit-cover" 
          style={{ height: '220px' }} 
        />
        <div className="position-absolute bottom-0 start-0 m-2">
          <span className="badge text-white px-3 py-2 shadow-sm" style={{ background: 'var(--naranja-grad)', borderRadius: '12px', fontSize: '14px' }}>
            Bs. {juego.precio}
          </span>
        </div>
      </div>
      
      <div className="px-2 pb-2 flex-grow-1">
        <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: '17px' }}>{juego.nombre}</h6>
        <p className="text-muted mb-3" style={{ fontSize: '13px' }}>{juego.categoria}</p>
        
        <div className="d-flex gap-3 text-muted" style={{ fontSize: '12px' }}>
          <span className="d-flex align-items-center gap-1"><Users size={14}/> {juego.jugadores}</span>
          <span className="d-flex align-items-center gap-1"><Clock size={14}/> {juego.tiempo}</span>
        </div>
      </div>

      <button 
        className="btn position-absolute bottom-0 end-0 m-3 shadow-lg d-flex align-items-center justify-content-center"
        style={{ 
          background: 'var(--cafe-grad)', 
          color: 'white', 
          width: '45px', 
          height: '45px', 
          borderRadius: '16px',
          transform: animando ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.1s'
        }}
        onClick={clickRapido}
      >
        <Plus size={24} />
      </button>
    </div>
  );
}