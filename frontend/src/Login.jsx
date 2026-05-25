import React from "react";
import "/src/Login.css";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { IoMdClose } from "react-icons/io";
import { FaInstagram, FaChrome, FaWifi } from "react-icons/fa";
import { MdFilterCenterFocus } from "react-icons/md";

export default function Login() {
  // 1. ESTADOS: Para capturar lo que escribe el usuario y mostrar errores
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  const navigate = useNavigate();

  // 2. LA LLAMADA REAL AL BACKEND
  const handleLogin = async (e) => {
    e.preventDefault(); // Evita que la página parpadee o se recargue al enviar el formulario
    setMensajeError(""); // Limpiamos errores previos

    try {
      // Hacemos la petición POST a tu servidor FastAPI
      const respuesta = await fetch(
        "http://localhost:8000/api/usuarios/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // Convertimos el email y password a formato JSON
          body: JSON.stringify({ email: email, password: password }),
        },
      );

      if (respuesta.ok) {
        // ¡Login correcto! Extraemos los datos que nos mandó Python
        const datos = await respuesta.json();

        // 3. GUARDAR EL PASE VIP: Almacenamos el token en el navegador
        localStorage.setItem("token", datos.access_token);
        localStorage.setItem("usuario", JSON.stringify(datos.usuario));

        setMensajeError("¡Login correco! Redirigiendo...")
        setTimeout(() => {
          navigate("/dashboard");

        }, 1500);
      } else {
        // Si el backend devuelve un 401 (Email o contraseña incorrectos)
        const errorDelBackend = await respuesta.json();
        setMensajeError(errorDelBackend.detail);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setMensajeError(
        "No se pudo conectar con el servidor. Inténtalo más tarde.",
      );
    }
  };
  return (
    <div className="login-container">
      <div className="login-modal">
        {/* Botón de cerrar */}
        <button className="close-btn">
          <IoMdClose />
        </button>

        {/* Cabecera */}
        <div className="login-header">
          <p className="brand-logo">LOGO(GAME-HUB)</p>
          <h2>REGÍSTRATE GRATIS O INICIA SESIÓN</h2>
          <p className="subtitle">
            Accede con tu email y comprueba si tienes una cuenta. Si no, crea
            una
          </p>
        </div>
        <form onSubmit={handleLogin} className="login-form">
          {/* Formulario */}

          <div className="input-labels">
            <span>Email</span>
            <span>O con tu id de usuario</span>
          </div>

          <input
            type="email"
            className="auth-input"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="input-labels">
            <span>Contraseña</span>
            
          </div>

          <input
            placeholder="*******"
            type="password"
            className="auth-input"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {mensajeError && (
            <p style={{ color: "red", fontSize: "14px", textAlign: "center", marginBottom: "10px" }}>
              {mensajeError}
            </p>
          )}
          <p className="legal-text">
            Clicando en "Continua con tu email" tu confirmas que tienes 18 años
            y tu aceptas los <a href="#terms">Terms of Use</a> and{" "}
            <a href="#privacy">Privacy Policy</a>.
          </p>
          
          <button type="submit" className="submit-btn">Continua con tu email</button>
         <p style={{ textAlign: "center", marginTop: "15px", fontSize: "14px" }}>
             ¿No tienes cuenta? <Link to="/registro" style={{ color: "#9146ff", textDecoration: "none" }}>Registrate aquí</Link>
          </p>
        </form>

        {/* Login Social */}
        <div className="social-section">
          <p className="social-title">O continua con:</p>
          <div className="social-icons">
            <button className="icon-btn">
              <FaInstagram />
            </button>
            <button className="icon-btn">
              <FaChrome />
            </button>
            <button className="icon-btn">
              <FaWifi />
            </button>
            <button className="icon-btn">
              <MdFilterCenterFocus />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
