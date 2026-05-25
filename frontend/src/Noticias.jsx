import React, { useEffect, useState } from "react";
import "/src/Noticias.css";
import { useNavigate } from "react-router-dom";
import { FaHome, FaGamepad, FaNewspaper, FaComments } from "react-icons/fa";
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

  const cargarNoticias = async () => {
    setCargando(true);
    setError("");

    try {
      const respuesta = await fetch(`${API_URL}/api/noticias/`);
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
      const respuesta = await fetch(`${API_URL}/api/noticias/${id}`, {
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
      const respuesta = await fetch(`${API_URL}/api/noticias/${id}`, {
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
      </aside>

      <main className="main-content">
        <h1>Noticias</h1>
        <p>Noticias conectadas a la base de datos MySQL.</p>

        {cargando && <p>Cargando noticias...</p>}
        {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}

        <section className="news-list">
          {noticias.map((noticia) => (
            <article key={noticia.id_noticia} className="news-card">
              {editandoId === noticia.id_noticia ? (
                <div className="edit-form">
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
                  <div onClick={() => navigate(`/articulo/${noticia.id_noticia}`)} style={{ cursor: "pointer" }}>
                    <h3>{noticia.titulo}</h3>
                    <p>{noticia.contenido?.slice(0, 180)}...</p>
                    <small>
                      Autor: {noticia.autor || "Sin autor"} | Categoría: {noticia.categoria || "Sin categoría"}
                    </small>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                    <button onClick={() => iniciarEdicion(noticia)}>Editar</button>
                    <button onClick={() => eliminarNoticia(noticia.id_noticia)}>Eliminar</button>
                  </div>
                </>
              )}
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
