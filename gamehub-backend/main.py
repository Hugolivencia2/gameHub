# Archivo: main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importamos tu enrutador
from routers import usuarios

app = FastAPI(title="Game-Hub API")

# Configuración CORS (Vital para que el frontend no dé errores de conexión)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En producción pondremos "http://localhost:5173"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conectamos el módulo de usuarios a la aplicación principal
app.include_router(usuarios.router)

@app.get("/")
def ruta_raiz():
    return {"mensaje": "¡Servidor Backend de Game-Hub funcionando!"}