-- =========================================================
-- Script de comprobación rápida
-- Proyecto: Game-Hub & Services Ecosystem
-- =========================================================

USE gamehub;

SHOW TABLES;

SELECT 'rol' AS tabla, COUNT(*) AS registros FROM rol
UNION ALL SELECT 'usuario', COUNT(*) FROM usuario
UNION ALL SELECT 'categoria', COUNT(*) FROM categoria
UNION ALL SELECT 'noticia', COUNT(*) FROM noticia
UNION ALL SELECT 'blogpost', COUNT(*) FROM blogpost
UNION ALL SELECT 'comentario', COUNT(*) FROM comentario
UNION ALL SELECT 'videojuego', COUNT(*) FROM videojuego
UNION ALL SELECT 'evento', COUNT(*) FROM evento
UNION ALL SELECT 'multimedia', COUNT(*) FROM multimedia
UNION ALL SELECT 'contacto', COUNT(*) FROM contacto;

-- Comprobar relaciones principales
SELECT u.nombre AS usuario, r.nombre AS rol
FROM usuario u
JOIN rol r ON u.id_rol = r.id_rol;

SELECT n.titulo AS noticia, u.nombre AS autor, c.nombre AS categoria
FROM noticia n
LEFT JOIN usuario u ON n.id_autor = u.id_usuario
LEFT JOIN categoria c ON n.id_categoria = c.id_categoria;

SELECT bp.titulo AS post, co.contenido AS comentario, u.nombre AS usuario
FROM comentario co
JOIN blogpost bp ON co.id_post = bp.id_post
LEFT JOIN usuario u ON co.id_usuario = u.id_usuario;