from fastapi import APIRouter, HTTPException, Query
from database import get_connection

router = APIRouter(prefix="/api/ranking", tags=["Ranking"])


@router.get("/")
def obtener_ranking(orden: str = Query("comunidad", pattern="^(comunidad|prensa|titulo)$")):
    """
    Devuelve el catálogo/ranking de videojuegos desde MySQL.
    Parámetro orden:
    - comunidad: ordena por nota de comunidad descendente.
    - prensa: ordena por nota de prensa descendente.
    - titulo: ordena alfabéticamente.
    """
    order_by = {
        "comunidad": "nota_comunidad DESC, nota_prensa DESC",
        "prensa": "nota_prensa DESC, nota_comunidad DESC",
        "titulo": "titulo ASC",
    }[orden]

    query = f"""
        SELECT
            id_videojuego,
            titulo,
            descripcion,
            imagen,
            nota_prensa,
            nota_comunidad,
            fecha_lanzamiento,
            plataforma
        FROM videojuego
        ORDER BY {order_by};
    """

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query)
        videojuegos = cursor.fetchall()
        return videojuegos
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error al obtener ranking: {error}")
    finally:
        cursor.close()
        connection.close()
