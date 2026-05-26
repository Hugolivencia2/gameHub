import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaGamepad, FaNewspaper, FaComments, FaVideo } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import "/src/Noticias.css";

const API_URL = "http://localhost:8000";

const formularioInicial = {
  titulo: "",
  descripcion: "",
  tipo: "video",
  url_externa: "",
  miniatura: "",
};

export default function Multimedia() {
  const navigate = useNavigate();
  const [contenidos, setContenidos] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState("");

  const cargarMultimedia = async () => {
    try {
      const respuesta = await fetch(`${API_URL}/api/multimedia/`);
      if (!respuesta.ok) throw new Error("No se pudo cargar multimedia");
      const datos = await respuesta.json();
      setContenidos(datos);
    } catch (err) {
      console.error(err);
      setError("Error al cargar contenido multimedia.");
    }
  };

  useEffect(() => {
    cargarMultimedia();
  }, []);

  const actualizarCampo = (campo, valor) => {
    setFormulario({ ...formulario, [campo]: valor });
  };

  const limpiarFormulario = () => {
    setFormulario(formularioInicial);
    setEditandoId(null);
  };

  const guardarMultimedia = async (e) => {
    e.preventDefault();

    const metodo = editandoId ? "PUT" : "POST";
    const url = editandoId
      ? `${API_URL}/api/multimedia/${editandoId}`
      : `${API_URL}/api/multimedia/`;

    try {
      const respuesta = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formulario),
      });

      if (!respuesta.ok) throw new Error("No se pudo guardar el contenido multimedia");

      limpiarFormulario();
      cargarMultimedia();
    } catch (err) {
      console.error(err);
      alert("Error al guardar multimedia.");
    }
  };

  const editarMultimedia = (item) => {
    setEditandoId(item.id_multimedia);
    setFormulario({
      titulo: item.titulo || "",
      descripcion: item.descripcion || "",
      tipo: item.tipo || "video",
      url_externa: item.url_externa || "",
      miniatura: item.miniatura || "",
    });
  };

  const eliminarMultimedia = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este contenido multimedia?")) return;

    try {
      const respuesta = await fetch(`${API_URL}/api/multimedia/${id}`, {
        method: "DELETE",
      });

      if (!respuesta.ok) throw new Error("No se pudo eliminar multimedia");
      cargarMultimedia();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar multimedia.");
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
              <li onClick={() => navigate("/noticias")}><FaNewspaper className="menu-icon" /> Noticias</li>
              <li onClick={() => navigate("/multimedia")}><FaVideo className="menu-icon" /> Multimedia</li>
              <li onClick={() => navigate("/articulo/1")}><FaComments className="menu-icon" /> Comentarios</li>
            </ul>
          </nav>
        </div>
      </aside>

      <main className="main-content">
        <h1>Hub Multimedia</h1>
        <p>Gestión de trailers, streams, entrevistas y vídeos externos.</p>

        {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}

        <form onSubmit={guardarMultimedia} className="edit-form" style={{ marginBottom: "2rem" }}>
          <h2>{editandoId ? "Editar contenido" : "Añadir contenido"}</h2>
          <input
            placeholder="Título"
            value={formulario.titulo}
            onChange={(e) => actualizarCampo("titulo", e.target.value)}
            required
          />
          <textarea
            placeholder="Descripción"
            value={formulario.descripcion}
            onChange={(e) => actualizarCampo("descripcion", e.target.value)}
            rows="3"
          />
          <select value={formulario.tipo} onChange={(e) => actualizarCampo("tipo", e.target.value)}>
            <option value="trailer">Trailer</option>
            <option value="stream">Stream</option>
            <option value="entrevista">Entrevista</option>
            <option value="video">Vídeo</option>
          </select>
          <input
            placeholder="URL externa"
            value={formulario.url_externa}
            onChange={(e) => actualizarCampo("url_externa", e.target.value)}
            required
          />
          <input
            placeholder="Miniatura"
            value={formulario.miniatura}
            onChange={(e) => actualizarCampo("miniatura", e.target.value)}
          />
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
            <button type="submit">{editandoId ? "Guardar cambios" : "Crear multimedia"}</button>
            {editandoId && <button type="button" onClick={limpiarFormulario}>Cancelar</button>}
          </div>
        </form>

        <section className="news-list">
          {contenidos.map((item) => (
            <article key={item.id_multimedia} className="news-card">
              <h3>{item.titulo}</h3>
              <p>{item.descripcion || "Sin descripción."}</p>
              <p><strong>Tipo:</strong> {item.tipo}</p>
              <a href={item.url_externa} target="_blank" rel="noreferrer">Abrir contenido</a>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                <button onClick={() => editarMultimedia(item)}>Editar</button>
                <button onClick={() => eliminarMultimedia(item.id_multimedia)}>Eliminar</button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
