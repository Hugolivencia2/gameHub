import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Principal from "./Principal";
import Catalogo from "./Catalogo";
import UserDashboard from "./UserDashboard";
import Noticias from "./Noticias";
import ArticuloCompleto from "./ArticuloCompleto";
import NoticiaDetalle from "./NoticiaDetalle";
import InicioMovil from "./InicioMovil";
import DashboardMovile from "./DashboardMovile";
import Registro from "./registro";
import Multimedia from "./Multimedia";
import Calendario from "./Calendario";
import Colaboradores from "./Colaboradores";
import Contacto from "./Contacto";

function RutaDashboard() {
  const stringUsuario = localStorage.getItem("usuario");
  const usuario = stringUsuario ? JSON.parse(stringUsuario) : null;

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (
    usuario.rol === "Admin" ||
    usuario.rol === "Administrador" ||
    usuario.rol === "admin"
  ) {
    // Devuelve tu componente de administrador
    return <Dashboard />;
  }

  // Devuelve tu componente de usuario normal
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
        <Route path="/dashboard-movil" element={<DashboardMovile />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/colaboradores" element={<Colaboradores />} />
        <Route path="/contacto" element={<Contacto />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
