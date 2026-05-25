# Archivo: routers/comentarios.py

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime
# Importamos la barrera de seguridad desde tu otro archivo
from routers.usuarios import obtener_usuario_autenticado, usuarios_db

router = APIRouter(prefix="/api/comentarios", tags=["Comentarios"])

# 1. BASE DE DATOS SIMULADA DE COMENTARIOS
# articulo_id conecta el comentario con una noticia específica
comentarios_db = [
    {
        "id": 1, 
        "articulo_id": 1, 
        "usuario_id": 2, 
        "autor": "jugador99", 
        "texto": "¡Tengo muchísimas ganas de que salga este juego!", 
        "fecha": "2026-05-25 10:00:00"
    }
]

# 2. MODELO DE DATOS (Lo que envía React)
class ComentarioCreate(BaseModel):
    articulo_id: int
    texto: str

# 3. ENDPOINT: Leer los comentarios de un artículo
@router.get("/{articulo_id}")
def obtener_comentarios_por_articulo(articulo_id: int):
    # Filtramos solo los comentarios que pertenezcan a la noticia solicitada
    comentarios_articulo = [c for c in comentarios_db if c["articulo_id"] == articulo_id]
    return comentarios_articulo

# 4. ENDPOINT: Crear un nuevo comentario (¡Protegido con Token!)
@router.post("/")
def crear_comentario(datos: ComentarioCreate, usuario_id: int = Depends(obtener_usuario_autenticado)):
    
    # Buscamos el nombre del autor usando el ID que nos ha dado el Token
    nombre_autor = "Usuario Desconocido"
    for u in usuarios_db:
        if u["id"] == usuario_id:
            nombre_autor = u["username"]
            break
            
    # Creamos el nuevo comentario
    nuevo_comentario = {
        "id": len(comentarios_db) + 1,
        "articulo_id": datos.articulo_id,
        "usuario_id": usuario_id,
        "autor": nombre_autor,
        "texto": datos.texto,
        # Guardamos la fecha y hora exacta del sistema
        "fecha": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    # Lo guardamos en la memoria
    comentarios_db.append(nuevo_comentario)
    
    return {"mensaje": "Comentario publicado", "comentario": nuevo_comentario}