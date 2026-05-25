import React, { useState } from "react";
// Reutilizamos el mismo CSS para mantener el diseño exacto
import "/src/Login.css"; 
import { useNavigate, Link } from 'react-router-dom'; 
import { IoMdClose } from "react-icons/io";
import { FaInstagram, FaChrome, FaWifi } from "react-icons/fa";
import { MdFilterCenterFocus } from "react-icons/md";

export default function Registro() {
  // 1. ESTADOS: Ahora añadimos el username
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  const navigate = useNavigate();

  // 2. LA LLAMADA AL BACKEND PARA REGISTRAR
  const handleRegistro = async (e) => {
    e.preventDefault(); 
    setMensajeError(""); 
    setMensajeExito("");

    try {
      // Apuntamos al nuevo endpoint de registro que haremos en Python
      const respuesta = await fetch("http://localhost:8000/api/usuarios/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Enviamos los tres campos necesarios para crear la cuenta
        body: JSON.stringify({ 
            username: username, 
            email: email, 
            password: password 
        }),
      });

      if (respuesta.ok) {
        setMensajeExito("¡Cuenta creada con éxito! Redirigiendo al login...");
        
        // Esperamos 2 segundos para que el usuario lea el mensaje y lo mandamos a iniciar sesión
        setTimeout(() => {
            navigate("/login");
        }, 2000);
      } else {
        const errorDelBackend = await respuesta.json();
        setMensajeError(errorDelBackend.detail || "Error al crear la cuenta");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setMensajeError("No se pudo conectar con el servidor. Inténtalo más tarde.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-modal">
        {/* Botón de cerrar (Te lleva a la página principal) */}
        <button className="close-btn" onClick={() => navigate("/")}>
          <IoMdClose />
        </button>

        {/* Cabecera */}
        <div className="login-header">
          <p className="brand-logo">LOGO(GAME-HUB)</p>
          <h2>CREA TU CUENTA</h2>
          <p className="subtitle">
            Únete a la comunidad para comentar y personalizar tu perfil.
          </p>
        </div>
        
        {/* Formulario */}
        <form onSubmit={handleRegistro} className="login-form">
          
          {/* NUEVO INPUT: Nombre de usuario */}
          <div className="input-labels">
            <span>Nombre de Usuario</span>
          </div>
          <input
            type="text"
            className="auth-input"
            placeholder="Ej: JugadorPro99"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <div className="input-labels">
            <span>Email</span>
          </div>
          <input
            type="email"
            className="auth-input"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="input-labels">
            <span>Contraseña</span>
          </div>
          <input
            type="password"
            className="auth-input"
            placeholder="*******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Mensajes de Feedback */}
          {mensajeError && (
            <p style={{ color: "#ff4444", fontSize: "14px", textAlign: "center", marginBottom: "10px" }}>
              {mensajeError}
            </p>
          )}
          {mensajeExito && (
            <p style={{ color: "#00C851", fontSize: "14px", textAlign: "center", marginBottom: "10px" }}>
              {mensajeExito}
            </p>
          )}

          <p className="legal-text">
            Al registrarte confirmas que aceptas nuestros <a href="#terms">Términos de Uso</a> y la{" "}
            <a href="#privacy">Política de Privacidad</a>.
          </p>

          <button type="submit" className="submit-btn">Registrarse</button>
          
          <p style={{ textAlign: "center", marginTop: "15px", fontSize: "14px" }}>
             ¿Ya tienes cuenta? <Link to="/login" style={{ color: "#9146ff", textDecoration: "none" }}>Inicia Sesión aquí</Link>
          </p>
        </form>

        {/* Login Social */}
        <div className="social-section">
          <p className="social-title">O regístrate con:</p>
          <div className="social-icons">
            <button className="icon-btn"><FaInstagram /></button>
            <button className="icon-btn"><FaChrome /></button>
            <button className="icon-btn"><FaWifi /></button>
            <button className="icon-btn"><MdFilterCenterFocus /></button>
          </div>
        </div>
      </div>
    </div>
  );
}