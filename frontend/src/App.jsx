import React from 'react';
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
import Multimedia from './Multimedia';

function RutaDashboard() {
  const usuario = JSON.parse(localStorage.getItem("gamehub_user"));

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (usuario.rol === "Admin") {
    return <Dashboard />;
  }

  return <UserDashboard />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Principal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/dashboard" element={<RutaDashboard />} />
        <Route path="/perfil" element={<UserDashboard />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/noticia-detalle" element={<NoticiaDetalle />} />
        <Route path="/articulo/:id" element={<ArticuloCompleto />} />
        <Route path="/multimedia" element={<Multimedia />} />
        <Route path="/inicio-movil" element={<InicioMovil />} />
        <Route path="/dashboard-movil" element={<DashboardMovil />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
