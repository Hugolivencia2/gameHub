import React, { createContext, useState, useContext } from 'react';

// 1. Nuestro diccionario manual
const diccionario = {
  es: {
    inicio: "Inicio",
    dashboard: "DashBoard",
    catalogo: "Catálogo/Ranking",
    noticias: "Noticias",
    comentarios: "Comentarios",
    calendario: "Eventos",
    vista_movil: "Vista Móvil",
    dashboard_movil: "Dashboard Móvil",
    colaboradores: "Colaboradores",
    contacto: "Contacto",
    // NUEVOS TEXTOS TRADUCIDOS:
    hola: "Hola",
    ir_panel: "Ir a mi panel",
    registro: "Registro",
    acceder: "Acceder"
  },
  en: {
    inicio: "Home",
    dashboard: "DashBoard",
    catalogo: "Catalog/Ranking",
    noticias: "News",
    comentarios: "Comments",
    calendario: "Events",
    vista_movil: "Mobile View",
    dashboard_movil: "Mobile Dashboard",
    colaboradores: "Collaborators",
    contacto: "Contact",
    // NUEVOS TEXTOS TRADUCIDOS:
    hola: "Hello",
    ir_panel: "Go to my dashboard",
    registro: "Sign Up",
    acceder: "Login"
  }
};

// 2. Creamos el Contexto
const LanguageContext = createContext();

// 3. El Proveedor que envolverá tu app
export function LanguageProvider({ children }) {
  const [idioma, setIdioma] = useState("es"); // Español por defecto

  // Función mágica para traducir
  const t = (clave) => {
    return diccionario[idioma][clave] || clave;
  };

  return (
    <LanguageContext.Provider value={{ idioma, setIdioma, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// 4. Nuestro propio Hook (mucho más seguro)
export const useLanguage = () => useContext(LanguageContext);