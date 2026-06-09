import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { JuegoDeMesa } from '../tipos_de_datos';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { api } from '../servicios/api';
import { obtenerUsuario } from '../servicios/auth';

export interface ItemCarrito extends JuegoDeMesa {
  cantidad: number;
}

interface TipoCarritoContext {
  carrito: ItemCarrito[];
  agregarAlCarrito: (juego: JuegoDeMesa) => void;
  eliminarDelCarrito: (id: string) => void;
  cambiarCantidad: (id: string, cantidad: number) => void;
  cantidadTotal: number;
  precioTotal: number;
  abrirCarrito: () => void;
}

const CarritoContext = createContext<TipoCarritoContext | undefined>(undefined);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [estaAbierto, setEstaAbierto] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const navigate = useNavigate();

  const agregarAlCarrito = (juego: JuegoDeMesa) => {
    setCarrito((actual) => {
      const existe = actual.find((item) => item.id === juego.id);
      if (existe) {
        return actual.map((item) => (item.id === juego.id ? { ...item, cantidad: item.cantidad + 1 } : item));
      }
      return [...actual, { ...juego, cantidad: 1 }];
    });
  };

  const eliminarDelCarrito = (id: string) => {
    setCarrito((actual) => actual.filter((item) => item.id !== id));
  };

  const cambiarCantidad = (id: string, cantidad: number) => {
    if (cantidad < 1) return;
    setCarrito((actual) => actual.map((item) => (item.id === id ? { ...item, cantidad } : item)));
  };

  const procesarPago = async () => {
    const usuario = obtenerUsuario();

    if (!usuario) {
      alert('Primero debes iniciar sesión para finalizar la compra.');
      setEstaAbierto(false);
      navigate('/login');
      return;
    }

    try {
      setProcesando(true);
      const respuesta = await api.post('/pedidos/comprar', {
        carrito: carrito.map((item) => ({
          id_juego: item.id_juego || Number(item.id),
          cantidad: item.cantidad,
        })),
      });

      const datosPedido = {
        numeroOrden: respuesta.data.numero_orden,
        totalPagado: respuesta.data.total_pagado,
      };

      localStorage.setItem('ultimoPedidoNana', JSON.stringify(datosPedido));

      setCarrito([]);
      setEstaAbierto(false);
      navigate('/exito', { state: datosPedido });
    } catch (error: any) {
      alert(error.response?.data?.message || 'No se pudo completar la compra.');
    } finally {
      setProcesando(false);
    }
  };

  const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);
  const precioTotal = carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
  const abrirCarrito = () => setEstaAbierto(true);
  const cerrarCarrito = () => setEstaAbierto(false);

  return (
    <CarritoContext.Provider value={{ carrito, agregarAlCarrito, eliminarDelCarrito, cambiarCantidad, cantidadTotal, precioTotal, abrirCarrito }}>
      {children}

      {estaAbierto && (
        <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 9999, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <div className="position-absolute w-100 h-100" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} onClick={cerrarCarrito}></div>

          <div className="bg-white position-relative d-flex flex-column shadow-lg" style={{ width: '100%', maxWidth: '420px', height: '94vh', marginRight: '2vh', borderRadius: '32px', animation: 'slideIn 0.3s ease-out' }}>
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
              <h4 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
                <ShoppingBag size={24} style={{ color: 'var(--naranja-grad)' }} /> Tu Pedido
              </h4>
              <button className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm" onClick={cerrarCarrito}>
                <X size={20} />
              </button>
            </div>

            <div className="flex-grow-1 overflow-auto p-4 d-flex flex-column gap-3">
              {carrito.length === 0 ? (
                <div className="text-center text-muted my-auto">
                  <ShoppingBag size={48} className="mb-3 opacity-25" />
                  <h5>Tu carrito está vacío</h5>
                  <p className="small">¡Agrega algunos juegos para que empiece la diversión!</p>
                </div>
              ) : (
                carrito.map((item) => (
                  <div key={item.id} className="d-flex gap-3 p-3 bg-light" style={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <img src={item.imagen} alt={item.nombre} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '12px' }} />
                    <div className="flex-grow-1 d-flex flex-column justify-content-between">
                      <div className="d-flex justify-content-between">
                        <h6 className="fw-bold mb-0 text-dark text-truncate" style={{ maxWidth: '160px' }}>{item.nombre}</h6>
                        <button className="btn p-0 text-danger" onClick={() => eliminarDelCarrito(item.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <span className="fw-bold" style={{ color: 'var(--cafe-grad)' }}>Bs. {item.precio * item.cantidad}</span>
                        <div className="d-flex align-items-center bg-white rounded-pill shadow-sm" style={{ padding: '2px 6px' }}>
                          <button className="btn btn-sm p-1" onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}><Minus size={14} /></button>
                          <span className="fw-medium px-2" style={{ fontSize: '14px' }}>{item.cantidad}</span>
                          <button className="btn btn-sm p-1" onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}><Plus size={14} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {carrito.length > 0 && (
              <div className="p-4 bg-light mt-auto" style={{ borderBottomLeftRadius: '32px', borderBottomRightRadius: '32px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="text-muted fw-medium">Total a pagar:</span>
                  <span className="fw-bold fs-4 text-dark">Bs. {precioTotal}</span>
                </div>
                <button
                  className="btn w-100 text-white fw-bold py-3 d-flex justify-content-center align-items-center gap-2 shadow-sm"
                  style={{ background: 'var(--naranja-grad)', borderRadius: '20px' }}
                  onClick={procesarPago}
                  disabled={procesando}
                >
                  {procesando ? 'Procesando...' : 'Finalizar Compra'} <ArrowRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const contexto = useContext(CarritoContext);
  if (!contexto) {
    throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  }
  return contexto;
}
