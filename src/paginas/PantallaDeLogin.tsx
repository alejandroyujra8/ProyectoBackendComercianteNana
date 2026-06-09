import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { ArrowLeft, Lock, Mail, User } from 'lucide-react';
import { api } from '../servicios/api';
import { guardarSesion } from '../servicios/auth';
import { NotificacionFlotante } from '../componentes/NotificacionFlotante';

function evaluarFuerzaContrasenia(contrasenia: string) {
  const tieneMayuscula = /[A-Z]/.test(contrasenia);
  const tieneMinuscula = /[a-z]/.test(contrasenia);
  const tieneNumero = /[0-9]/.test(contrasenia);
  const tieneEspecial = /[$@#&!*.?_-]/.test(contrasenia);
  const longitudValida = contrasenia.length >= 8;

  const reglas = [
    { texto: 'Mínimo 8 caracteres', cumple: longitudValida },
    { texto: 'Mayúscula', cumple: tieneMayuscula },
    { texto: 'Minúscula', cumple: tieneMinuscula },
    { texto: 'Número', cumple: tieneNumero },
    { texto: 'Símbolo', cumple: tieneEspecial },
  ];

  if (!contrasenia) {
    return {
      texto: 'Sin evaluar',
      clase: 'bg-secondary',
      color: '#6b7280',
      progreso: 0,
      ayuda: 'Escribe una contraseña para evaluar su seguridad.',
      reglas,
    };
  }

  if (longitudValida && tieneMayuscula && tieneMinuscula && tieneNumero && tieneEspecial) {
    return {
      texto: 'Fuerte',
      clase: 'bg-success',
      color: '#198754',
      progreso: 100,
      ayuda: 'Contraseña segura.',
      reglas,
    };
  }

  if (longitudValida && tieneMayuscula && tieneMinuscula && tieneNumero) {
    return {
      texto: 'Intermedia',
      clase: 'bg-warning text-dark',
      color: '#f59e0b',
      progreso: 65,
      ayuda: 'Agrega un símbolo para hacerla fuerte.',
      reglas,
    };
  }

  return {
    texto: 'Débil',
    clase: 'bg-danger',
    color: '#dc3545',
    progreso: 30,
    ayuda: 'Debe tener mínimo 8 caracteres, mayúscula, minúscula, número y símbolo.',
    reglas,
  };
}

type TipoNotificacion = 'success' | 'error' | 'warning' | 'info';

export function PantallaDeLogin() {
  const [esRegistro, setEsRegistro] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    contrasenia: '',
  });

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const [notificacion, setNotificacion] = useState({
    visible: false,
    tipo: 'info' as TipoNotificacion,
    titulo: '',
    mensaje: '',
  });

  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const navigate = useNavigate();

  const recaptchaSiteKey =
    import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

  const fuerzaContrasenia = evaluarFuerzaContrasenia(formData.contrasenia);

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

  const limpiarCaptcha = () => {
    recaptchaRef.current?.reset();
    setCaptchaToken(null);
  };

  const cambiarModo = () => {
    setEsRegistro(!esRegistro);
    limpiarCaptcha();
    setFormData({
      nombre: '',
      apellido: '',
      correo: formData.correo,
      contrasenia: '',
    });
  };

  const manejarSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!captchaToken) {
      mostrarNotificacion(
        'warning',
        'Verificación requerida',
        'Marca el reCAPTCHA antes de continuar.',
      );
      return;
    }

    if (esRegistro && fuerzaContrasenia.texto === 'Débil') {
      mostrarNotificacion(
        'warning',
        'Contraseña débil',
        'La contraseña debe ser intermedia o fuerte para registrarte.',
      );
      return;
    }

    try {
      setCargando(true);

      if (esRegistro) {
        const respuesta = await api.post('/usuarios/registro', {
          ...formData,
          captchaToken,
        });

        mostrarNotificacion(
          'success',
          'Registro exitoso',
          respuesta.data.mensaje || 'Usuario registrado correctamente.',
        );

        setEsRegistro(false);
        setFormData({
          nombre: '',
          apellido: '',
          correo: formData.correo,
          contrasenia: '',
        });

        limpiarCaptcha();
      } else {
        const respuesta = await api.post('/usuarios/login', {
          correo: formData.correo,
          contrasenia: formData.contrasenia,
          captchaToken,
        });

        guardarSesion(respuesta.data.usuario, respuesta.data.token);

        mostrarNotificacion(
          'success',
          'Acceso concedido',
          `Bienvenido ${respuesta.data.usuario.nombre}.`,
        );

        setTimeout(() => {
          navigate(respuesta.data.usuario.rol === 'ADMIN' ? '/admin' : '/');
        }, 800);
      }
    } catch (error: any) {
      mostrarNotificacion(
        'error',
        'No se pudo continuar',
        error.response?.data?.message || 'Error al conectar con el servidor.',
      );
      limpiarCaptcha();
    } finally {
      setCargando(false);
    }
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

      <div
        className="d-flex align-items-center justify-content-center px-3 py-5"
        style={{
          minHeight: '100vh',
          background:
            'linear-gradient(135deg, #fff7ed 0%, #f8fafc 45%, #fff7ed 100%)',
        }}
      >
        <div
          className="bg-white shadow-sm"
          style={{
            width: '100%',
            maxWidth: esRegistro ? '540px' : '500px',
            borderRadius: '32px',
            border: esRegistro
              ? '1px solid rgba(249, 115, 22, 0.28)'
              : '1px solid rgba(15, 23, 42, 0.08)',
            boxShadow: esRegistro
              ? '0 24px 55px rgba(249, 115, 22, 0.16)'
              : '0 24px 55px rgba(15, 23, 42, 0.10)',
            transition: 'all 0.25s ease',
          }}
        >
          <div className="p-4 p-md-5">
            <button
              className="btn btn-light rounded-pill d-inline-flex align-items-center gap-2 mb-4"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={18} /> Volver
            </button>

            <div className="text-center mb-4">
              <img
                src="/IconoComercianteNana.png"
                alt="El Comerciante Nana"
                style={{
                  width: '70px',
                  height: '70px',
                  objectFit: 'contain',
                  borderRadius: '18px',
                  boxShadow: '0 12px 25px rgba(249, 115, 22, 0.22)',
                }}
              />

              <h2 className="fw-bold mt-3 mb-2">
                {esRegistro ? 'Crear cuenta' : 'Bienvenido'}
              </h2>

              <p className="text-muted mb-0">
                {esRegistro
                  ? 'Registra tus datos para usar el sistema.'
                  : 'Inicia sesión para continuar.'}
              </p>
            </div>

            <form onSubmit={manejarSubmit}>
              {esRegistro && (
                <>
                  <div className="input-group mb-3">
                    <span className="input-group-text bg-light border-0">
                      <User size={18} />
                    </span>
                    <input
                      required
                      className="form-control bg-light border-0 py-3"
                      placeholder="Nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    />
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text bg-light border-0">
                      <User size={18} />
                    </span>
                    <input
                      required
                      className="form-control bg-light border-0 py-3"
                      placeholder="Apellido"
                      value={formData.apellido}
                      onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    />
                  </div>
                </>
              )}

              <div className="input-group mb-3">
                <span className="input-group-text bg-light border-0">
                  <Mail size={18} />
                </span>
                <input
                  required
                  type="email"
                  className="form-control bg-light border-0 py-3"
                  placeholder="Correo"
                  value={formData.correo}
                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text bg-light border-0">
                  <Lock size={18} />
                </span>
                <input
                  required
                  type="password"
                  className="form-control bg-light border-0 py-3"
                  placeholder="Contraseña"
                  value={formData.contrasenia}
                  onChange={(e) => setFormData({ ...formData, contrasenia: e.target.value })}
                />
              </div>

              {esRegistro && (
                <div
                  className="p-3 mb-3"
                  style={{
                    borderRadius: '20px',
                    background: '#f8fafc',
                    border: '1px solid rgba(15,23,42,0.08)',
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-semibold">Seguridad de contraseña</span>
                    <span className={`badge ${fuerzaContrasenia.clase}`}>
                      {fuerzaContrasenia.texto}
                    </span>
                  </div>

                  <div className="progress mb-2" style={{ height: '9px' }}>
                    <div
                      className={`progress-bar ${fuerzaContrasenia.clase}`}
                      style={{ width: `${fuerzaContrasenia.progreso}%` }}
                    />
                  </div>

                  <p className="small mb-2" style={{ color: fuerzaContrasenia.color }}>
                    {fuerzaContrasenia.ayuda}
                  </p>

                  <div className="d-flex flex-wrap gap-2 small">
                    {fuerzaContrasenia.reglas.map((regla) => (
                      <span
                        key={regla.texto}
                        className={regla.cumple ? 'text-success fw-semibold' : 'text-muted'}
                      >
                        {regla.cumple ? '✓' : '○'} {regla.texto}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div
                className="p-3 mb-4"
                style={{
                  borderRadius: '20px',
                  background: '#ffffff',
                  border: '1px solid rgba(15,23,42,0.08)',
                }}
              >
                <div className="fw-semibold mb-2">Verificación</div>

                <div className="d-flex justify-content-center">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={recaptchaSiteKey}
                    onChange={(valor) => setCaptchaToken(valor)}
                    onExpired={() => setCaptchaToken(null)}
                    onErrored={() => {
                      setCaptchaToken(null);
                      mostrarNotificacion(
                        'error',
                        'Error en captcha',
                        'No se pudo cargar el reCAPTCHA.',
                      );
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="btn w-100 text-white fw-bold py-3"
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 14px 25px rgba(249, 115, 22, 0.25)',
                }}
              >
                {cargando ? 'Procesando...' : esRegistro ? 'Crear cuenta' : 'Ingresar'}
              </button>
            </form>

            <p
              className="text-center mt-4 mb-0 fw-medium"
              style={{ cursor: 'pointer', color: '#ea580c' }}
              onClick={cambiarModo}
            >
              {esRegistro ? '¿Ya tienes cuenta? Ingresa' : '¿No tienes cuenta? Regístrate'}
            </p>

            <div
              className="mt-4 p-3 small"
              style={{
                borderRadius: '18px',
                background: '#f8fafc',
                border: '1px solid rgba(15,23,42,0.08)',
              }}
            >
              <strong>Admin de prueba:</strong> admin@nana.com / Admin123!
            </div>
          </div>
        </div>
      </div>
    </>
  );
}