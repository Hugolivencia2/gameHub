import React, { useState, useEffect } from "react"; // IMPORTANTE: Añadidos useState y useEffect
import "/src/Dashboard.css";
import { useNavigate } from "react-router-dom";

// Importamos los iconos
import {
  FaHome,
  FaGamepad,
  FaNewspaper,
  FaComments,
  FaSearch,
  FaPlus,
  FaExclamationTriangle,
  FaDoorOpen
} from "react-icons/fa";
import { MdDashboard, MdFilterList } from "react-icons/md";

export default function UserDashboard() {
  const navigate = useNavigate();

  // 1. ESTADOS PARA EL PERFIL
  const [perfilUsername, setPerfilUsername] = useState("");
  const [perfilWebsite, setPerfilWebsite] = useState("");
  const [perfilSobreMi, setPerfilSobreMi] = useState("");
  const [mensajePerfil, setMensajePerfil] = useState("");

  // 2. AUTOCOMPLETADO (Se ejecuta al entrar a la página)
  useEffect(() => {
    const usuarioGuardado = JSON.parse(localStorage.getItem("gamehub_user"));
    if (usuarioGuardado) {
      setPerfilUsername(usuarioGuardado.username || "");
      setPerfilWebsite(usuarioGuardado.website || "");
      setPerfilSobreMi(usuarioGuardado.sobre_mi || "");
    }
  }, []);

  // 3. FUNCIÓN PARA GUARDAR LOS CAMBIOS DEL PERFIL
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMensajePerfil("Actualizando...");

    const token = localStorage.getItem("gamehub_token");
    if (!token) return;

    try {
      const respuesta = await fetch("http://localhost:8000/api/usuarios/perfil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({
          username: perfilUsername,
          website: perfilWebsite,
          sobre_mi: perfilSobreMi,
        }),
      });

      if (respuesta.ok) {
        setMensajePerfil("¡Perfil actualizado con éxito!");
        setTimeout(() => setMensajePerfil(""), 3000);
      } else {
        setMensajePerfil("Error al actualizar los datos.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMensajePerfil("Fallo de conexión.");
    }
  };

  // 4. FUNCIÓN PARA CERRAR SESIÓN
  const handleLogout = () => {
    localStorage.removeItem("gamehub_token");
    localStorage.removeItem("gamehub_user");
    navigate("/login");
  };

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

              {/* BOTÓN DE CERRAR SESIÓN AÑADIDO AQUÍ */}
              <li onClick={handleLogout} className="menu-icon" style={{ color: "#ff4444"}}>
                <FaDoorOpen className="menu-icon" />Cerrar Sesión
              </li>
            </ul>
          </nav>
        </div>
        {/* Usuario logueado (Abajo a la izquierda) */}
        <div className="sidebar-user">
          <div className="user-info">
            <div className="avatar-square"></div>
            {/* Hacemos que el nombre coincida con el estado */}
            <span>{perfilUsername || "Usuario"}</span> 
          </div>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="main-content">
        {/* SECCIÓN 1: PERFIL */}
        <h1 className="section-title">Profile</h1>
        <div className="neon-card">
          <div className="card-header">
            <h3>{perfilUsername || "Nombre de usuario"}</h3>
            <p>Membresía desde 2026</p>
          </div>
          <hr className="divider" />

          <div className="profile-body">
            <div className="profile-avatar-circle"></div>

            {/* FORMULARIO CONECTADO A LOS ESTADOS */}
            <form className="profile-form" onSubmit={handleUpdateProfile}>
              <div className="form-row">
                <div className="input-group">
                  <label>Nombre</label>
                  <input 
                    type="text" 
                    className="dark-input" 
                    value={perfilUsername}
                    onChange={(e) => setPerfilUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Website</label>
                  <input 
                    type="text" 
                    className="dark-input" 
                    value={perfilWebsite}
                    onChange={(e) => setPerfilWebsite(e.target.value)}
                  />
                </div>
              </div>
              <div className="input-group full-width">
                <label>Sobre mi</label>
                <input 
                  type="text" 
                  className="dark-input" 
                  value={perfilSobreMi}
                  onChange={(e) => setPerfilSobreMi(e.target.value)}
                />
              </div>

              {mensajePerfil && <p style={{ color: "#9146ff", marginTop: "10px" }}>{mensajePerfil}</p>}

              <button type="submit" className="publish-btn" style={{ marginTop: "1rem" }}>
                Guardar Cambios
              </button>
            </form>
          </div>
        </div>

        {/* SECCIÓN 2: NOTICIAS DEL USUARIO (Se queda igual) */}
        <h1 className="section-title">Noticias</h1>

        <div className="noticias-toolbar">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar..."
              className="search-input"
            />
          </div>

          <button className="sort-btn">
            Alfabeto - A a Z <MdFilterList className="sort-icon" />
          </button>
        </div>

        <hr className="divider" />

        <div className="news-grid-user">
          <div className="add-news-card">
            <div className="add-icon-circle">
              <FaPlus />
            </div>
            <p>Añade una noticia</p>
          </div>
        </div>
      </main>
    </div>
  );
}