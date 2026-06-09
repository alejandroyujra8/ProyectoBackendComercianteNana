import { useState } from 'react';
import { Calendar, Users, ChevronRight, Trophy, X, CheckCircle } from 'lucide-react';

export function PantallaAgenda() {
  const [eventoSeleccionado, setEventoSeleccionado] = useState<any>(null);
  const [inscrito, setInscrito] = useState(false);

  const eventos = [
    { id: 1, nombre: 'Torneo Nacional de Catan', tipo: 'Competitivo', participantes: '32 inscritos' },
    { id: 2, nombre: 'Noche de Party Games', tipo: 'Casual', participantes: 'Entrada Libre' },
    { id: 3, nombre: 'Demostración: Secret Hitler', tipo: 'Aprende a jugar', participantes: 'Cupos limitados' },
    { id: 4, nombre: 'Liga de Magic The Gathering', tipo: 'Competitivo', participantes: '16 inscritos' },
  ];

  const procesarInscripcion = () => {
    setInscrito(true);
    setTimeout(() => {
      setInscrito(false);
      setEventoSeleccionado(null);
    }, 2500);
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="mb-5">
        <h2 className="fw-bold mb-1 text-dark display-5">Eventos y Torneos</h2>
        <p className="text-muted fs-5">Únete a nuestra comunidad jugona</p>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-12 col-lg-5">
          <div className="tarjeta_efecto_cristal p-4 h-100 bg-white shadow-sm" style={{ borderRadius: '32px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="d-flex justify-content-center align-items-center text-white" style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--naranja-grad)' }}>
                <Trophy size={24} />
              </div>
              <div>
                <h5 className="fw-bold mb-0 text-dark">Próximo Gran Torneo</h5>
                <small className="text-muted">Premios y sorpresas</small>
              </div>
            </div>

            <div className="position-relative ms-3 mt-4">
              <div className="position-absolute top-0 bottom-0" style={{ width: '2px', background: '#e5e7eb', left: '4px', zIndex: 0 }}></div>
              
              <ul className="list-unstyled position-relative z-1 mb-0 d-flex flex-column gap-4">
                <li className="d-flex align-items-start gap-3">
                  <div className="mt-1" style={{ width: '10px', height: '10px', background: 'var(--naranja-grad)', borderRadius: '50%' }}></div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '15px' }}>Inscripciones Abiertas</h6>
                    <small className="text-muted" style={{ fontSize: '13px' }}>Hasta el viernes 15</small>
                  </div>
                </li>
                <li className="d-flex align-items-start gap-3">
                  <div className="mt-1" style={{ width: '10px', height: '10px', background: '#e5e7eb', borderRadius: '50%' }}></div>
                  <span className="text-muted fw-medium" style={{ fontSize: '14px' }}>Fase de Grupos (Sábado)</span>
                </li>
                <li className="d-flex align-items-start gap-3">
                  <div className="mt-1" style={{ width: '10px', height: '10px', background: '#e5e7eb', borderRadius: '50%' }}></div>
                  <span className="text-muted fw-medium" style={{ fontSize: '14px' }}>Semifinales (Domingo M.)</span>
                </li>
                <li className="d-flex align-items-start gap-3">
                  <div className="mt-1" style={{ width: '10px', height: '10px', background: '#e5e7eb', borderRadius: '50%' }}></div>
                  <span className="text-muted fw-medium" style={{ fontSize: '14px' }}>Gran Final (Domingo T.)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <h6 className="text-muted fw-bold mb-3 small" style={{ letterSpacing: '1.5px' }}>AGENDA DE ESTE MES</h6>
          <div className="d-flex flex-column gap-3">
            {eventos.map((evento) => (
              <div 
                key={evento.id} 
                onClick={() => setEventoSeleccionado(evento)}
                className="bg-white p-3 d-flex align-items-center justify-content-between shadow-sm" 
                style={{ border: '1px solid rgba(0,0,0,0.05)', borderRadius: '24px', cursor: 'pointer', transition: 'transform 0.2s' }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="text-white d-flex align-items-center justify-content-center" style={{ background: 'var(--cafe-grad)', width: '48px', height: '48px', borderRadius: '16px', fontWeight: 'bold' }}>
                    {evento.id}
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '16px' }}>{evento.nombre}</h6>
                    <small className="text-muted d-flex align-items-center gap-2 mt-1">
                      <span className="badge bg-light text-muted border px-2">{evento.tipo}</span>
                      <Users size={12} /> {evento.participantes}
                    </small>
                  </div>
                </div>
                <ChevronRight size={24} className="text-muted opacity-50 pe-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="tarjeta_efecto_cristal p-4 bg-white shadow-sm" style={{ borderRadius: '32px', border: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="d-flex justify-content-center align-items-center text-white" style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--crema-grad)', color: 'var(--text-main)' }}>
            <Calendar size={20} className="text-dark" />
          </div>
          <div>
            <h6 className="fw-bold mb-0 text-dark">Horarios de Juego Libre</h6>
            <small className="text-muted">Ven con tus amigos, nosotros te prestamos los juegos.</small>
          </div>
        </div>
        <div className="row g-3">
           <div className="col-12 col-md-6">
              <div className="p-3 bg-light rounded-4">
                <span className="d-block fw-bold text-dark mb-1">Martes a Viernes</span>
                <span className="text-muted small">15:00 PM - 21:00 PM</span>
              </div>
           </div>
           <div className="col-12 col-md-6">
              <div className="p-3 bg-light rounded-4">
                <span className="d-block fw-bold text-dark mb-1">Sábados y Domingos</span>
                <span className="text-muted small">10:00 AM - 22:00 PM</span>
              </div>
           </div>
        </div>
      </div>

      {eventoSeleccionado && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
          style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1100, backdropFilter: 'blur(8px)' }}
          onClick={() => setEventoSeleccionado(null)}
        >
          <div 
            className="bg-white p-5 shadow-lg m-3 w-100 position-relative text-center" 
            style={{ maxWidth: '400px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '40px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="btn btn-light position-absolute d-flex justify-content-center align-items-center shadow-sm" 
              style={{ top: '16px', right: '16px', borderRadius: '50%', width: '36px', height: '36px', border: 'none' }}
              onClick={() => setEventoSeleccionado(null)}
            >
              <X size={20} className="text-dark" />
            </button>

            {inscrito ? (
              <div className="py-4">
                <CheckCircle size={60} className="text-success mb-3 mx-auto" />
                <h4 className="fw-bold text-dark">¡Inscripción Exitosa!</h4>
                <p className="text-muted">Te esperamos en el evento.</p>
              </div>
            ) : (
              <>
                <div className="d-inline-flex justify-content-center align-items-center text-white mb-4" style={{ background: 'var(--naranja-grad)', width: '60px', height: '60px', borderRadius: '20px' }}>
                  <Trophy size={30} />
                </div>
                <h4 className="fw-bold text-dark mb-2">{eventoSeleccionado.nombre}</h4>
                <p className="text-muted mb-4">Confirma tu asistencia a este evento. Recibirás más detalles en la tienda.</p>
                <button 
                  className="btn w-100 py-3 text-white fw-bold shadow-sm" 
                  style={{ background: 'var(--cafe-grad)', borderRadius: '20px', fontSize: '16px' }}
                  onClick={procesarInscripcion}
                >
                  Inscribirme Ahora
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}