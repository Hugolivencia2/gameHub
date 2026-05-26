import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "./LanguageContext.jsx"; 
import "/src/Principal.css";

// Importamos los iconos
import {
  FaHome,
  FaGamepad,
  FaNewspaper,
  FaComments,
  FaMobileAlt,
  FaUserCircle,
  FaCalendar,
  FaUser,
  FaPhone,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

function Principal() {
  const { t, idioma, setIdioma } = useLanguage();
  const navigate = useNavigate();

  // Buscamos si hay un usuario guardado en el navegador
  const stringUsuario = localStorage.getItem("usuario");
  const usuario = stringUsuario ? JSON.parse(stringUsuario) : null;

  return (
    // Refuerzo de seguridad con inline-styles para obligar al layout a ocupar el 100% del ancho
    <div className="layout" style={{ display: "flex", width: "100%", minHeight: "100vh", boxSizing: "border-box" }}>
      
      {/* --- MENÚ LATERAL (SIDEBAR) --- */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <h2>GAME-HUB</h2>
          <nav>
            <ul>
              <li className="active" onClick={() => navigate("/")}>
                <FaHome className="menu-icon" /> {t("inicio")}
              </li>
              <li onClick={() => navigate("/dashboard")}>
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
              <li onClick={() => navigate("/inicio-movil")} className="mobile-toggle-btn">
                <FaMobileAlt className="menu-icon mobile-icon" /> {t("vista_movil")}
              </li>
              <li onClick={() => navigate("/dashboard-movil")} className="mobile-toggle-btn">
                <FaMobileAlt className="menu-icon mobile-icon" /> {t("dashboard_movil")}
              </li>
              <li onClick={() => navigate("/calendario")}>
                <FaCalendar className="menu-icon" /> {t("calendario")}
              </li>
              <li onClick={() => navigate("/colaboradores")}>
                <FaUser className="menu-icon" /> {t("colaboradores")}
              </li>
              <li onClick={() => navigate("/contacto")}>
                <FaPhone className="menu-icon" /> {t("contacto")}
              </li>
            </ul>

            {/* Selector de idiomas */}
            <div className="language-switcher" style={{ display: "flex", gap: "10px", padding: "10px", marginTop: "1rem" }}>
              <button
                onClick={() => setIdioma("es")}
                style={{
                  background: idioma === "es" ? "#9146ff" : "transparent",
                  color: "white",
                  border: "1px solid #2a1f1f",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                ES
              </button>
              <button
                onClick={() => setIdioma("en")}
                style={{
                  background: idioma === "en" ? "#9146ff" : "transparent",
                  color: "white",
                  border: "1px solid #2a1f1f",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                EN
              </button>
            </div>
          </nav>
        </div>

        {/* --- BLOQUE DE USUARIO TRADUCIDO --- */}
        <div className="sidebar-bottom">
          {usuario ? (
            <div className="user-logged-in" style={{ textAlign: "center", padding: "10px", width: "100%" }}>
              <FaUserCircle size={30} style={{ color: "#9146ff", marginBottom: "5px" }} />
              <p style={{ color: "white", margin: "0 0 10px 0", fontSize: "14px" }}>
                {t("hola")}, <strong>{usuario.username}</strong>
              </p>
              <button className="text-btn" onClick={() => navigate("/dashboard")} style={{ color: "#9146ff" }}>
                {t("ir_panel")}
              </button>
            </div>
          ) : (
            <>
              <button className="text-btn" onClick={() => navigate("/registro")}>
                {t("registro")}
              </button>
              <button className="text-btn" onClick={() => navigate("/login")}>
                {t("acceder")}
              </button>
            </>
          )}
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL (Con cálculo de ancho fijo para evitar encogimiento) --- */}
      <main className="main-content" style={{ marginLeft: "250px", width: "calc(100% - 250px)", flexGrow: 1, boxSizing: "border-box" }}>
        <section className="news-grid">
          <div className="news-card">
            <div className="img-placeholder halo"></div>
            <div className="card-text">
              <p>Parece que Xbox va con pies de plomo con el tema de los juegos exclusivos...</p>
            </div>
          </div>
          <div className="news-card">
            <div className="img-placeholder gta"></div>
            <div className="card-text">
              <p>Con el lanzamiento de GTA 6 previsto para noviembre, Rockstar adelanta...</p>
            </div>
          </div>
          <div className="news-card">
            <div className="img-placeholder ps5"></div>
            <div className="card-text">
              <p>Sony ofrece una actualización sobre PS6, pero parece que tiene las mismas dudas...</p>
            </div>
          </div>
          <div className="news-card">
            <div className="img-placeholder switch"></div>
            <div className="card-text">
              <p>Nintendo Switch 2 sube de precio...</p>
            </div>
          </div>
        </section>

        {/* Banner de Prime Video */}
        <section className="hero-banner">
          <div className="banner-img">
            <h1>prime video</h1>
          </div>
          <div className="banner-text">
            <h3>
              Prime Video se viste de gala para recibir un peliculón de Oscar y
              más de 40 estrenos que te mantendrán ocupado todo el finde
            </h3>
          </div>
        </section>

        {/* Lista de Juegos Destacados */}
        <section className="featured-games">
          <h2>Juegos Destacados</h2>
          <div className="game-list">
            {[1, 2, 3].map((item) => (
              <div className="game-item" key={item}>
                <div className="game-img"></div>
                <div className="game-info">
                  <h3>Título</h3>
                  <p className="stars">Hace XXh - Descripción</p>
                  <span className="meta">Género - Autor</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Principal;