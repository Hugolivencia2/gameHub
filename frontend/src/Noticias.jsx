import React, { useEffect, useState } from "react";
import "/src/Noticias.css";
import { useNavigate } from "react-router-dom";
import { FaHome, FaGamepad, FaNewspaper, FaComments, FaMobileAlt, FaUserCircle } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

const API_URL = "http://localhost:8000";

export default function Noticias() {
  const navigate = useNavigate();
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [formEdicion, setFormEdicion] = useState({
    titulo: "",
    contenido: "",
    imagen: "",
    estado: "publicada",
    id_categoria: "",
  });

  // Comprobamos si hay usuario logueado para la sidebar
  const stringUsuario = localStorage.getItem("usuario");
  const usuario = stringUsuario ? JSON.parse(stringUsuario) : null;

  const cargarNoticias = async () => {
    setCargando(true);
    setError("");

    try {
      // CORRECCIÓN 1: Cambiado a singular (/api/noticia/)
      const respuesta = await fetch(`${API_URL}/api/noticia/`);
      if (!respuesta.ok) {
        throw new Error("No se pudieron cargar las noticias");
      }
      const datos = await respuesta.json();
      setNoticias(datos);
    } catch (err) {
      console.error(err);
      setError("Error al cargar noticias.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarNoticias();
  }, []);

  const iniciarEdicion = (noticia) => {
    setEditandoId(noticia.id_noticia);
    setFormEdicion({
      titulo: noticia.titulo || "",
      contenido: noticia.contenido || "",
      imagen: noticia.imagen || "",
      estado: noticia.estado || "publicada",
      id_categoria: noticia.id_categoria || "",
    });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setFormEdicion({ titulo: "", contenido: "", imagen: "", estado: "publicada", id_categoria: "" });
  };

  const guardarEdicion = async (id) => {
    try {
      // CORRECCIÓN 2: Cambiado a singular (/api/noticia/${id})
      const respuesta = await fetch(`${API_URL}/api/noticia/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formEdicion,
          id_categoria: formEdicion.id_categoria ? Number(formEdicion.id_categoria) : null,
        }),
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo editar la noticia");
      }

      cancelarEdicion();
      cargarNoticias();
    } catch (err) {
      console.error(err);
      alert("Error al editar la noticia.");
    }
  };

  const eliminarNoticia = async (id) => {
    const confirmar = window.confirm("¿Seguro que quieres eliminar esta noticia?");
    if (!confirmar) return;

    try {
      // CORRECCIÓN 3: Cambiado a singular (/api/noticia/${id})
      const respuesta = await fetch(`${API_URL}/api/noticia/${id}`, {
        method: "DELETE",
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo eliminar la noticia");
      }

      cargarNoticias();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar la noticia.");
    }
  };

  return (
    <div className="layout">
      {/* --- MENÚ LATERAL (SIDEBAR) --- */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <h2>GAME-HUB</h2>
          <nav>
            <ul>
              <li onClick={() => navigate("/")}><FaHome className="menu-icon" /> Inicio</li>
              <li onClick={() => navigate("/dashboard")}><MdDashboard className="menu-icon" /> DashBoard</li>
              <li onClick={() => navigate("/catalogo")}><FaGamepad className="menu-icon" /> Catálogo/Ranking</li>
              <li className="active" onClick={() => navigate("/noticias")}><FaNewspaper className="menu-icon" /> Noticias</li>
              <li onClick={() => navigate("/articulo/1")}><FaComments className="menu-icon" /> Comentarios</li>
            </ul>
          </nav>
        </div>
        
        {/* Lógica de usuario en la barra inferior de la sidebar */}
        <div className="sidebar-bottom">
          {usuario ? (
            <div className="user-logged-in" style={{ textAlign: "center", padding: "10px", width: "100%" }}>
              <FaUserCircle size={30} style={{ color: "#9146ff", marginBottom: "5px" }} />
              <p style={{ color: "white", margin: "0 0 10px 0", fontSize: "14px" }}>
                Hola, <strong>{usuario.username}</strong>
              </p>
              <button className="text-btn" onClick={() => navigate("/dashboard")} style={{ color: "#9146ff" }}>
                Ir a mi panel
              </button>
            </div>
          ) : (
            <>
              <button className="text-btn" onClick={() => navigate("/registro")}>Registro</button>
              <button className="text-btn" onClick={() => navigate("/login")}>Acceder</button>
            </>
          )}
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="main-content">
        <h1 className="section-title">Noticias</h1>
        <p style={{ color: "#888", marginBottom: "2rem" }}>Noticias conectadas a la base de datos MySQL.</p>

        {cargando && <p>Cargando noticias...</p>}
        {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}

        {/* Cambiado a .news-feed para coincidir con tu CSS */}
        <section className="news-feed">
          {noticias.map((noticia, index) => (
            <React.Fragment key={noticia.id_noticia}>
              
              {/* Añadimos una línea separadora entre noticias (excepto antes de la primera) */}
              {index > 0 && <hr className="news-divider" />}

              {/* Cambiado a .news-list-item para que use Flexbox y alinee la imagen al lado */}
              <article className="news-list-item">
                
                {editandoId === noticia.id_noticia ? (
                  <div className="edit-form" style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <input
                      value={formEdicion.titulo}
                      onChange={(e) => setFormEdicion({ ...formEdicion, titulo: e.target.value })}
                      placeholder="Título"
                    />
                    <textarea
                      value={formEdicion.contenido}
                      onChange={(e) => setFormEdicion({ ...formEdicion, contenido: e.target.value })}
                      placeholder="Contenido"
                      rows="5"
                    />
                    <input
                      value={formEdicion.imagen}
                      onChange={(e) => setFormEdicion({ ...formEdicion, imagen: e.target.value })}
                      placeholder="URL o ruta de imagen"
                    />
                    <select
                      value={formEdicion.estado}
                      onChange={(e) => setFormEdicion({ ...formEdicion, estado: e.target.value })}
                    >
                      <option value="borrador">Borrador</option>
                      <option value="publicada">Publicada</option>
                      <option value="archivada">Archivada</option>
                    </select>
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                      <button onClick={() => guardarEdicion(noticia.id_noticia)}>Guardar</button>
                      <button onClick={cancelarEdicion}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Contenedor de la Imagen a la izquierda (.list-img) */}
                    <div 
                      className="list-img" 
                      style={{ backgroundImage: noticia.imagen ? `url(${noticia.imagen})` : 'linear-gradient(45deg, #1a1515, #2a1f1f)' }}
                      onClick={() => navigate(`/articulo/${noticia.id_noticia}`)}
                    />

                    {/* Contenedor del Contenido a la derecha (.list-content) */}
                    <div className="list-content">
                      <div onClick={() => navigate(`/articulo/${noticia.id_noticia}`)} style={{ cursor: "pointer" }}>
                        <h4>{noticia.titulo}</h4>
                        <p style={{ color: "#cccccc", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                          {noticia.contenido?.slice(0, 180)}...
                        </p>
                      </div>
                      
                      {/* Metadatos y botones abajo alineados */}
                      <div className="list-meta">
                        <div className="stars">Hace un momento</div>
                        <div className="meta">
                          Autor: {noticia.autor || "Sin autor"} | Categoría: {noticia.categoria || "Sin categoría"}
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", justifyContent: "flex-end" }}>
                          <button className="text-btn" onClick={() => iniciarEdicion(noticia)} style={{ fontSize: "0.85rem", color: "#ffd700" }}>Editar</button>
                          <button className="text-btn" onClick={() => eliminarNoticia(noticia.id_noticia)} style={{ fontSize: "0.85rem", color: "#ff4444" }}>Eliminar</button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </article>
            </React.Fragment>
          ))}
        </section>
      </main>
    </div>
  );
}