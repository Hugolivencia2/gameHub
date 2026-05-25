import React from 'react';
// IMPORTANTE: Añade 'Navigate' en esta importación
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './Login'; 
import Dashboard from './Dashboard';
import Principal from './Principal';
import Catalogo from './Catalogo';
import UserDashboard from './UserDashboard';
import Noticias from './Noticias';
import ArticuloCompleto from './ArticuloCompleto';
import NoticiaDetalle from './NoticiaDetalle';
import InicioMovil from './InicioMovil';
import DashboardMovil from './DashboardMovile';

// 1. TU CONMUTADOR DE RUTAS (Ajustado con tus nombres de importación)
function RutaDashboard() {
  const usuario = JSON.parse(localStorage.getItem("gamehub_user"));

  if (!usuario) {
    // Si no hay usuario, lo correcto en React Router es forzar una navegación
    return <Navigate to="/login" replace />;
  }

  if (usuario.rol === "Admin") {
    // Devuelve tu componente de administrador
    return <Dashboard />; 
  } 
  
  // Devuelve tu componente de usuario normal
  return <UserDashboard />; 
}

// 2. EL COMPONENTE APP
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Principal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/catalogo" element={<Catalogo />} />
        
        {/* LA SOLUCIÓN: Aquí es donde llamas a tu función */}
        <Route path="/dashboard" element={<RutaDashboard />} />
        
        {/* Nota: Puedes dejar esta ruta si quieres un acceso directo, pero /dashboard ya carga UserDashboard para usuarios normales */}
        <Route path="/perfil" element={<UserDashboard />} /> 
        
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/noticia-detalle" element={<NoticiaDetalle />} />
        <Route path="/articulo/:id" element={<ArticuloCompleto />} />
        <Route path="/inicio-movil" element={<InicioMovil />} />
        <Route path='/dashboard-movil' element={<DashboardMovil/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;