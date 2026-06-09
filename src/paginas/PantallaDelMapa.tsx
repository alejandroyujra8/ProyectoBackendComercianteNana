import { MapPin, Clock, Phone } from 'lucide-react';
import { sucursales } from '../datos_simulados';

export function PantallaDelMapa() {
  return (
    <div className="container mt-4 mb-5">
      <div className="mb-5 text-center">
        <h2 className="fw-bold mb-2 text-dark display-5">Nuestras Sucursales</h2>
        <p className="text-muted fs-5">Visítanos y conoce todo nuestro catálogo en persona.</p>
      </div>

      <div className="row g-4">
        {/* Bloque Principal (La Paz) - Bento Grande */}
        <div className="col-12">
          <div className="tarjeta_efecto_cristal p-4 p-md-5 bg-white shadow-sm d-flex flex-column justify-content-end position-relative overflow-hidden" 
               style={{ 
                 minHeight: '350px', 
                 borderRadius: '40px', 
                 border: '1px solid rgba(0,0,0,0.05)', 
                 /* AQUÍ ESTÁ EL CAMBIO: Apuntamos a /imagenes/ubicacion.png */
                 background: 'linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.2)), url(/imagenes/ubicacion.png) center/cover' 
               }}>
            <div className="position-relative z-1 text-white" style={{ maxWidth: '500px' }}>
              <span className="badge bg-white text-dark mb-3 px-3 py-2 rounded-pill fw-bold">SEDE PRINCIPAL</span>
              <h1 className="fw-bold display-4 mb-2">{sucursales[0].ciudad}</h1>
              <p className="fs-5 mb-4 opacity-75 d-flex align-items-center gap-2"><MapPin size={20}/> {sucursales[0].direccion} ({sucursales[0].referencia})</p>
              <div className="d-flex gap-3">
                <span className="badge bg-dark bg-opacity-50 px-3 py-2 rounded-pill d-flex align-items-center gap-2"><Clock size={16}/> Lun - Sab: 10:00 a 20:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bloque Secundario (El Alto) */}
        <div className="col-12 col-md-6">
          <div className="tarjeta_efecto_cristal p-4 bg-white shadow-sm d-flex flex-column justify-content-between h-100" 
               style={{ borderRadius: '32px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <div>
              <div className="d-inline-flex justify-content-center align-items-center text-white mb-4" style={{ background: 'var(--naranja-grad)', width: '56px', height: '56px', borderRadius: '16px' }}>
                <MapPin size={28} />
              </div>
              <h3 className="fw-bold text-dark mb-2">{sucursales[1].ciudad}</h3>
              <p className="text-muted fs-5 mb-1">{sucursales[1].direccion}</p>
              <p className="text-muted opacity-75">{sucursales[1].referencia}</p>
            </div>
            <div className="mt-4 pt-4 border-top d-flex justify-content-between align-items-center">
              <span className="text-dark fw-medium d-flex align-items-center gap-2"><Phone size={18}/> Contactar sucursal</span>
              <span className="badge bg-light text-dark px-3 py-2 rounded-pill">Abierto</span>
            </div>
          </div>
        </div>

        {/* Bloque Terciario (Cochabamba) */}
        <div className="col-12 col-md-6">
          <div className="tarjeta_efecto_cristal p-4 bg-white shadow-sm d-flex flex-column justify-content-between h-100" 
               style={{ borderRadius: '32px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <div>
              <div className="d-inline-flex justify-content-center align-items-center text-white mb-4" style={{ background: 'var(--cafe-grad)', width: '56px', height: '56px', borderRadius: '16px' }}>
                <MapPin size={28} />
              </div>
              <h3 className="fw-bold text-dark mb-2">{sucursales[2].ciudad}</h3>
              <p className="text-muted fs-5 mb-1">{sucursales[2].direccion}</p>
              <p className="text-muted opacity-75">{sucursales[2].referencia}</p>
            </div>
            <div className="mt-4 pt-4 border-top d-flex justify-content-between align-items-center">
              <span className="text-dark fw-medium d-flex align-items-center gap-2"><Phone size={18}/> Contactar sucursal</span>
              <span className="badge bg-light text-dark px-3 py-2 rounded-pill">Abierto</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}