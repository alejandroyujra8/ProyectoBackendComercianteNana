export function PieDePagina() {
  return (
    <footer className="mt-5 pt-5 pb-4" style={{ background: '#FAFAFA', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
      <div className="container">
        <div className="row mb-5">
          
          <div className="col-12 col-md-6 mb-4 mb-md-0">
            <div className="d-flex align-items-center gap-3 mb-3">
              <img src="/IconoComercianteNana.png" alt="Logo" className="shadow-sm" style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '12px' }} />
              <span className="fw-bold text-dark fs-5">El Comerciante Nana</span>
            </div>
            <p className="text-muted pe-md-5" style={{ fontSize: '14px', lineHeight: '1.6' }}>
              Tu tienda especializada en juegos de mesa modernos. Descubre los mejores títulos, participa en torneos y encuentra diversión para toda la familia.
            </p>
          </div>

          <div className="col-12 col-md-6 d-flex justify-content-md-end">
            <div>
              <h6 className="fw-bold mb-3 text-dark">Nuestras Redes</h6>
              <ul className="list-unstyled d-flex flex-column gap-2">
                <li><a href="#" className="text-decoration-none text-muted" style={{ fontSize: '14px' }}>Instagram</a></li>
                <li><a href="#" className="text-decoration-none text-muted" style={{ fontSize: '14px' }}>Facebook</a></li>
                <li><a href="#" className="text-decoration-none text-muted" style={{ fontSize: '14px' }}>TikTok</a></li>
              </ul>
            </div>
          </div>
          
        </div>

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center pt-4" style={{ borderTop: '1px solid rgba(229, 231, 235, 0.5)' }}>
          <p className="text-muted mb-0" style={{ fontSize: '13px' }}>
            © 2026 Desarrollado por Alejandro Andres Yujra Paye. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}