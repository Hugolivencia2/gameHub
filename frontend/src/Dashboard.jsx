import React, { useState, useEffect } from "react";
// Asegúrate de importar tu CSS, ya sea App.css o uno nuevo Dashboard.css
import "/src/Dashboard.css";
import { useNavigate } from "react-router-dom";

// Importamos los iconos del menú y los nuevos para las acciones del Dashboard
import {
  FaHome,
  FaGamepad,
  FaNewspaper,
  FaComments,
  FaRegStar,
  FaRegTrashAlt,
} from "react-icons/fa";
import { MdDashboard, MdOutlineModeEdit } from "react-icons/md";

export default function Dashboard() {
  const [datosUsuario, setDatosUsuario] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 1. COMPROBAMOS SI ES ADMIN
  const usuarioGuardado = JSON.parse(localStorage.getItem("usuario") || "{}");
  const esAdmin = usuarioGuardado.rol === "Administrador";

  // 2. ESTO FALTABA: Lista simulada para que React no se estrelle al pintar la tabla
  const usuarios = [
    { id: 1, nombre: "Usuario_Gamer_01" },
    { id: 2, nombre: "Alex_Hunter" },
    { id: 3, nombre: "Pro_Player99" },
  ];

 useEffect(() => {
    const token = localStorage.getItem("token");

    // 1. CORRECCIÓN: Si no hay token, te mandamos a la ruta "/login" (NO a una frase)
    if (!token) {
      navigate("/login");
      return;
    }

    const obtenerPerfil = async () => {
      try {
        const respuesta = await fetch(
          "http://localhost:8000/api/usuarios/perfil",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (respuesta.ok) {
          const data = await respuesta.json();
          
          setDatosUsuario(data);
        } else {
          const errorDelBackend = await respuesta.json();
          // 2. CORRECCIÓN: Usamos comillas invertidas (backticks) para inyectar la variable
          setError(`Python dice: ${errorDelBackend.detail}`);
          
          // Mantenemos bloqueado el navigate para que, si falla, puedas leer las letras rojas
        }
      } catch (error) {
        setError("Error de conexión con el servidor");
      }
    };

    obtenerPerfil();
  }, [navigate]); // Acuérdate de dejar 'navigate' aquí dentro
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  if (error) return <div style={{ color: "#ff4444", textAlign: "center", marginTop: "50px", fontSize: "24px" }}>🚨 {error}</div>;

  if (!datosUsuario && !error) return <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>Cargando zona VIP...</div>;

  return (
    <div className="layout">
      {/* --- MENÚ LATERAL --- */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <h2>GAME-HUB</h2>
          <nav>
            <ul>
              <li className="active" onClick={() => navigate("/")}>
                <FaHome className="menu-icon" /> Inicio
              </li>
              <li onClick={() => navigate("/dashboard")}>
                <MdDashboard className="menu-icon" /> DashBoard
              </li>
              <li onClick={() => navigate("/catalogo")}>
                <FaGamepad className="menu-icon" /> Catálogo/Ranking
              </li>
              <li onClick={() => navigate("/Noticias")}>
                <FaNewspaper className="menu-icon" /> Noticias
              </li>
              <li onClick={() => navigate("/articulo/1")}>
                <FaComments className="menu-icon" /> Comentarios
              </li>
            </ul>
          </nav>
        </div>
        <div className="sidebar-bottom">
          <button className="text-btn" onClick={handleLogout} style={{color: "#ff4444"}}>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="main-content">
        
        {/* SECCIÓN 1: PERFIL */}
        <h1 className="section-title">Profile</h1>
        <div className="neon-card">
          <div className="card-header">
            <h3>Mi Perfil</h3>
            <p>Membresía desde 2026</p>
          </div>
          <hr className="divider" />

          <div className="profile-body">
            <div className="profile-avatar-circle"></div>

            <form className="profile-form">
              <div className="form-row">
                <div className="input-group">
                  <label>Email de registro</label>
                  <p className="dark-input" style={{margin: 0, padding: "10px"}}>{datosUsuario?.email_registrado}</p>
                </div>
                <div className="input-group">
                  <label>Rol actual</label>
                  <p className="dark-input" style={{margin: 0, padding: "10px", color: "#9146ff"}}>
                    <strong>{usuarioGuardado?.rol || "Desconocido"}</strong>
                  </p>
                </div>
              </div>
              <div className="input-group full-width">
                <label>Sobre mi</label>
                <textarea 
                  className="dark-input" 
                  rows="3" 
                  defaultValue={datosUsuario?.biografia || ""} 
                  placeholder="Aún no hay biografía..."
                />
              </div>
            </form>
          </div>
        </div>

        {/* SECCIÓN 2: GESTIONAR USUARIOS (SÓLO ADMINS) */}
        {esAdmin && (
          <>
            <h1 className="section-title">Gestionar usuarios</h1>
            <div className="neon-card">
              <div className="card-header">
                <h3>Lista de usuarios</h3>
              </div>
              <hr className="divider" />

              <div className="user-list">
                {usuarios.map((user) => (
                  <div className="user-list-item" key={user.id}>
                    <div className="user-item-left">
                      <div className="avatar-small"></div>
                      <span className="user-name">{user.nombre}</span>
                    </div>

                    <div className="user-actions">
                      <button className="action-btn"><MdOutlineModeEdit /></button>
                      <div className="action-separator"></div>
                      <button className="action-btn"><FaRegStar /></button>
                      <div className="action-separator"></div>
                      <button className="action-btn delete"><FaRegTrashAlt /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}