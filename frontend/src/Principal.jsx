import React from "react";
// 1. AÑADIDO: Importamos el sistema de navegación
import { useNavigate } from "react-router-dom";
import "/src/Principal.css";

// Importamos el icono específico:
import { FaHome, FaGamepad, FaNewspaper, FaComments, FaMobileAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

function Principal() {
  const navigate = useNavigate();

  return (
    <div className="layout">
      {/* --- MENÚ LATERAL (SIDEBAR) --- */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <h2>GAME-HUB</h2>
          <nav>
            <ul>
              {/* Ahora navigate sí funcionará perfectamente */}
              <li className="active" onClick={() => navigate("/")}>
                <FaHome className="menu-icon" /> Inicio
              </li>
              <li onClick={() => navigate("/dashboard")}>
                <MdDashboard className="menu-icon" /> DashBoard-Admin
              </li>
               <li onClick={() => navigate("/perfil")}>
                <MdDashboard className="menu-icon" /> DashBoard-Usuario
              </li>
              <li onClick={() => navigate("/catalogo")}>
                <FaGamepad className="menu-icon" /> Catálogo/Ranking
              </li>
              <li onClick={() => navigate("/Noticias")}>
                <FaNewspaper className="menu-icon" /> Noticias
              </li>
              <li onClick={() => navigate("/articulo/:id")}>
                <FaComments className="menu-icon" /> Comentarios
              </li>
              <li onClick={() => navigate("/inicio-movil")}className="mobile-toggle-btn">
                <FaMobileAlt className="menu-icon mobile-icon" /> Vista Móvil
              </li>
              <li onClick={() => navigate("/dashboard-movil")}className="mobile-toggle-btn">
                <FaMobileAlt className="menu-icon mobile-icon" /> Dashboard Móvil
              </li>
              <li onClick={() => navigate("/registro")} className="menu-icon">
                <FaMobileAlt className="menu-icon mobile-icon" /> Registro
              </li>
            </ul>
          </nav>
        </div>
        <div className="sidebar-bottom">
          <button className="text-btn" onClick={() => navigate("/login")}>
            Registro
          </button>
          <button className="text-btn" onClick={() => navigate("/login")}>
            Acceder
          </button>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="main-content">
        {/* Fila superior de noticias */}
        <section className="news-grid">
          <div className="news-card">
            <div className="img-placeholder halo"></div>
            <div className="card-text">
              <p>
                Parece que Xbox va con pies de plomo con el tema de los juegos
                exclusivos...
              </p>
            </div>
          </div>
          <div className="news-card">
            <div className="img-placeholder gta"></div>
            <div className="card-text">
              <p>
                Con el lanzamiento de GTA 6 previsto para noviembre, Rockstar
                adelanta...
              </p>
            </div>
          </div>
          <div className="news-card">
            <div className="img-placeholder ps5"></div>
            <div className="card-text">
              <p>
                Sony ofrece una actualización sobre PS6, pero parece que tiene
                las mismas dudas...
              </p>
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
