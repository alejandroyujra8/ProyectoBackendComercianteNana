import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Edit, FileDown, Plus, Trash2, X, AlertTriangle } from 'lucide-react';
import type { JuegoApi } from '../tipos_de_datos';
import { api } from '../servicios/api';
import { cerrarSesion } from '../servicios/auth';
import { NotificacionFlotante } from '../componentes/NotificacionFlotante';

interface FormularioJuego {
  nombre_juego: string;
  precio: string;
  jugadores_rango: string;
  tiempo_estimado: string;
  edad_sugerida: string;
  imagen_ruta: string;
  descripcion: string;
  id_categoria: string;
}

interface EstadisticaVenta {
  nombre: string;
  ventas: number;
}

interface LogAccesoApi {
  id_log: number;
  ip: string;
  evento: string;
  browser: string;
  fecha_hora: string;
  usuario?: {
    nombre: string;
    apellido?: string;
    correo?: string;
    rol?: string;
  };
}

type TipoNotificacion = 'success' | 'error' | 'warning' | 'info';

const formularioVacio: FormularioJuego = {
  nombre_juego: '',
  precio: '',
  jugadores_rango: '2 - 4',
  tiempo_estimado: '30 min',
  edad_sugerida: '8+',
  imagen_ruta: '/imagenes/default.png',
  descripcion: '',
  id_categoria: '1',
};

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleString('es-BO', {
    dateStyle: 'short',
    timeStyle: 'medium',
  });
}

