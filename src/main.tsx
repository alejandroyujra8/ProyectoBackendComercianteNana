import React from 'react'
import ReactDOM from 'react-dom/client'
import AplicacionPrincipal from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './estilos_globales.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AplicacionPrincipal />
  </React.StrictMode>,
)