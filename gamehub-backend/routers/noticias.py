from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from database import get_connection

router = APIRouter(prefix="/api/noticias", tags=["Noticias"])


class NoticiaUpdate(BaseModel):
    titulo: str
    contenido: str
    imagen: Optional[str] = None
    estado: str = "publicada"
    id_categoria: Optional[int] = None


@router.get("/")
def obtener_noticias():
    """Devuelve todas las noticias almacenadas en MySQL."""
    query = """
        SELECT
            n.id_noticia,
            n.titulo,
            n.contenido,
            n.imagen,
            n.fecha_publicacion,
            n.estado,
            n.id_autor,
            u.nombre AS autor,
            n.id_categoria,
            c.nombre AS categoria
        FROM noticia n
        LEFT JOIN usuario u ON n.id_autor = u.id_usuario
        LEFT JOIN categoria c ON n.id_categoria = c.id_categoria
        ORDER BY n.fecha_publicacion DESC;
    """

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query)
        return cursor.fetchall()
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error al obtener noticias: {error}")
    finally:
        cursor.close()
        connection.close()


@router.get("/{id_noticia}")
def obtener_noticia_por_id(id_noticia: int):
    """Devuelve una noticia concreta por ID."""
    query = """
        SELECT
            n.id_noticia,
            n.titulo,
            n.contenido,
            n.imagen,
            n.fecha_publicacion,
            n.estado,
            n.id_autor,
            u.nombre AS autor,
            n.id_categoria,
            c.nombre AS categoria
        FROM noticia n
        LEFT JOIN usuario u ON n.id_autor = u.id_usuario
        LEFT JOIN categoria c ON n.id_categoria = c.id_categoria
        WHERE n.id_noticia = %s;
    """

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query, (id_noticia,))
        noticia = cursor.fetchone()
        if not noticia:
            raise HTTPException(status_code=404, detail="Noticia no encontrada")
        return noticia
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error al obtener noticia: {error}")
    finally:
        cursor.close()
        connection.close()


@router.put("/{id_noticia}")
def editar_noticia(id_noticia: int, datos: NoticiaUpdate):
    """Edita una noticia existente."""
    query = """
        UPDATE noticia
        SET titulo = %s,
            contenido = %s,
            imagen = %s,
            estado = %s,
            id_categoria = %s
        WHERE id_noticia = %s;
    """

    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            query,
            (
                datos.titulo,
                datos.contenido,
                datos.imagen,
                datos.estado,
                datos.id_categoria,
                id_noticia,
            ),
        )
        connection.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Noticia no encontrada")

        return {"mensaje": "Noticia actualizada correctamente"}
    except HTTPException:
        raise
    except Exception as error:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Error al editar noticia: {error}")
    finally:
        cursor.close()
        connection.close()


@router.delete("/{id_noticia}")
def eliminar_noticia(id_noticia: int):
    """Elimina una noticia por ID."""
    query = "DELETE FROM noticia WHERE id_noticia = %s;"

    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(query, (id_noticia,))
        connection.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Noticia no encontrada")

        return {"mensaje": "Noticia eliminada correctamente"}
    except HTTPException:
        raise
    except Exception as error:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Error al eliminar noticia: {error}")
    finally:
        cursor.close()
        connection.close()
