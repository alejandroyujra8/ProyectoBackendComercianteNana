import { useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, User } from 'lucide-react';
// importo el componente de google recaptcha
import ReCAPTCHA from 'react-google-recaptcha';

export function PantallaDeLogin() {
  const [esRegistro, setEsRegistro] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', apellido: '', correo: '', contrasenia: '' });
  
  // mi estado para saber si el usuario paso la prueba del captcha
  const [captchaValido, setCaptchaValido] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const navigate = useNavigate();

  // funcion que se ejecuta cuando el usuario marca "no soy un robot"
  const manejarCaptcha = (valor: string | null) => {
    if (valor) {
      setCaptchaValido(true);
    } else {
      setCaptchaValido(false);
    }
  };

  const manejarSubmit = async (e: any) => {
    e.preventDefault();
    
    // validacion obligatoria del docente: no entra sin captcha
    if (!captchaValido) {
      alert('Por favor, verifica que no eres un robot.');
      return;
    }

    try {
      if (esRegistro) {
        await axios.post('http://localhost:3000/usuarios/registro', formData);
        alert('Registro exitoso, ahora inicia sesión');
        setEsRegistro(false);
        // limpio el captcha despues de registrar
        recaptchaRef.current?.reset();
        setCaptchaValido(false);
      } else {
        const respuesta = await axios.post('http://localhost:3000/usuarios/login', {
          correo: formData.correo,
          contrasenia: formData.contrasenia
        });
        
        localStorage.setItem('usuarioNana', JSON.stringify(respuesta.data.usuario));
        alert(`¡Bienvenido ${respuesta.data.usuario.nombre}!`);
        navigate('/'); 
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al conectar con el servidor');
      // si hay error, limpio el captcha por seguridad
      recaptchaRef.current?.reset();
      setCaptchaValido(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: '#fef3c7' }}>
      <div className="tarjeta_efecto_cristal p-5 w-100 bg-white" style={{ maxWidth: '450px', borderRadius: '40px' }}>
        <h2 className="fw-bold mb-4 text-center">{esRegistro ? 'Registrate' : 'Bienvenido'}</h2>
        
        <form onSubmit={manejarSubmit}>
          {esRegistro && (
            <>
              <input className="form-control mb-3" placeholder="Nombre" onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
              <input className="form-control mb-3" placeholder="Apellido" onChange={(e) => setFormData({...formData, apellido: e.target.value})} />
            </>
          )}
          <input className="form-control mb-3" placeholder="Correo" onChange={(e) => setFormData({...formData, correo: e.target.value})} />
          <input type="password" className="form-control mb-4" placeholder="Contraseña" onChange={(e) => setFormData({...formData, contrasenia: e.target.value})} />
          
          {/* aqui pongo el widget de google (uso una clave de prueba publica para localhost) */}
          <div className="d-flex justify-content-center mb-4">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              onChange={manejarCaptcha}
            />
          </div>
          
          <button type="submit" className="btn w-100 text-white fw-bold py-3" style={{ background: 'var(--naranja-grad)' }}>
            {esRegistro ? 'Crear Cuenta' : 'Ingresar'}
          </button>
        </form>

        <p className="text-center mt-3" style={{ cursor: 'pointer', color: 'var(--naranja-grad)' }} onClick={() => setEsRegistro(!esRegistro)}>
          {esRegistro ? '¿Ya tienes cuenta? Ingresa' : '¿No tienes cuenta? Registrate'}
        </p>
      </div>
    </div>
  );
}