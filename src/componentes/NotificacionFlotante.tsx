import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';

type TipoNotificacion = 'success' | 'error' | 'warning' | 'info';

interface NotificacionFlotanteProps {
  visible: boolean;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  onClose: () => void;
  duracion?: number;
}

const estilosPorTipo: Record<
  TipoNotificacion,
  {
    colorFondo: string;
    colorBorde: string;
    colorTexto: string;
    icono: ReactNode;
  }
> = {
  success: {
    colorFondo: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
    colorBorde: '#10b981',
    colorTexto: '#065f46',
    icono: <CheckCircle2 size={24} />,
  },
  error: {
    colorFondo: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
    colorBorde: '#ef4444',
    colorTexto: '#991b1b',
    icono: <XCircle size={24} />,
  },
  warning: {
    colorFondo: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
    colorBorde: '#f97316',
    colorTexto: '#9a3412',
    icono: <AlertTriangle size={24} />,
  },
  info: {
    colorFondo: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    colorBorde: '#3b82f6',
    colorTexto: '#1e3a8a',
    icono: <Info size={24} />,
  },
};

export function NotificacionFlotante({
  visible,
  tipo,
  titulo,
  mensaje,
  onClose,
  duracion = 6500,
}: NotificacionFlotanteProps) {
  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      onClose();
    }, duracion);

    return () => clearTimeout(timer);
  }, [visible, duracion, onClose]);

  if (!visible) return null;

  const estilo = estilosPorTipo[tipo];

  return (
    <div
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 3000,
        width: 'min(460px, calc(100vw - 32px))',
        animation: 'slideInNotification 0.3s ease-out',
      }}
    >
      <div
        style={{
          background: estilo.colorFondo,
          border: `1px solid ${estilo.colorBorde}`,
          borderLeft: `7px solid ${estilo.colorBorde}`,
          borderRadius: '22px',
          boxShadow: '0 22px 55px rgba(15, 23, 42, 0.22)',
          overflow: 'hidden',
        }}
      >
        <div className="d-flex align-items-start gap-3 p-3">
          <div
            style={{
              minWidth: '46px',
              height: '46px',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.85)',
              color: estilo.colorBorde,
              boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
            }}
          >
            {estilo.icono}
          </div>

          <div className="flex-grow-1">
            <div
              className="fw-bold mb-1"
              style={{
                color: estilo.colorTexto,
                fontSize: '16px',
              }}
            >
              {titulo}
            </div>

            <div
              style={{
                color: estilo.colorTexto,
                fontSize: '14px',
                lineHeight: '1.45',
                opacity: 0.94,
              }}
            >
              {mensaje}
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-sm"
            style={{
              border: 'none',
              background: 'rgba(255,255,255,0.5)',
              color: estilo.colorTexto,
              padding: '5px',
              borderRadius: '10px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div
          style={{
            height: '5px',
            background: 'rgba(255,255,255,0.6)',
          }}
        >
          <div
            style={{
              height: '100%',
              background: estilo.colorBorde,
              animation: `notificationProgress ${duracion}ms linear forwards`,
            }}
          />
        </div>
      </div>

      <style>
        {`
          @keyframes slideInNotification {
            from {
              opacity: 0;
              transform: translateY(-14px) translateX(16px);
            }
            to {
              opacity: 1;
              transform: translateY(0) translateX(0);
            }
          }

          @keyframes notificationProgress {
            from {
              width: 100%;
            }
            to {
              width: 0%;
            }
          }
        `}
      </style>
    </div>
  );
}