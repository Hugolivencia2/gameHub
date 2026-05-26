import React, { useEffect, useState } from "react";
import "/src/Catalogo.css";
import { useNavigate } from "react-router-dom";
import { FaHome, FaGamepad, FaNewspaper, FaComments, FaUserCircle } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

const API_URL = "http://localhost:8000";

export default function Catalogo() {
  const navigate = useNavigate();
  const [videojuegos, setVideojuegos] = useState([]);
  const [orden, setOrden] = useState("comunidad");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Comprobamos si hay usuario logueado para la parte inferior de la sidebar
  const stringUsuario = localStorage.getItem("usuario");
  const usuario = stringUsuario ? JSON.parse(stringUsuario) : null;

  useEffect(() => {
    const cargarRanking = async () => {
      setCargando(true);
      setError("");

      try {
        // Quitamos la barra del final por seguridad en el enrutado de FastAPI
        const respuesta = await fetch(`${API_URL}/api/ranking?orden=${orden}`);
        if (!respuesta.ok) {
          throw new Error("No se pudo cargar el ranking");
        }
        const datos = await respuesta.json();
        setVideojuegos(datos);
      } catch (err) {
        console.error(err);
        setError("Error al cargar el ranking de videojuegos.");
      } finally {
        setCargando(false);
      }
    };

    cargarRanking();
  }, [orden]);

  return (
    <div className="layout">
      {/* --- MENU LATERAL --- */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <h2>GAME-HUB</h2>
          <nav>
            <ul>
              <li onClick={() => navigate("/")}><FaHome className="menu-icon" /> Inicio</li>
              <li onClick={() => navigate("/dashboard")}><MdDashboard className="menu-icon" /> DashBoard</li>
              <li className="active" onClick={() => navigate("/catalogo")}><FaGamepad className="menu-icon" /> Catálogo/Ranking</li>
              <li onClick={() => navigate("/noticias")}><FaNewspaper className="menu-icon" /> Noticias</li>
              <li onClick={() => navigate("/articulo/1")}><FaComments className="menu-icon" /> Comentarios</li>
            </ul>
          </nav>
        </div>

        {/* Módulo inteligente de login/perfil en la barra lateral */}
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
        <section className="catalogo-header">
          <h1>Los mejores juegos</h1>
          <p>Ranking conectado a la base de datos MySQL.</p>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ marginRight: "0.5rem" }}>Ordenar por:</label>
            <select value={orden} onChange={(e) => setOrden(e.target.value)}>
              <option value="comunidad">Nota comunidad</option>
              <option value="prensa">Nota prensa</option>
              <option value="titulo">Título</option>
            </select>
          </div>
        </section>

        {cargando && <p>Cargando ranking...</p>}
        {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}

        <section className="games-list">
          {videojuegos.map((juego, index) => (
            <article key={juego.id_videojuego} className="game-card">
              <div className="game-rank">#{index + 1}</div>
              <div className="game-image">
                {juego.imagen ? <img src={juego.imagen} alt={juego.titulo} /> : <span>Photo</span>}
              </div>
              <div className="game-info">
                <h2>{juego.titulo}</h2>
                <p>{juego.descripcion || "Sin descripción disponible."}</p>
                <p><strong>Plataforma:</strong> {juego.plataforma || "No especificada"}</p>
                <div className="game-scores">
                  <span>Prensa: {juego.nota_prensa}/10</span>
                  <span>Comunidad: {juego.nota_comunidad}/10</span>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}