export function PantallaAdmin() {
  const [juegos, setJuegos] = useState<JuegoApi[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticaVenta[]>([]);
  const [logs, setLogs] = useState<LogAccesoApi[]>([]);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [juegoEditando, setJuegoEditando] = useState<JuegoApi | null>(null);
  const [juegoPendienteEliminar, setJuegoPendienteEliminar] = useState<JuegoApi | null>(null);

  const [formulario, setFormulario] = useState<FormularioJuego>(formularioVacio);
  const [cargando, setCargando] = useState(true);

  const [notificacion, setNotificacion] = useState({
    visible: false,
    tipo: 'info' as TipoNotificacion,
    titulo: '',
    mensaje: '',
  });

  const navigate = useNavigate();

  const mostrarNotificacion = (
    tipo: TipoNotificacion,
    titulo: string,
    mensaje: string,
  ) => {
    setNotificacion({
      visible: true,
      tipo,
      titulo,
      mensaje,
    });
  };

  const cerrarNotificacion = () => {
    setNotificacion((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  const manejarErrorSesion = (error: any) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      mostrarNotificacion(
        'warning',
        'Sesión no válida',
        'Tu sesión no tiene permiso o expiró. Inicia sesión nuevamente.',
      );

      setTimeout(() => {
        cerrarSesion();
        navigate('/login');
      }, 1200);
    }
  };

  const cargarJuegos = async () => {
    try {
      const respuesta = await api.get<JuegoApi[]>('/juegos');
      setJuegos(respuesta.data);
    } catch (error: any) {
      manejarErrorSesion(error);
      console.error('Error al cargar juegos', error);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const respuesta = await api.get<EstadisticaVenta[]>('/pedidos/estadisticas/mas-vendidos');
      setEstadisticas(respuesta.data);
    } catch (error: any) {
      manejarErrorSesion(error);
      setEstadisticas([]);
    }
  };

  const cargarLogs = async () => {
    try {
      const respuesta = await api.get<LogAccesoApi[]>('/usuarios/logs');
      setLogs(respuesta.data);
    } catch (error: any) {
      manejarErrorSesion(error);
      setLogs([]);
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      await cargarJuegos();
      await cargarEstadisticas();
      await cargarLogs();
      setCargando(false);
    };

    cargarDatos();
  }, []);

  const abrirModalCrear = () => {
    setJuegoEditando(null);
    setFormulario(formularioVacio);
    setMostrarModal(true);
  };

  const abrirModalEditar = (juego: JuegoApi) => {
    setJuegoEditando(juego);
    setFormulario({
      nombre_juego: juego.nombre_juego,
      precio: String(juego.precio),
      jugadores_rango: juego.jugadores_rango || '2 - 4',
      tiempo_estimado: juego.tiempo_estimado || '30 min',
      edad_sugerida: juego.edad_sugerida || '8+',
      imagen_ruta: juego.imagen_ruta || '/imagenes/default.png',
      descripcion: juego.descripcion || '',
      id_categoria: String(juego.id_categoria || 1),
    });
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setJuegoEditando(null);
    setFormulario(formularioVacio);
  };

  const guardarJuego = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const datos = {
      ...formulario,
      precio: Number(formulario.precio),
      id_categoria: Number(formulario.id_categoria),
    };

    try {
      if (juegoEditando) {
        await api.patch(`/juegos/${juegoEditando.id_juego}`, datos);

        mostrarNotificacion(
          'success',
          'Juego actualizado',
          'Los datos del juego fueron modificados correctamente.',
        );
      } else {
        await api.post('/juegos', datos);

        mostrarNotificacion(
          'success',
          'Juego registrado',
          'El nuevo juego fue agregado correctamente al inventario.',
        );
      }

      cerrarModal();
      await cargarJuegos();
      await cargarEstadisticas();
    } catch (error: any) {
      manejarErrorSesion(error);

      mostrarNotificacion(
        'error',
        'Error al guardar',
        error.response?.data?.message || 'No se pudo guardar el juego.',
      );
    }
  };

  const abrirConfirmacionEliminar = (juego: JuegoApi) => {
    setJuegoPendienteEliminar(juego);
  };

  const cerrarConfirmacionEliminar = () => {
    setJuegoPendienteEliminar(null);
  };

  const eliminarJuegoConfirmado = async () => {
    if (!juegoPendienteEliminar) return;

    try {
      await api.delete(`/juegos/${juegoPendienteEliminar.id_juego}`);

      mostrarNotificacion(
        'success',
        'Eliminación lógica aplicada',
        `El juego "${juegoPendienteEliminar.nombre_juego}" fue marcado como inactivo correctamente.`,
      );

      cerrarConfirmacionEliminar();
      await cargarJuegos();
      await cargarEstadisticas();
    } catch (error: any) {
      manejarErrorSesion(error);

      mostrarNotificacion(
        'error',
        'Error al eliminar',
        error.response?.data?.message || 'No se pudo aplicar la eliminación lógica.',
      );
    }
  };

  const generarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Reporte de Inventario - El Comerciante Nana', 14, 20);

    doc.setFontSize(10);
    doc.text(`Fecha de generación: ${new Date().toLocaleString('es-BO')}`, 14, 28);

    autoTable(doc, {
      startY: 36,
      head: [['ID', 'Nombre', 'Precio', 'Jugadores', 'Tiempo', 'Estado']],
      body: juegos.map((juego) => [
        juego.id_juego,
        juego.nombre_juego,
        `${juego.precio} Bs.`,
        juego.jugadores_rango,
        juego.tiempo_estimado,
        juego.activo ? 'Activo' : 'Inactivo',
      ]),
    });

    doc.save('Reporte_Inventario_Nana.pdf');

    mostrarNotificacion(
      'success',
      'Reporte generado',
      'El reporte PDF del inventario fue descargado correctamente.',
    );
  };

  return (
    <>
      <NotificacionFlotante
        visible={notificacion.visible}
        tipo={notificacion.tipo}
        titulo={notificacion.titulo}
        mensaje={notificacion.mensaje}
        onClose={cerrarNotificacion}
        duracion={7000}
      />

      {mostrarModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            background: 'rgba(15, 23, 42, 0.58)',
            backdropFilter: 'blur(8px)',
            zIndex: 1050,
          }}
        >
          <div
            className="bg-white p-4 shadow"
            style={{
              width: '100%',
              maxWidth: '590px',
              borderRadius: '34px',
              border: '1px solid rgba(255,255,255,0.8)',
              boxShadow: '0 30px 70px rgba(15, 23, 42, 0.28)',
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold mb-1">
                  {juegoEditando ? 'Editar Juego' : 'Nuevo Juego'}
                </h5>
                <p className="text-muted small mb-0">
                  Completa los campos del juego para guardarlo en PostgreSQL.
                </p>
              </div>

              <button onClick={cerrarModal} className="btn btn-sm btn-light rounded-circle">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={guardarJuego}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-bold small">Nombre del juego</label>
                  <input
                    required
                    minLength={3}
                    className="form-control"
                    value={formulario.nombre_juego}
                    onChange={(e) => setFormulario({ ...formulario, nombre_juego: e.target.value })}
                  />
                </div>

                <div className="col-6">
                  <label className="form-label fw-bold small">Precio Bs.</label>
                  <input
                    required
                    type="number"
                    min="1"
                    className="form-control"
                    value={formulario.precio}
                    onChange={(e) => setFormulario({ ...formulario, precio: e.target.value })}
                  />
                </div>

                <div className="col-6">
                  <label className="form-label fw-bold small">Categoría</label>
                  <select
                    className="form-select"
                    value={formulario.id_categoria}
                    onChange={(e) => setFormulario({ ...formulario, id_categoria: e.target.value })}
                  >
                    <option value="1">Party Games</option>
                    <option value="2">Estrategia</option>
                    <option value="3">Familiares</option>
                    <option value="4">Cartas</option>
                  </select>
                </div>

                <div className="col-4">
                  <label className="form-label fw-bold small">Jugadores</label>
                  <input
                    required
                    className="form-control"
                    value={formulario.jugadores_rango}
                    onChange={(e) =>
                      setFormulario({ ...formulario, jugadores_rango: e.target.value })
                    }
                  />
                </div>

                <div className="col-4">
                  <label className="form-label fw-bold small">Tiempo</label>
                  <input
                    required
                    className="form-control"
                    value={formulario.tiempo_estimado}
                    onChange={(e) =>
                      setFormulario({ ...formulario, tiempo_estimado: e.target.value })
                    }
                  />
                </div>

                <div className="col-4">
                  <label className="form-label fw-bold small">Edad</label>
                  <input
                    required
                    className="form-control"
                    value={formulario.edad_sugerida}
                    onChange={(e) =>
                      setFormulario({ ...formulario, edad_sugerida: e.target.value })
                    }
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-bold small">Ruta de imagen</label>
                  <input
                    required
                    className="form-control"
                    value={formulario.imagen_ruta}
                    onChange={(e) => setFormulario({ ...formulario, imagen_ruta: e.target.value })}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-bold small">Descripción</label>
                  <textarea
                    required
                    className="form-control"
                    rows={3}
                    value={formulario.descripcion}
                    onChange={(e) => setFormulario({ ...formulario, descripcion: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn w-100 text-white fw-bold mt-4 py-3"
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                  borderRadius: '16px',
                  boxShadow: '0 14px 28px rgba(249, 115, 22, 0.25)',
                  border: 'none',
                }}
              >
                {juegoEditando ? 'Guardar Cambios' : 'Guardar Juego'}
              </button>
            </form>
          </div>
        </div>
      )}

      {juegoPendienteEliminar && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            background: 'rgba(15, 23, 42, 0.58)',
            backdropFilter: 'blur(8px)',
            zIndex: 1060,
          }}
        >
          <div
            className="bg-white p-4 text-center shadow"
            style={{
              width: 'min(460px, calc(100vw - 32px))',
              borderRadius: '30px',
              border: '1px solid rgba(255,255,255,0.8)',
              boxShadow: '0 30px 70px rgba(15, 23, 42, 0.28)',
            }}
          >
            <div
              className="mx-auto mb-3 d-flex align-items-center justify-content-center"
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '22px',
                background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
                color: '#ea580c',
              }}
            >
              <AlertTriangle size={36} />
            </div>

            <h4 className="fw-bold mb-2">Confirmar eliminación lógica</h4>

            <p className="text-muted mb-1">
              El juego no será borrado físicamente de la base de datos.
            </p>

            <p className="fw-bold mb-4">
              {juegoPendienteEliminar.nombre_juego}
            </p>

            <div className="d-flex justify-content-center gap-2">
              <button
                onClick={cerrarConfirmacionEliminar}
                className="btn btn-light rounded-pill px-4 py-2"
              >
                Cancelar
              </button>

              <button
                onClick={eliminarJuegoConfirmado}
                className="btn btn-danger rounded-pill px-4 py-2"
              >
                Confirmar eliminación
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          minHeight: '100vh',
          background:
            'radial-gradient(circle at top left, rgba(249,115,22,0.08), transparent 28%), radial-gradient(circle at bottom right, rgba(245,158,11,0.08), transparent 32%), #f8fafc',
        }}
      >
        <div className="container py-5" style={{ position: 'relative' }}>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
            <div>
              <h2 className="fw-bold mb-1">Panel de Control Administrador</h2>
              <p className="text-muted mb-0">
                Gestión real conectada al backend NestJS y PostgreSQL.
              </p>
            </div>

            <button
              onClick={generarPDF}
              className="btn text-white d-flex align-items-center gap-2 px-4 py-3"
              style={{
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                borderRadius: '18px',
                boxShadow: '0 15px 30px rgba(249, 115, 22, 0.25)',
                border: 'none',
              }}
            >
              <FileDown size={20} /> Descargar Reporte PDF
            </button>
          </div>

          {cargando ? (
            <div className="text-center py-5 text-muted">Cargando panel...</div>
          ) : (
            <>
              <div className="row g-4">
                <div className="col-12 col-lg-4">
                  <div
                    className="p-4 bg-white shadow-sm"
                    style={{
                      borderRadius: '26px',
                      border: '1px solid rgba(15,23,42,0.06)',
                    }}
                  >
                    <h5 className="fw-bold mb-4">Juegos Más Vendidos</h5>

                    {estadisticas.length === 0 ? (
                      <div className="text-muted small py-5 text-center">
                        Todavía no hay compras registradas para mostrar estadísticas.
                      </div>
                    ) : (
                      <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer>
                          <BarChart data={estadisticas}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="nombre" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="ventas" fill="#f97316" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-12 col-lg-8">
                  <div
                    className="p-4 bg-white shadow-sm"
                    style={{
                      borderRadius: '26px',
                      border: '1px solid rgba(15,23,42,0.06)',
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <h5 className="fw-bold mb-1">Gestión de Juegos</h5>
                        <p className="text-muted small mb-0">
                          CRUD con eliminación lógica.
                        </p>
                      </div>

                      <button
                        onClick={abrirModalCrear}
                        className="btn btn-dark d-flex align-items-center gap-2 rounded-pill px-3"
                      >
                        <Plus size={18} /> Adicionar Juego
                      </button>
                    </div>

                    <div className="table-responsive">
                      <table className="table align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Juego</th>
                            <th>Precio</th>
                            <th>Jugadores</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>

                        <tbody>
                          {juegos.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="text-center text-muted py-4">
                                No hay juegos registrados.
                              </td>
                            </tr>
                          ) : (
                            juegos.map((juego) => (
                              <tr key={juego.id_juego}>
                                <td>{juego.nombre_juego}</td>
                                <td>{juego.precio} Bs.</td>
                                <td>{juego.jugadores_rango}</td>
                                <td>
                                  <span
                                    className={`badge ${
                                      juego.activo ? 'bg-success' : 'bg-danger'
                                    }`}
                                  >
                                    {juego.activo ? 'Activo' : 'Inactivo'}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    onClick={() => abrirModalEditar(juego)}
                                    className="btn btn-sm btn-outline-primary me-2"
                                  >
                                    <Edit size={16} />
                                  </button>

                                  <button
                                    onClick={() => abrirConfirmacionEliminar(juego)}
                                    className="btn btn-sm btn-outline-danger"
                                  >
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

              <div
                className="p-4 bg-white shadow-sm mt-4"
                style={{
                  borderRadius: '26px',
                  border: '1px solid rgba(15,23,42,0.06)',
                }}
              >
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2">
                  <div>
                    <h5 className="fw-bold mb-1">Logs de Acceso</h5>
                    <p className="text-muted small mb-0">
                      Registro de ingreso y salida de usuarios: usuario, IP, evento, navegador,
                      fecha y hora.
                    </p>
                  </div>

                  <button onClick={cargarLogs} className="btn btn-outline-dark rounded-pill px-3">
                    Actualizar logs
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Usuario</th>
                        <th>Correo</th>
                        <th>IP</th>
                        <th>Evento</th>
                        <th>Browser</th>
                        <th>Fecha y hora</th>
                      </tr>
                    </thead>

                    <tbody>
                      {logs.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center text-muted py-4">
                            Todavía no hay logs registrados.
                          </td>
                        </tr>
                      ) : (
                        logs.map((log) => (
                          <tr key={log.id_log}>
                            <td>
                              {log.usuario
                                ? `${log.usuario.nombre} ${log.usuario.apellido || ''}`
                                : 'Usuario no encontrado'}
                            </td>

                            <td>{log.usuario?.correo || 'Sin correo'}</td>
                            <td>{log.ip}</td>

                            <td>
                              <span
                                className={`badge ${
                                  log.evento === 'ingreso' ? 'bg-success' : 'bg-danger'
                                }`}
                              >
                                {log.evento}
                              </span>
                            </td>

                            <td style={{ maxWidth: '260px' }}>
                              <span
                                className="d-inline-block text-truncate"
                                style={{ maxWidth: '260px' }}
                              >
                                {log.browser}
                              </span>
                            </td>

                            <td>{formatearFecha(log.fecha_hora)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}