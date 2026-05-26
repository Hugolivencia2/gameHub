import mysql.connector
from mysql.connector import Error

# Configuración de conexión con MySQL.
# IMPORTANTE: cambia user/password si tu instalación usa otros datos.
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "88M28r22-",
    "database": "gamehub",
    "port": 3306,
}


def get_connection():
    """
    Crea y devuelve una conexión activa con la base de datos MySQL.
    Cada endpoint abre una conexión, ejecuta su consulta y la cierra.
    """
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as error:
        raise RuntimeError(f"Error al conectar con MySQL: {error}")
