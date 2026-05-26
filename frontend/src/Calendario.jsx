import React, { useState, useEffect } from "react";
import "/src/Calendario.css";
import { useNavigate } from "react-router-dom";
import { 
  FaHome, FaGamepad, FaNewspaper, FaComments, 
  FaUserCircle, FaCalendarAlt, FaChevronLeft, FaChevronRight 
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

const API_URL = "http://localhost:8000";

export default function Calendario() {
  const navigate = useNavigate();
  const [fechaActual, setFechaActual] = useState(new Date());
  const [eventos, setEventos] = useState([]);

  const stringUsuario = localStorage.getItem("usuario");
  const usuario = stringUsuario ? JSON.parse(stringUsuario) : null;

  // 1. CARGA DE EVENTOS REALES DESDE LA BASE DE DATOS (AHORA SÍ, DENTRO DE LA FUNCIÓN)
  // 1. CARGA DE EVENTOS REALES DESDE LA BASE DE DATOS
  useEffect(() => {
    const cargarEventosBD = async () => {
      try {
        // CORRECCIÓN 1: Cambiamos a singular para que coincida con tu Python (/api/evento)
        const respuesta = await fetch(`${API_URL}/api/evento/`);
        if (!respuesta.ok) {
          throw new Error("No se pudieron extraer los eventos de la base de datos");
        }
        const datos = await respuesta.json();
        
        // CORRECCIÓN 2: Mapeamos los nombres EXACTOS de tu base de datos (ev.nombre, ev.fecha_inicio)
        const eventosFormateados = datos.map(ev => {
          
          // Opcional: Si en tu base de datos tienes un tipo de evento importante (ej. 'mantenimiento'), 
          // lo pintamos de rojo ('important'). Si no, normal.
          const esImportante = ev.tipo_evento === 'mantenimiento' || ev.tipo_evento === 'urgente';

          return {
            id: ev.id_evento,
            titulo: ev.nombre,            // Python manda 'nombre', React usa 'titulo'
            fecha: ev.fecha_inicio,       // Python manda 'fecha_inicio', React usa 'fecha'
            tipo: esImportante ? "important" : "normal"
          };
        });
        
        setEventos(eventosFormateados);
      } catch (error) {
        console.error("Error al conectar con la API de eventos:", error);
      }
    };

    cargarEventosBD();
  }, [fechaActual]);

  // 2. LÓGICA DE FECHAS
  const mesActual = fechaActual.getMonth();
  const añoActual = fechaActual.getFullYear();
  
  const diasEnMes = new Date(añoActual, mesActual + 1, 0).getDate();
  // Obtener el día de la semana en que empieza el mes (0 = Domingo, 1 = Lunes)
  const primerDiaMes = new Date(añoActual, mesActual, 1).getDay();
  // Ajuste para que la semana empiece en Lunes
  const diasVacios = primerDiaMes === 0 ? 6 : primerDiaMes - 1; 

  const cambiarMes = (direccion) => {
    setFechaActual(new Date(añoActual, mesActual + direccion, 1));
  };

  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  // 3. GENERAR LAS CELDAS DEL CALENDARIO
  const renderizarDias = () => {
    const celdas = [];
    
    // Rellenar días vacíos antes del inicio del mes
    for (let i = 0; i < diasVacios; i++) {
      celdas.push(<div key={`empty-${i}`} className="calendar-cell empty"></div>);
    }

    // Rellenar los días reales del mes
    for (let dia = 1; dia <= diasEnMes; dia++) {
      const fechaIteracion = `${añoActual}-${String(mesActual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
      
      // Filtrar los eventos que caen en este día
      const eventosDelDia = eventos.filter(evento => evento.fecha === fechaIteracion);
      
      // Comprobar si es "hoy"
      const hoy = new Date();
      const esHoy = hoy.getDate() === dia && hoy.getMonth() === mesActual && hoy.getFullYear() === añoActual;

      celdas.push(
        <div key={dia} className={`calendar-cell ${esHoy ? "today" : ""}`}>
          <span className="cell-number">{dia}</span>
          {eventosDelDia.map(ev => (
            <div key={ev.id} className={`event-badge ${ev.tipo === 'important' ? 'important' : ''}`} title={ev.titulo}>
              {ev.titulo}
            </div>
          ))}
        </div>
      );
    }
    return celdas;
  };

  return (
    <div className="layout">
      {/* --- MENÚ LATERAL --- */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <h2>GAME-HUB</h2>
          <nav>
            <ul>
              <li onClick={() => navigate("/")}><FaHome className="menu-icon" /> Inicio</li>
              <li onClick={() => navigate("/dashboard")}><MdDashboard className="menu-icon" /> DashBoard</li>
              <li onClick={() => navigate("/catalogo")}><FaGamepad className="menu-icon" /> Catálogo/Ranking</li>
              <li onClick={() => navigate("/noticias")}><FaNewspaper className="menu-icon" /> Noticias</li>
              <li onClick={() => navigate("/articulo/1")}><FaComments className="menu-icon" /> Comentarios</li>
              <li className="active" onClick={() => navigate("/calendario")}><FaCalendarAlt className="menu-icon" /> Eventos</li>
            </ul>
          </nav>
        </div>

        <div className="sidebar-bottom">
          {usuario ? (
            <div className="user-logged-in" style={{ textAlign: "center", padding: "10px", width: "100%" }}>
              <FaUserCircle size={30} style={{ color: "#9146ff", marginBottom: "5px" }} />
              <p style={{ color: "white", margin: "0 0 10px 0", fontSize: "14px" }}>
                Hola, <strong>{usuario.username}</strong>
              </p>
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
        <h1 className="section-title">Calendario de Eventos</h1>
        <p style={{ color: "#a1a1aa" }}>Mantente al día con los próximos lanzamientos y actualizaciones.</p>

        <div className="calendar-container">
          {/* Controles del mes */}
          <div className="calendar-header">
            <button className="calendar-nav-btn" onClick={() => cambiarMes(-1)}>
              <FaChevronLeft /> Anterior
            </button>
            <h2>{meses[mesActual]} {añoActual}</h2>
            <button className="calendar-nav-btn" onClick={() => cambiarMes(1)}>
              Siguiente <FaChevronRight />
            </button>
          </div>

          {/* Días de la semana */}
          <div className="calendar-grid-container">
            <div className="calendar-days-header">
              <span>Lunes</span>
              <span>Martes</span>
              <span>Miércoles</span>
              <span>Jueves</span>
              <span>Viernes</span>
              <span>Sábado</span>
              <span>Domingo</span>
            </div>
            
            {/* Cuadrícula interactiva */}
            <div className="calendar-grid">
              {renderizarDias()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}