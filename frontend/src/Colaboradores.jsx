import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "./LanguageContext.jsx";
import "/src/Colaboradores.css";

// Importamos los iconos
import {
  FaHome,
  FaGamepad,
  FaNewspaper,
  FaComments,
  FaUserCircle,
  FaTwitter,
  FaGithub,
  FaTwitch,
  FaEnvelope,
} from "react-icons/fa";
import { MdDashboard, MdPeople } from "react-icons/md";

export default function Colaboradores() {
  const navigate = useNavigate();
  const { t, idioma, setIdioma } = useLanguage();

  // Comprobamos si hay usuario logueado para la sidebar
  const stringUsuario = localStorage.getItem("usuario");
  const usuario = stringUsuario ? JSON.parse(stringUsuario) : null;

  const equipo = [
    {
      id: 1,
      nombre: "Hugo Olivencia",
      rol: "Redactor Jefe & Dev",
      especialidad: "Estrategia, RPGs y optimización de sistemas.",
      bio: "Estudiante de Ingeniería de Software. Apasionado de la tecnología, los videojuegos de estrategia y el diseño de arquitecturas limpias.",
      avatar: "linear-gradient(135deg, #9146ff, #00c851)",
      twitter: "https://twitter.com",
      github: "https://github.com",
      twitch: "https://twitch.tv",
      email: "hugo@gamehub.com"
    },
    {
      id: 2,
      nombre: "Juan García",
      rol: "Redactor Senior",
      especialidad: "Acción, shooters competitivos y hardware.",
      bio: "Analista de rendimiento de hardware y periféricos gaming. Si lleva luces RGB y va a más de 144 FPS, él lo analiza.",
      avatar: "linear-gradient(135deg, #ff4444, #ffd700)",
      twitter: "https://twitter.com",
      twitch: "https://twitch.tv",
      email: "carlos@gamehub.com"
    },
    
  ];

  return (
    <div className="layout" style={{ display: "flex", width: "100%", minHeight: "100vh", boxSizing: "border-box" }}>
      
      {/* --- MENÚ LATERAL (SIDEBAR) --- */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <h2>GAME-HUB</h2>
          <nav>
            <ul>
              <li onClick={() => navigate("/")}><FaHome className="menu-icon" /> {t("inicio")}</li>
              <li onClick={() => navigate("/dashboard")}><MdDashboard className="menu-icon" /> {t("dashboard")}</li>
              <li onClick={() => navigate("/catalogo")}><FaGamepad className="menu-icon" /> {t("catalogo")}</li>
              <li onClick={() => navigate("/noticias")}><FaNewspaper className="menu-icon" /> {t("noticias")}</li>
              <li onClick={() => navigate("/articulo/1")}><FaComments className="menu-icon" /> {t("comentarios")}</li>
              <li className="active" onClick={() => navigate("/colaboradores")}><MdPeople className="menu-icon" /> {t("equipo_menu") || "Equipo"}</li>
            </ul>
          </nav>
        </div>
        
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
              <button className="text-btn" onClick={() => navigate("/registro")}>{t("registro")}</button>
              <button className="text-btn" onClick={() => navigate("/login")}>{t("acceder")}</button>
            </>
          )}
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="main-content" style={{ marginLeft: "250px", width: "calc(100% - 250px)", flexGrow: 1, boxSizing: "border-box" }}>
        <h1 className="section-title"> Redactores y Colaboradores</h1>
        <p style={{ color: "#888", marginBottom: "2rem" }}>
           GAME-HUB.
        </p>

        <hr className="divider" />

        {/* REJILLA DE TARJETAS DE EQUIPO */}
        <section className="team-grid">
          {equipo.map((miembro) => (
            <div key={miembro.id} className="team-card">
              {/* Encabezado con degradado visual estético */}
              <div className="team-card-header" style={{ background: miembro.avatar }}>
                <div className="avatar-initials">
                  {miembro.nombre.split(" ").map(n => n[0]).join("")}
                </div>
              </div>
              
              {/* Información del miembro */}
              <div className="team-card-body">
                <h3>{miembro.nombre}</h3>
                <span className="team-role">{miembro.rol}</span>
                
                <div className="team-specialty">
                  <strong>Especialidad:</strong> {miembro.especialidad}
                </div>
                
                <p className="team-bio">{miembro.bio}</p>
                
                {/* Redes sociales y contacto */}
                <div className="team-socials">
                  {miembro.twitter && (
                    <a href={miembro.twitter} target="_blank" rel="noreferrer" title="Twitter" className="social-icon twitter">
                      <FaTwitter />
                    </a>
                  )}
                  {miembro.github && (
                    <a href={miembro.github} target="_blank" rel="noreferrer" title="GitHub" className="social-icon github">
                      <FaGithub />
                    </a>
                  )}
                  {miembro.twitch && (
                    <a href={miembro.twitch} target="_blank" rel="noreferrer" title="Twitch" className="social-icon twitch">
                      <FaTwitch />
                    </a>
                  )}
                  {miembro.email && (
                    <a href={`mailto:${miembro.email}`} title="Contacto" className="social-icon email">
                      <FaEnvelope />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}