-- =========================================================
-- Script de inserción de datos de prueba
-- Proyecto: Game-Hub & Services Ecosystem
-- Base de datos: MySQL
-- =========================================================

USE gamehub;

-- Roles principales
INSERT INTO rol (nombre, descripcion) VALUES
('Administrador', 'Usuario con permisos completos de gestión del sistema.'),
('Redactor', 'Usuario encargado de crear y gestionar noticias.'),
('Colaborador', 'Usuario encargado de aportar contenido de opinión o multimedia.'),
('Suscriptor', 'Usuario registrado con permisos para comentar y valorar contenido.');

-- Categorías de contenido
INSERT INTO categoria (nombre, descripcion) VALUES
('Noticias', 'Actualidad y novedades del sector del videojuego.'),
('Opinión', 'Artículos de opinión y análisis editorial.'),
('Tecnología', 'Contenido sobre avances tecnológicos relacionados con videojuegos.'),
('Eventos', 'Información relacionada con ferias, lanzamientos y convenciones.');

-- Usuarios de prueba
INSERT INTO usuario (nombre, email, password_hash, avatar, biografia, estado, id_rol) VALUES
('Admin GameHub', 'admin@gamehub.com', 'hash_admin_demo', 'admin.png', 'Administrador principal de la plataforma.', 'activo', 1),
('Redactor Principal', 'redactor@gamehub.com', 'hash_redactor_demo', 'redactor.png', 'Redactor de noticias gaming.', 'activo', 2),
('Colaborador Demo', 'colaborador@gamehub.com', 'hash_colaborador_demo', 'colaborador.png', 'Colaborador del blog de opinión.', 'activo', 3),
('Suscriptor Demo', 'suscriptor@gamehub.com', 'hash_suscriptor_demo', 'suscriptor.png', 'Usuario registrado de prueba.', 'activo', 4);

-- Noticias de prueba
INSERT INTO noticia (titulo, contenido, imagen, estado, id_autor, id_categoria) VALUES
('Nuevas tendencias en la industria del videojuego', 'Artículo sobre las tendencias actuales del sector gaming.', 'noticia1.jpg', 'publicada', 2, 1),
('La evolución de los servicios online en videojuegos', 'Análisis sobre cómo los videojuegos han evolucionado hacia modelos de servicio.', 'noticia2.jpg', 'publicada', 2, 3);

-- Posts del blog
INSERT INTO blogpost (titulo, contenido, estado, comentarios_habilitados, id_autor, id_categoria) VALUES
('El impacto de las comunidades gaming', 'Reflexión sobre la importancia de la comunidad en los videojuegos actuales.', 'publicado', TRUE, 3, 2),
('¿Son importantes los rankings históricos?', 'Artículo de opinión sobre rankings y valoraciones de videojuegos.', 'publicado', TRUE, 3, 2);

-- Comentarios
INSERT INTO comentario (contenido, estado, id_usuario, id_post) VALUES
('Muy buen artículo, totalmente de acuerdo.', 'visible', 4, 1),
('Interesante punto de vista sobre los rankings.', 'visible', 4, 2);

-- Videojuegos de prueba
INSERT INTO videojuego (titulo, descripcion, imagen, nota_prensa, nota_comunidad, fecha_lanzamiento, plataforma) VALUES
('The Legend of Zelda: Breath of the Wild', 'Aventura de mundo abierto reconocida por su libertad de exploración.', 'zelda.jpg', 9.7, 9.5, '2017-03-03', 'Nintendo Switch'),
('Elden Ring', 'RPG de acción en mundo abierto con alta valoración de crítica y comunidad.', 'eldenring.jpg', 9.6, 9.4, '2022-02-25', 'PC, PlayStation, Xbox'),
('Minecraft', 'Videojuego sandbox centrado en construcción, exploración y creatividad.', 'minecraft.jpg', 9.3, 9.6, '2011-11-18', 'Multiplataforma');

-- Eventos de prueba
INSERT INTO evento (nombre, descripcion, tipo_evento, fecha_inicio, fecha_fin, ubicacion, enlace) VALUES
('Gamescom 2026', 'Feria internacional de videojuegos y entretenimiento interactivo.', 'feria', '2026-08-19', '2026-08-23', 'Colonia, Alemania', 'https://www.gamescom.global/'),
('Lanzamiento demo GameHub', 'Evento interno de presentación de la plataforma GameHub.', 'lanzamiento', '2026-06-15', '2026-06-15', 'Online', 'https://gamehub.example.com');

-- Multimedia de prueba
INSERT INTO multimedia (titulo, descripcion, tipo, url_externa, miniatura) VALUES
('Trailer destacado de lanzamiento', 'Trailer promocional integrado desde plataforma externa.', 'trailer', 'https://www.youtube.com/watch?v=demo', 'trailer_demo.jpg'),
('Stream de comunidad', 'Contenido de streamers y creadores influyentes.', 'stream', 'https://www.twitch.tv/demo', 'stream_demo.jpg');

-- Mensajes de contacto
INSERT INTO contacto (nombre, email, asunto, mensaje, estado) VALUES
('Usuario Visitante', 'visitante@example.com', 'Consulta general', 'Me gustaría recibir más información sobre la plataforma.', 'pendiente'),
('Empresa Gaming', 'contacto@empresa.com', 'Colaboración', 'Estamos interesados en una colaboración editorial.', 'pendiente');