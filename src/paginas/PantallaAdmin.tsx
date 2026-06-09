import { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { FileDown, Plus, Trash2, Edit, X } from 'lucide-react';

export function PantallaAdmin() {
  const [juegos, setJuegos] = useState<any[]>([]);
  
  // Estados para mi nueva ventana modal
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoJuego, setNuevoJuego] = useState({
    nombre_juego: '',
    precio: '',
    jugadores_rango: '2 - 4',
    tiempo_estimado: '30 min',
    edad_sugerida: '8+',
    imagen_ruta: '/imagenes/default.png',
    id_categoria: 1 // Usamos la categoria que acabamos de crear en pgAdmin
  });

  const cargarJuegos = async () => {
    try {
      const respuesta = await axios.get('http://localhost:3000/juegos');
      setJuegos(respuesta.data);
    } catch (error) {
      console.error('Error al cargar los juegos', error);
    }
  };

  useEffect(() => {
    cargarJuegos();
  }, []);

  // Funcion para guardar el juego en la base de datos
  const guardarJuego = async (e: any) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/juegos', nuevoJuego);
      alert('¡Juego registrado con éxito!');
      setMostrarModal(false); // Cierro la ventana
      cargarJuegos(); // Recargo la tabla para ver el nuevo juego
      
      // Limpio el formulario
      setNuevoJuego({ ...nuevoJuego, nombre_juego: '', precio: '' });
    } catch (error) {
      alert('Error al guardar el juego.');
    }
  };

  const eliminarJuego = async (id_juego: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este juego?')) {
      try {
        await axios.delete(`http://localhost:3000/juegos/${id_juego}`);
        alert('Juego eliminado exitosamente (Eliminación Lógica)');
        cargarJuegos();
      } catch (error) {
        alert('Hubo un error al eliminar el juego');
      }
    }
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.text('Reporte de Inventario - El Comerciante Nana', 14, 20);
    
    autoTable(doc, {
      startY: 30,
      head: [['ID', 'Nombre', 'Precio', 'Estado']],
      body: juegos.map(juego => [
        juego.id_juego, 
        juego.nombre_juego, 
        `${juego.precio} Bs.`, 
        juego.activo ? 'Disponible' : 'Eliminado'
      ]),
    });
    doc.save('Reporte_Inventario_Nana.pdf');
  };

  // Datos simulados para el grafico (luego se pueden conectar a Pedidos reales)
  const datosEstadisticos = [
    { nombre: 'Catan', ventas: 45 },
    { nombre: 'Monopoly', ventas: 30 },
    { nombre: 'Dixit', ventas: 55 },
    { nombre: 'Risk', ventas: 20 },
  ];

  return (
    <div className="container py-5" style={{ minHeight: '100vh', position: 'relative' }}>
      
      {/* VENTANA MODAL FLOTANTE */}
      {mostrarModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="bg-white p-4 rounded-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
            <div className="d-flex justify-content-between mb-3">
              <h5 className="fw-bold">Nuevo Juego</h5>
              <button onClick={() => setMostrarModal(false)} className="btn btn-sm btn-light rounded-circle"><X size={18} /></button>
            </div>
            
            <form onSubmit={guardarJuego}>
              <input required className="form-control mb-3" placeholder="Nombre del Juego (Ej: Catan)" value={nuevoJuego.nombre_juego} onChange={(e) => setNuevoJuego({...nuevoJuego, nombre_juego: e.target.value})} />
              <input required type="number" className="form-control mb-3" placeholder="Precio (Bs.)" value={nuevoJuego.precio} onChange={(e) => setNuevoJuego({...nuevoJuego, precio: e.target.value})} />
              <button type="submit" className="btn w-100 text-white fw-bold" style={{ background: 'var(--naranja-grad)' }}>Guardar Juego</button>
            </form>
          </div>
        </div>
      )}

      {/* RESTO DE TU PANEL */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="fw-bold">Panel de Control Administrador</h2>
        <button onClick={generarPDF} className="btn text-white d-flex align-items-center gap-2" style={{ background: 'var(--naranja-grad)' }}>
          <FileDown size={20} /> Descargar Reporte PDF
        </button>
      </div>

      <div className="row g-4">
        {/* SECCION GRAFICO */}
        <div className="col-12 col-lg-4">
          <div className="tarjeta_efecto_cristal p-4 bg-white shadow-sm" style={{ borderRadius: '20px' }}>
            <h5 className="fw-bold mb-4">Juegos Más Vendidos</h5>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer>
                <BarChart data={datosEstadisticos}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nombre" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="ventas" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* SECCION TABLA CRUD */}
        <div className="col-12 col-lg-8">
          <div className="tarjeta_efecto_cristal p-4 bg-white shadow-sm" style={{ borderRadius: '20px' }}>
            <div className="d-flex justify-content-between mb-4">
              <h5 className="fw-bold">Gestión de Juegos (CRUD)</h5>
              <button onClick={() => setMostrarModal(true)} className="btn btn-dark d-flex align-items-center gap-2 rounded-pill px-3">
                <Plus size={18} /> Adicionar Juego
              </button>
            </div>

            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Juego</th>
                    <th>Precio</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {juegos.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-4">No hay juegos registrados. ¡Agrega uno!</td>
                    </tr>
                  ) : (
                    juegos.map((juego) => (
                      <tr key={juego.id_juego}>
                        <td>{juego.nombre_juego}</td>
                        <td>{juego.precio} Bs.</td>
                        <td>
                          <span className={`badge ${juego.activo ? 'bg-success' : 'bg-danger'}`}>
                            {juego.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-2"><Edit size={16} /></button>
                          <button onClick={() => eliminarJuego(juego.id_juego)} className="btn btn-sm btn-outline-danger">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}