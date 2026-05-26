import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "./LanguageContext.jsx";
import "/src/Contacto.css";

// Importamos los iconos
import {
  FaHome,
  FaGamepad,
  FaNewspaper,
  FaComments,
  FaUserCircle,
  FaEnvelope,
  FaPaperPlane,
  FaBullhorn,
  FaBug
} from "react-icons/fa";
import { MdDashboard, MdPeople } from "react-icons/md";

export default function Contacto() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Comprobamos si hay usuario logueado para la sidebar y para autocompletar el formulario
  const stringUsuario = localStorage.getItem("usuario");
  const usuario = stringUsuario ? JSON.parse(stringUsuario) : null;

  // Estados del formulario
  const [formulario, setFormulario] = useState({
    nombre: "",
    email: "",
    asunto: "sugerencia",
    mensaje: ""
  });
  const [estadoEnvio, setEstadoEnvio] = useState({ cargando: false, mensaje: "", tipo: "" });

  // Autocompletar datos si el usuario está logueado
  useEffect(() => {
    if (usuario) {
      setFormulario((prev) => ({
        ...prev,
        nombre: usuario.username || "",
        email: usuario.email || ""
      }));
    }
  }, [usuario]);

  const handleEnviarMensaje = async (e) => {
    e.preventDefault();
    setEstadoEnvio({ cargando: true, mensaje: "Enviando mensaje...", tipo: "info" });

    // Simulamos un retraso de red para que quede realista en la presentación de tu proyecto
    setTimeout(() => {
      setEstadoEnvio({ 
        cargando: false, 
        mensaje: "¡Mensaje enviado con éxito! El equipo editorial te responderá pronto.", 
        tipo: "exito" 
      });
      
      // Limpiamos el mensaje pero mantenemos el nombre/email
      setFormulario((prev) => ({ ...prev, asunto: "sugerencia", mensaje: "" }));

      // Borramos el aviso después de 4 segundos
      setTimeout(() => setEstadoEnvio({ cargando: false, mensaje: "", tipo: "" }), 4000);
    }, 1500);

    /* SI TIENES EL BACKEND PREPARADO, DESCOMENTA ESTO Y BORRA EL setTimeout DE ARRIBA:
    try {
      const respuesta = await fetch("http://localhost:8000/api/contacto/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formulario)
      });
      if (respuesta.ok) {
        setEstadoEnvio({ cargando: false, mensaje: "¡Mensaje enviado con éxito!", tipo: "exito" });
        setFormulario((prev) => ({ ...prev, mensaje: "" }));
      } else {
        setEstadoEnvio({ cargando: false, mensaje: "Error al enviar el mensaje.", tipo: "error" });
      }
    } catch (error) {
      setEstadoEnvio({ cargando: false, mensaje: "Error de conexión.", tipo: "error" });
    }
    */
  };

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
              <li onClick={() => navigate("/colaboradores")}><MdPeople className="menu-icon" /> {t("equipo_menu") || "Equipo"}</li>
              <li className="active" onClick={() => navigate("/contacto")}><FaEnvelope className="menu-icon" /> {t("contacto_menu") || "Contacto"}</li>
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
        
        <div className="contact-header">
          <h1 className="section-title">{t("contacto_titulo") || "Contacta con nosotros"}</h1>
          <p style={{ color: "#888", marginBottom: "2rem", maxWidth: "600px" }}>
            {t("contacto_subtitulo") || "¿Tienes una sugerencia, has encontrado un bug o quieres proponer una noticia? El equipo editorial de GAME-HUB está aquí para escucharte."}
          </p>
        </div>

        <div className="contact-container">
          {/* PANEL IZQUIERDO: Información */}
          <div className="contact-info-panel neon-card">
            <h3 style={{ color: "#9146ff", marginBottom: "1.5rem" }}>Canales Directos</h3>
            
            <div className="info-item">
              <div className="info-icon-circle"><FaBullhorn /></div>
              <div>
                <h4>Noticias y Notas de Prensa</h4>
                <p>redaccion@gamehub.com</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon-circle"><FaBug /></div>
              <div>
                <h4>Soporte Técnico</h4>
                <p>soporte@gamehub.com</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon-circle"><FaEnvelope /></div>
              <div>
                <h4>Contacto General</h4>
                <p>info@gamehub.com</p>
              </div>
            </div>
          </div>

          {/* PANEL DERECHO: Formulario */}
          <div className="contact-form-panel neon-card">
            <form onSubmit={handleEnviarMensaje} className="profile-form">
              <div className="form-row">
                <div className="input-group">
                  <label>Nombre o Nickname</label>
                  <input 
                    type="text" 
                    className="dark-input" 
                    placeholder="Tu nombre..." 
                    value={formulario.nombre}
                    onChange={(e) => setFormulario({...formulario, nombre: e.target.value})}
                    required 
                  />
                </div>
                <div className="input-group">
                  <label>Correo Electrónico</label>
                  <input 
                    type="email" 
                    className="dark-input" 
                    placeholder="correo@ejemplo.com" 
                    value={formulario.email}
                    onChange={(e) => setFormulario({...formulario, email: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="input-group full-width" style={{ marginTop: "1rem" }}>
                <label>Asunto del mensaje</label>
                <select 
                  className="dark-input" 
                  style={{ padding: "0 1rem" }}
                  value={formulario.asunto}
                  onChange={(e) => setFormulario({...formulario, asunto: e.target.value})}
                >
                  <option value="sugerencia">💡 Sugerencia para la web</option>
                  <option value="noticia">📰 Propuesta de Noticia / Exclusiva</option>
                  <option value="bug">🐛 Reportar un fallo técnico</option>
                  <option value="colaboracion">🤝 Solicitud de colaboración</option>
                  <option value="otro">💬 Otro motivo</option>
                </select>
              </div>

              <div className="input-group full-width" style={{ marginTop: "1rem" }}>
                <label>Tu Mensaje</label>
                <textarea 
                  className="dark-input" 
                  style={{ height: "150px", padding: "1rem", resize: "vertical", fontFamily: "inherit" }}
                  placeholder="Escribe tu mensaje con todo el detalle posible..."
                  value={formulario.mensaje}
                  onChange={(e) => setFormulario({...formulario, mensaje: e.target.value})}
                  required
                ></textarea>
              </div>

              {/* Mensaje de feedback dinámico */}
              {estadoEnvio.mensaje && (
                <div className={`status-message ${estadoEnvio.tipo}`} style={{
                  padding: "10px", 
                  borderRadius: "6px", 
                  marginTop: "1rem",
                  backgroundColor: estadoEnvio.tipo === "exito" ? "rgba(0, 200, 81, 0.1)" : estadoEnvio.tipo === "error" ? "rgba(255, 68, 68, 0.1)" : "transparent",
                  color: estadoEnvio.tipo === "exito" ? "#00C851" : estadoEnvio.tipo === "error" ? "#ff4444" : "#9146ff",
                  border: `1px solid ${estadoEnvio.tipo === "exito" ? "#00C851" : estadoEnvio.tipo === "error" ? "#ff4444" : "transparent"}`
                }}>
                  {estadoEnvio.mensaje}
                </div>
              )}

              <button 
                type="submit" 
                className="publish-btn" 
                disabled={estadoEnvio.cargando}
                style={{ 
                  marginTop: "1.5rem", 
                  backgroundColor: estadoEnvio.cargando ? "#555" : "#9146ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px"
                }}
              >
                <FaPaperPlane /> {estadoEnvio.cargando ? "Enviando..." : "Enviar Mensaje"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}