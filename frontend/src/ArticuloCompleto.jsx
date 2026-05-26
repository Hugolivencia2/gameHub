import React, { useState, useEffect } from "react";
import "/src/ArticuloCompleto.css";
import { useNavigate, useParams, Link } from "react-router-dom";

// Iconos
import {
  FaHome,
  FaGamepad,
  FaNewspaper,
  FaComments,
  FaRegBell,
  FaUser,
  FaCalendarAlt,
  FaCommentDots,
  FaReply,
  FaStar, // Añadido para el icono de suscriptor
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

export default function ArticuloCompleto() {
  const navigate = useNavigate();

  // 1. OBTENER EL ID DE LA NOTICIA
  const { id } = useParams();

  // 2. ESTADOS REACTIVOS
  const [comentarios, setComentarios] = useState([]);
  const [nuevoTexto, setNuevoTexto] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Controla si el vídeo debe mostrarse o no
  const [reproduciendoVideo, setReproduciendoVideo] = useState(false);

  // Comprobar si hay usuario logueado en el almacenamiento local
  const usuarioLogueado = JSON.parse(localStorage.getItem("usuario"));

  // 3. CARGAR LOS COMENTARIOS DEL BACKEND AL ENTRAR
  useEffect(() => {
    const cargarComentarios = async () => {
      try {
        const respuesta = await fetch(
          `http://localhost:8000/api/comentarios/${id}`,
        );
        if (respuesta.ok) {
          const datos = await respuesta.json();
          const comentariosFormateados = datos.map((c) => ({
            id: c.id,
            autor: c.autor,
            tiempo: c.fecha,
            texto: c.texto,
            respuestas: [],
          }));
          setComentarios(comentariosFormateados);
        }
      } catch (error) {
        console.error("Error al cargar comentarios:", error);
      }
    };

    if (id) {
      cargarComentarios();
    }
  }, [id]);

  // 4. FUNCIÓN PARA ENVIAR UN NUEVO COMENTARIO
  const handleEnviarComentario = async (e) => {
    e.preventDefault();
    setMensaje("Enviando...");

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const respuesta = await fetch("http://localhost:8000/api/comentarios/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          articulo_id: parseInt(id),
          texto: nuevoTexto,
        }),
      });

      if (respuesta.ok) {
        const datos = await respuesta.json();
        const nuevoComentarioFormateado = {
          id: datos.comentario.id,
          autor: datos.comentario.autor,
          tiempo: "Justo ahora",
          texto: datos.comentario.texto,
          respuestas: [],
        };

        setComentarios([...comentarios, nuevoComentarioFormateado]);
        setNuevoTexto("");
        setMensaje("¡Comentario publicado!");
        setTimeout(() => setMensaje(""), 3000);
      } else {
        setMensaje("Error al publicar el comentario.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje("Error de conexión.");
    }
  };

  return (
    <div className="layout">
      {/* --- SIDEBAR --- */}
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
        <div className="sidebar-user">
          <div className="user-info">
            <div className="avatar-square"></div>
            <span>
              {usuarioLogueado ? usuarioLogueado.username : "Invitado"}
            </span>
          </div>
          <FaRegBell className="bell-icon" />
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="main-content">
        <header className="article-header">
          <h1 className="article-main-title">
            Prime Video se viste de gala para recibir un peliculón de Oscar y
            más de 40 estrenos que te mantendrán ocupado todo el finde
          </h1>

          {/* REPRODUCTOR DE VÍDEO */}
          <div
            className="article-hero-img"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            {!reproduciendoVideo ? (
              <div
                className="play-button-overlay"
                onClick={() => setReproduciendoVideo(true)}
                style={{ cursor: "pointer", zIndex: 2 }}
                title="Reproducir vídeo"
              >
                ▶
              </div>
            ) : (
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/QdBZY2fkU-0?autoplay=1"
                title="Trailer del Artículo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: "100%", height: "100%", minHeight: "450px" }}
              ></iframe>
            )}
          </div>

          <div className="article-meta-bar">
            <div className="meta-item">
              <FaUser className="meta-icon" /> <span>Por: Redacción</span>
            </div>
            <div className="meta-item">
              <FaCalendarAlt className="meta-icon" />{" "}
              <span>Actualizado: 25/05/2026</span>
            </div>
            <div className="meta-item">
              <FaCommentDots className="meta-icon" />{" "}
              <span>{comentarios.length} Comentarios</span>
            </div>
          </div>
        </header>

        <section className="article-body">
          <p>
            Lorem ipsum es simplemente el texto de relleno de las imprentas y
            archivos de texto...
          </p>
        </section>

        {/* =========================================
           SECCIÓN DE COMENTARIOS 
        ========================================= */}
        <section className="comments-section">
          <h2 className="comments-count">
            Comentarios{" "}
            <span>
              {comentarios.length < 10
                ? `0${comentarios.length}`
                : comentarios.length}{" "}
              comentarios
            </span>
          </h2>
          <hr className="divider" />

          {/* LISTA DINÁMICA DE COMENTARIOS */}
          <div className="comments-list">
            {comentarios.length === 0 ? (
              <p
                style={{
                  color: "#888",
                  fontStyle: "italic",
                  marginBottom: "2rem",
                }}
              >
                No hay comentarios aún. ¡Sé el primero en opinar!
              </p>
            ) : (
              comentarios.map((comment) => (
                <div key={comment.id} className="comment-thread">
                  <div className="comment-card">
                    <div className="comment-avatar"></div>
                    <div className="comment-content">
                      <div className="comment-header">
                        <h4>{comment.autor}</h4>
                        <span className="comment-time">{comment.tiempo}</span>
                      </div>
                      <p>{comment.texto}</p>
                      <button className="reply-action-btn">
                        <FaReply /> Responder
                      </button>
                    </div>
                  </div>

                  {comment.respuestas && comment.respuestas.length > 0 && (
                    <div className="replies-container">
                      {comment.respuestas.map((reply) => (
                        <div key={reply.id} className="comment-card reply-card">
                          <div className="comment-avatar reply-avatar"></div>
                          <div className="comment-content">
                            <div className="comment-header">
                              <h4>{reply.autor}</h4>
                              <span className="comment-time">
                                {reply.tiempo}
                              </span>
                            </div>
                            <p>{reply.texto}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* =========================================
              LÓGICA DE PERMISOS PARA COMENTAR
          ========================================= */}
          <div style={{ marginTop: "3rem" }}>
            {!usuarioLogueado ? (
              // CASO 1: NO HA INICIADO SESIÓN
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "10px",
                }}
              >
                <p style={{ marginBottom: "1rem", color: "#aaa" }}>
                  Debes iniciar sesión para unirte a la conversación.
                </p>
                <Link to="/login">
                  <button className="publish-btn">Ir a Iniciar Sesión</button>
                </Link>
              </div>
            ) : usuarioLogueado.rol !== "Suscriptor" ? (
              // CASO 2: LOGUEADO PERO NO ES SUSCRIPTOR
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  background: "rgba(145, 70, 255, 0.1)", // Un fondo morado sutil
                  border: "1px solid #9146ff",
                  borderRadius: "10px",
                }}
              >
                <FaStar
                  style={{
                    color: "#ffd700",
                    fontSize: "2rem",
                    marginBottom: "10px",
                  }}
                />
                <h3 style={{ color: "white", marginBottom: "0.5rem" }}>
                  Función exclusiva para Suscriptores
                </h3>
                <p style={{ marginBottom: "1.5rem", color: "#ccc" }}>
                  Únete a nuestra comunidad premium para poder dejar tus
                  opiniones y debatir con otros jugadores.
                </p>
                <Link to="/dashboard">
                  <button
                    className="publish-btn"
                    style={{ backgroundColor: "#9146ff", fontWeight: "bold" }}
                  >
                    Mejorar mi cuenta
                  </button>
                </Link>
              </div>
            ) : (
              // CASO 3: LOGUEADO Y ES SUSCRIPTOR (Muestra el formulario)
              <form
                onSubmit={handleEnviarComentario}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <textarea
                  className="dark-input"
                  rows="3"
                  placeholder="Añade un comentario a la discusión..."
                  value={nuevoTexto}
                  onChange={(e) => setNuevoTexto(e.target.value)}
                  required
                  style={{ width: "100%", resize: "vertical", padding: "15px" }}
                ></textarea>

                {mensaje && (
                  <span style={{ color: "#9146ff", fontSize: "0.9rem" }}>
                    {mensaje}
                  </span>
                )}

                <button
                  type="submit"
                  className="submit-coment"
                  style={{ alignSelf: "flex-start" }}
                >
                  Publicar Comentario
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
