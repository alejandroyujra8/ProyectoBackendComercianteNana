import { Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowLeft } from 'lucide-react';

export function PantallaExito() {
  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center py-5">
      <div className="tarjeta_efecto_cristal p-5 text-center shadow-lg bg-white" style={{ maxWidth: '600px', borderRadius: '40px', border: '1px solid rgba(0,0,0,0.05)' }}>
        
        <div className="mb-4 d-inline-flex justify-content-center align-items-center" style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--verde-grad)', color: 'white', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)' }}>
          <CheckCircle size={50} />
        </div>
        
        <h1 className="fw-bold text-dark display-5 mb-3">¡Transacción Completada!</h1>
        <p className="text-muted fs-5 mb-4">
          Tu pedido ha sido procesado con éxito. Prepara tu mesa, tus juegos están en camino.
        </p>

        <div className="p-4 bg-light text-start mb-5 d-flex align-items-center gap-3" style={{ borderRadius: '24px' }}>
          <ShoppingBag size={32} style={{ color: 'var(--naranja-grad)' }} />
          <div>
            <h6 className="fw-bold mb-1">Número de orden: #NAN-00921</h6>
            <span className="text-muted small">Te enviaremos los detalles al correo electrónico registrado.</span>
          </div>
        </div>

        <Link to="/" className="btn text-white fw-bold py-3 px-5 shadow-sm d-inline-flex align-items-center gap-2" style={{ background: 'var(--naranja-grad)', borderRadius: '9999px', fontSize: '18px' }}>
          <ArrowLeft size={20} /> Volver al Inicio
        </Link>
      </div>
    </div>
  );
}