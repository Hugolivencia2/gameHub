from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from database import get_connection

router = APIRouter(prefix="/api/multimedia", tags=["Multimedia"])


class MultimediaCreate(BaseModel):
    titulo: str
    descripcion: Optional[str] = None
    tipo: str
    url_externa: str
    miniatura: Optional[str] = None


class MultimediaUpdate(BaseModel):
    titulo: str
    descripcion: Optional[str] = None
    tipo: str
    url_externa: str
    miniatura: Optional[str] = None


@router.get("/")
def obtener_multimedia():
    """Devuelve todos los contenidos multimedia."""
    query = """
        SELECT
            id_multimedia,
            titulo,
            descripcion,
            tipo,
            url_externa,
            miniatura,
            fecha_publicacion
        FROM multimedia
        ORDER BY fecha_publicacion DESC;
    """

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query)
        return cursor.fetchall()
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error al obtener multimedia: {error}")
    finally:
        cursor.close()
        connection.close()


@router.post("/")
def crear_multimedia(datos: MultimediaCreate):
    """Crea un nuevo contenido multimedia."""
    query = """
        INSERT INTO multimedia (titulo, descripcion, tipo, url_externa, miniatura)
        VALUES (%s, %s, %s, %s, %s);
    """

    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            query,
            (datos.titulo, datos.descripcion, datos.tipo, datos.url_externa, datos.miniatura),
        )
        connection.commit()
        return {"mensaje": "Contenido multimedia creado correctamente", "id": cursor.lastrowid}
    except Exception as error:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear multimedia: {error}")
    finally:
        cursor.close()
        connection.close()


@router.put("/{id_multimedia}")
def editar_multimedia(id_multimedia: int, datos: MultimediaUpdate):
    """Edita un contenido multimedia existente."""
    query = """
        UPDATE multimedia
        SET titulo = %s,
            descripcion = %s,
            tipo = %s,
            url_externa = %s,
            miniatura = %s
        WHERE id_multimedia = %s;
    """

    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            query,
            (
                datos.titulo,
                datos.descripcion,
                datos.tipo,
                datos.url_externa,
                datos.miniatura,
                id_multimedia,
            ),
        )
        connection.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Contenido multimedia no encontrado")

        return {"mensaje": "Contenido multimedia actualizado correctamente"}
    except HTTPException:
        raise
    except Exception as error:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Error al editar multimedia: {error}")
    finally:
        cursor.close()
        connection.close()


@router.delete("/{id_multimedia}")
def eliminar_multimedia(id_multimedia: int):
    """Elimina un contenido multimedia por ID."""
    query = "DELETE FROM multimedia WHERE id_multimedia = %s;"

    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(query, (id_multimedia,))
        connection.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Contenido multimedia no encontrado")

        return {"mensaje": "Contenido multimedia eliminado correctamente"}
    except HTTPException:
        raise
    except Exception as error:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Error al eliminar multimedia: {error}")
    finally:
        cursor.close()
        connection.close()
