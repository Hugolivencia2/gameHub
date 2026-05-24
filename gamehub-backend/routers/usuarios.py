# Archivo: routers/usuarios.py

from fastapi import APIRouter

# Creamos el enrutador específico para todo lo relacionado con usuarios
router = APIRouter(prefix="/api/usuarios", tags=["Usuarios"])

# 1. NUESTROS DATOS FALSOS (Mock Data)
usuarios_db = [
    {"id": 1, "username": "admin_hugo", "email": "hugo@gamehub.com", "rol": "Admin"},
    {"id": 2, "username": "jugador99", "email": "jugador@test.com", "rol": "Suscriptor"}
]

# 2. NUESTRO PRIMER ENDPOINT
@router.get("/")
def obtener_todos_los_usuarios():
    # En el futuro, aquí harás un "SELECT * FROM usuarios"
    return usuarios_db

@router.get("/{usuario_id}")
def obtener_usuario_por_id(usuario_id: int):
    # Buscamos en nuestra lista falsa
    for u in usuarios_db:
        if u["id"] == usuario_id:
            return u
    return {"error": "Usuario no encontrado"}

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import jwt
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/usuarios", tags=["Usuarios"])

# --- (Mantén aquí tu lista usuarios_db y tus rutas GET de antes) ---

# 1. Definimos la "plantilla" de lo que React nos va a enviar
class LoginData(BaseModel):
    email: str
    password: str

# Configuración del Token JWT (Secreto y algoritmo)
SECRET_KEY = "super_secreto_gamehub_no_compartir"
ALGORITHM = "HS256"

# 2. El endpoint de Login
@router.post("/login")
def iniciar_sesion(datos: LoginData):
    # Simulamos buscar en la base de datos
    usuario_encontrado = None
    for u in usuarios_db:
        if u["email"] == datos.email:
            usuario_encontrado = u
            break
            
    # Si el usuario no existe (y simulamos que todas las contraseñas son "1234")
    if not usuario_encontrado or datos.password != "1234":
        raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")
        
    # Si es correcto, creamos el pase VIP (Token JWT)
    expiracion = datetime.utcnow() + timedelta(hours=2) # El token dura 2 horas
    datos_token = {
        "sub": str(usuario_encontrado["id"]),
        "rol": usuario_encontrado["rol"],
        "exp": expiracion
    }
    
    token = jwt.encode(datos_token, SECRET_KEY, algorithm=ALGORITHM)
    
    # Devolvemos el token al frontend
    return {"access_token": token, "token_type": "bearer", "usuario": usuario_encontrado}