from fastapi import APIRouter, HTTPException
from database import get_connection  # Reutilizamos tu conexión mágica a MySQL
import mysql.connector

router = APIRouter(prefix="/api/evento", tags=["Evento"])

@router.get("/")
def obtener_todos_los_eventos():
    try:
        # 1. Abrimos conexión con la base de datos
        connection = get_connection()
        cursor = connection.cursor(dictionary=True) # dictionary=True nos da claves como 'titulo', 'fecha'
        
        # 2. Lanzamos la consulta SQL (Asegúrate de que los nombres de columna coincidan con tu tabla)
        query = "SELECT id_evento, nombre, fecha_inicio, tipo_evento FROM evento"
        cursor.execute(query)
        resultados = cursor.fetchall()
        
        # 3. Cerramos cursores y conexiones de forma segura
        cursor.close()
        connection.close()
        
        # 4. Formateamos las fechas de tipo 'date' de MySQL a texto 'YYYY-MM-DD' para React
        for evento in resultados:
            if hasattr(evento['fecha_inicio'], 'strftime'):
                evento['fecha_inicio'] = evento['fecha_inicio'].strftime('%Y-%m-%d')
                
        return resultados

    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Error en la consulta de MySQL: {err.msg}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")