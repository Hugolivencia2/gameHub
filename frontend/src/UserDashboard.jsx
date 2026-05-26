import React, { useState, useEffect } from "react";
import "/src/Dashboard.css";
import { useNavigate } from "react-router-dom";

// Importamos los iconos necesarios
import {
  FaHome,
  FaGamepad,
  FaNewspaper,
  FaComments,
  FaSearch,
  FaPlus,
  FaDoorOpen,
  FaUserCircle,
  FaTimes,
} from "react-icons/fa";
import { MdDashboard, MdFilterList } from "react-icons/md";
import { useLanguage } from "./LanguageContext.jsx";

const API_URL = "http://localhost:8000";

export default function UserDashboard() {
  const navigate = useNavigate();
  const { t, idioma, setIdioma } = useLanguage();

  // ESTADOS PARA EL PERFIL
  const [perfilUsername, setPerfilUsername] = useState("");
  const [perfilWebsite, setPerfilWebsite] = useState("");
  const [perfilSobreMi, setPerfilSobreMi] = useState("");
  const [mensajePerfil, setMensajePerfil] = useState("");

  // ESTADOS: Control de creación de noticias
  const [creandoNoticia, setCreandoNoticia] = useState(false);
  const [mensajeNoticia, setMensajeNoticia] = useState("");
  const [formNuevaNoticia, setFormNuevaNoticia] = useState({
    titulo: "",
    contenido: "",
    imagen: "",
    estado: "publicada",
  });

  // AUTOCOMPLETADO DE PERFIL
  useEffect(() => {
    const stringUsuario = localStorage.getItem("usuario");
    const usuarioGuardado = stringUsuario ? JSON.parse(stringUsuario) : null;

    if (usuarioGuardado) {
      setPerfilUsername(usuarioGuardado.username || "");
      setPerfilWebsite(usuarioGuardado.website || "");
      setPerfilSobreMi(usuarioGuardado.sobre_mi || "");
    }
  }, []);

  // FUNCIÓN PARA GUARDAR LOS CAMBIOS DEL PERFIL
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMensajePerfil("Actualizando...");

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const respuesta = await fetch(`${API_URL}/api/usuarios/perfil`, {
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

        const stringUsuario = localStorage.getItem("usuario");
        if (stringUsuario) {
          const usuarioGuardado = JSON.parse(stringUsuario);
          usuarioGuardado.username = perfilUsername;
          usuarioGuardado.website = perfilWebsite;
          usuarioGuardado.sobre_mi = perfilSobreMi;
          localStorage.setItem("usuario", JSON.stringify(usuarioGuardado));
        }

        setTimeout(() => setMensajePerfil(""), 3000);
      } else {
        setMensajePerfil("Error al actualizar los datos.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMensajePerfil("Fallo de conexión.");
    }
  };

  // FUNCIÓN PARA ENVIAR LA NOTICIA AL BACKEND
  const handleCrearNoticia = async (e) => {
    e.preventDefault();
    setMensajeNoticia("Publicando noticia...");

    const token = localStorage.getItem("token");
    if (!token) {
      setMensajeNoticia("Error: No se encontró el token de autenticación.");
      return;
    }

    // GENERAMOS EL ID ALEATORIO (Entre 1 y 10)
    //const idAutorAleatorio = Math.floor(Math.random() * 10) + 1;
    const idAutorReal = 1;

    try {
      const respuesta = await fetch(`${API_URL}/api/noticia/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // AQUÍ ENVIAMOS EXACTAMENTE LOS DATOS QUE PIDE TU TABLA
        body: JSON.stringify({
          titulo: formNuevaNoticia.titulo,
          contenido: formNuevaNoticia.contenido,
          imagen: formNuevaNoticia.imagen,
          estado: formNuevaNoticia.estado,
          id_autor: idAutorReal, // <-- Usamos el ID fijo aquí
          id_categoria: 1,
        }),
      });

      if (respuesta.ok) {
        setMensajeNoticia("¡Noticia publicada con éxito!");
        setFormNuevaNoticia({
          titulo: "",
          contenido: "",
          imagen: "",
          estado: "publicada",
        });
        setTimeout(() => {
          setCreandoNoticia(false);
          setMensajeNoticia("");
        }, 2000);
      } else {
        const errorData = await respuesta.json();
        setMensajeNoticia(`Error: ${errorData.detail || "No se pudo crear"}`);
      }
    } catch (error) {
      console.error("Error al crear noticia:", error);
      setMensajeNoticia("Error de conexión con el servidor.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <div
      className="layout"
      style={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      {/* --- MENÚ LATERAL --- */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <h2>GAME-HUB</h2>
          <nav>
            <ul>
              <li onClick={() => navigate("/")}>
                <FaHome className="menu-icon" /> {t("inicio")}
              </li>
              <li className="active" onClick={() => navigate("/dashboard")}>
                <MdDashboard className="menu-icon" /> {t("dashboard")}
              </li>
              <li onClick={() => navigate("/catalogo")}>
                <FaGamepad className="menu-icon" /> {t("catalogo")}
              </li>
              <li onClick={() => navigate("/Noticias")}>
                <FaNewspaper className="menu-icon" /> {t("noticias")}
              </li>
              <li onClick={() => navigate("/articulo/1")}>
                <FaComments className="menu-icon" /> {t("comentarios")}
              </li>
              <li
                onClick={handleLogout}
                style={{ color: "#ff4444", marginTop: "1rem" }}
              >
                <FaDoorOpen className="menu-icon" /> {t("cerrar_sesion")}
              </li>
            </ul>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div
            className="user-logged-in"
            style={{ textAlign: "center", padding: "10px", width: "100%" }}
          >
            <FaUserCircle
              size={30}
              style={{ color: "#9146ff", marginBottom: "5px" }}
            />
            <p
              style={{ color: "white", margin: "0 0 10px 0", fontSize: "14px" }}
            >
              {t("hola")}, <strong>{perfilUsername || "Usuario"}</strong>
            </p>
          </div>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main
        className="main-content"
        style={{
          marginLeft: "250px",
          width: "calc(100% - 250px)",
          flexGrow: 1,
          boxSizing: "border-box",
        }}
      >
        {/* SECCIÓN 1: PERFIL */}
        <h1 className="section-title">Mi Perfil</h1>
        <div className="neon-card">
          <div className="card-header">
            <h3>{perfilUsername || "Nombre de usuario"}</h3>
            <p>Membresía activa</p>
          </div>
          <hr className="divider" />

          <div className="profile-body">
            <div
              className="profile-avatar-circle"
              style={{
                backgroundColor: "#2a1f1f",
                border: "2px solid #9146ff",
              }}
            ></div>
            <form className="profile-form" onSubmit={handleUpdateProfile}>
              <div className="form-row">
                <div className="input-group">
                  <label>Nombre de Usuario</label>
                  <input
                    type="text"
                    className="dark-input"
                    value={perfilUsername}
                    onChange={(e) => setPerfilUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Página Web / Red Social</label>
                  <input
                    type="text"
                    className="dark-input"
                    placeholder="https://..."
                    value={perfilWebsite}
                    onChange={(e) => setPerfilWebsite(e.target.value)}
                  />
                </div>
              </div>
              <div className="input-group full-width">
                <label>Sobre mí</label>
                <input
                  type="text"
                  className="dark-input"
                  placeholder="Escribe algo sobre ti..."
                  value={perfilSobreMi}
                  onChange={(e) => setPerfilSobreMi(e.target.value)}
                />
              </div>
              {mensajePerfil && (
                <p
                  style={{
                    color: "#00C851",
                    marginTop: "10px",
                    fontWeight: "bold",
                  }}
                >
                  {mensajePerfil}
                </p>
              )}
              <button
                type="submit"
                className="publish-btn"
                style={{ marginTop: "1rem", backgroundColor: "#9146ff" }}
              >
                Guardar Cambios
              </button>
            </form>
          </div>
        </div>

        {/* SECCIÓN 2: MIS PUBLICACIONES / NOTICIAS */}
        <h1 className="section-title">Mis Noticias</h1>

        <div className="noticias-toolbar">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar mis publicaciones..."
              className="search-input"
            />
          </div>
          <button className="sort-btn">
            Alfabeto - A a Z <MdFilterList className="sort-icon" />
          </button>
        </div>

        <hr className="divider" />

        <div className="news-grid-user">
          {!creandoNoticia ? (
            <div
              className="add-news-card"
              onClick={() => setCreandoNoticia(true)}
              style={{
                border: "2px dashed #9146ff",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem",
                borderRadius: "8px",
              }}
            >
              <div
                className="add-icon-circle"
                style={{
                  backgroundColor: "#1a1515",
                  borderRadius: "50%",
                  padding: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <FaPlus style={{ color: "#9146ff", fontSize: "1.5rem" }} />
              </div>
              <p style={{ color: "white", fontWeight: "bold" }}>
                Añadir nueva noticia
              </p>
            </div>
          ) : (
            <div
              className="neon-card"
              style={{ marginTop: "0", width: "100%" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <h3 style={{ color: "#9146ff", margin: 0 }}>
                  Nueva Publicación de Redactor
                </h3>
                <button
                  onClick={() => setCreandoNoticia(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ff4444",
                    cursor: "pointer",
                    fontSize: "1.2rem",
                  }}
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleCrearNoticia} className="profile-form">
                <div className="input-group">
                  <label>Título de la Noticia</label>
                  <input
                    type="text"
                    className="dark-input"
                    placeholder="Ej: Análisis a fondo de la nueva temporada"
                    value={formNuevaNoticia.titulo}
                    onChange={(e) =>
                      setFormNuevaNoticia({
                        ...formNuevaNoticia,
                        titulo: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label>URL de la Imagen de Portada</label>
                    <input
                      type="text"
                      className="dark-input"
                      placeholder="https://... o /assets/foto.png"
                      value={formNuevaNoticia.imagen}
                      onChange={(e) =>
                        setFormNuevaNoticia({
                          ...formNuevaNoticia,
                          imagen: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="input-group">
                    <label>Estado Inicial</label>
                    <select
                      className="dark-input"
                      style={{ padding: "0 1rem" }}
                      value={formNuevaNoticia.estado}
                      onChange={(e) =>
                        setFormNuevaNoticia({
                          ...formNuevaNoticia,
                          estado: e.target.value,
                        })
                      }
                    >
                      <option value="publicada">Publicada</option>
                      <option value="borrador">Borrador</option>
                      <option value="archivada">Archivada</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label>Cuerpo de la Noticia</label>
                  <textarea
                    className="dark-input"
                    style={{
                      height: "150px",
                      padding: "1rem",
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                    placeholder="Escribe el artículo completo aquí..."
                    value={formNuevaNoticia.contenido}
                    onChange={(e) =>
                      setFormNuevaNoticia({
                        ...formNuevaNoticia,
                        contenido: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                {mensajeNoticia && (
                  <p
                    style={{
                      color: "#9146ff",
                      fontWeight: "bold",
                      margin: "10px 0",
                    }}
                  >
                    {mensajeNoticia}
                  </p>
                )}

                <div
                  style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}
                >
                  <button
                    type="submit"
                    className="publish-btn"
                    style={{ backgroundColor: "#9146ff" }}
                  >
                    Publicar Noticia
                  </button>
                  <button
                    type="button"
                    className="publish-btn"
                    onClick={() => setCreandoNoticia(false)}
                    style={{ backgroundColor: "#333", color: "white" }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
