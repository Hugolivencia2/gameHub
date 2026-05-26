-- =========================================================
-- Script de creación de base de datos
-- Proyecto: Game-Hub & Services Ecosystem
-- Base de datos: MySQL
-- =========================================================

DROP DATABASE IF EXISTS gamehub;
CREATE DATABASE gamehub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gamehub;

-- =========================================================
-- 1. Tabla: rol
-- =========================================================
CREATE TABLE rol (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
) ENGINE=InnoDB;

-- =========================================================
-- 2. Tabla: usuario
-- =========================================================
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    biografia TEXT,
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('activo', 'suspendido') NOT NULL DEFAULT 'activo',
    id_rol INT NOT NULL,
    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- 3. Tabla: categoria
-- =========================================================
CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
) ENGINE=InnoDB;

-- =========================================================
-- 4. Tabla: noticia
-- =========================================================
CREATE TABLE noticia (
    id_noticia INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    contenido TEXT NOT NULL,
    imagen VARCHAR(255),
    fecha_publicacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('borrador', 'publicada', 'archivada') NOT NULL DEFAULT 'borrador',
    id_autor INT NULL,
    id_categoria INT NULL,
    CONSTRAINT fk_noticia_autor
        FOREIGN KEY (id_autor) REFERENCES usuario(id_usuario)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_noticia_categoria
        FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- 5. Tabla: blogpost
-- =========================================================
CREATE TABLE blogpost (
    id_post INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    contenido TEXT NOT NULL,
    fecha_publicacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('borrador', 'publicado', 'archivado') NOT NULL DEFAULT 'borrador',
    comentarios_habilitados BOOLEAN NOT NULL DEFAULT TRUE,
    id_autor INT NULL,
    id_categoria INT NULL,
    CONSTRAINT fk_blogpost_autor
        FOREIGN KEY (id_autor) REFERENCES usuario(id_usuario)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_blogpost_categoria
        FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- 6. Tabla: comentario
-- =========================================================
CREATE TABLE comentario (
    id_comentario INT AUTO_INCREMENT PRIMARY KEY,
    contenido TEXT NOT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('visible', 'oculto', 'eliminado') NOT NULL DEFAULT 'visible',
    id_usuario INT NULL,
    id_post INT NOT NULL,
    CONSTRAINT fk_comentario_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_comentario_blogpost
        FOREIGN KEY (id_post) REFERENCES blogpost(id_post)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- 7. Tabla: videojuego
-- =========================================================
CREATE TABLE videojuego (
    id_videojuego INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    imagen VARCHAR(255),
    nota_prensa DECIMAL(3,1) NOT NULL,
    nota_comunidad DECIMAL(3,1) NOT NULL DEFAULT 0.0,
    fecha_lanzamiento DATE,
    plataforma VARCHAR(150),
    CONSTRAINT chk_videojuego_nota_prensa
        CHECK (nota_prensa >= 0 AND nota_prensa <= 10),
    CONSTRAINT chk_videojuego_nota_comunidad
        CHECK (nota_comunidad >= 0 AND nota_comunidad <= 10)
) ENGINE=InnoDB;

-- =========================================================
-- 8. Tabla: evento
-- =========================================================
CREATE TABLE evento (
    id_evento INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    tipo_evento ENUM('lanzamiento', 'feria', 'convencion', 'torneo') NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    ubicacion VARCHAR(150),
    enlace VARCHAR(255),
    CONSTRAINT chk_evento_fechas
        CHECK (fecha_fin IS NULL OR fecha_fin >= fecha_inicio)
) ENGINE=InnoDB;

-- =========================================================
-- 9. Tabla: multimedia
-- =========================================================
CREATE TABLE multimedia (
    id_multimedia INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    tipo ENUM('trailer', 'stream', 'entrevista', 'video') NOT NULL,
    url_externa VARCHAR(255) NOT NULL,
    miniatura VARCHAR(255),
    fecha_publicacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =========================================================
-- 10. Tabla: contacto
-- =========================================================
CREATE TABLE contacto (
    id_contacto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    asunto VARCHAR(150),
    mensaje TEXT NOT NULL,
    fecha_envio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('pendiente', 'revisado', 'respondido') NOT NULL DEFAULT 'pendiente'
) ENGINE=InnoDB;

-- =========================================================
-- Índices recomendados para mejorar consultas frecuentes
-- =========================================================
CREATE INDEX idx_usuario_rol ON usuario(id_rol);
CREATE INDEX idx_noticia_autor ON noticia(id_autor);
CREATE INDEX idx_noticia_categoria ON noticia(id_categoria);
CREATE INDEX idx_blogpost_autor ON blogpost(id_autor);
CREATE INDEX idx_blogpost_categoria ON blogpost(id_categoria);
CREATE INDEX idx_comentario_usuario ON comentario(id_usuario);
CREATE INDEX idx_comentario_post ON comentario(id_post);