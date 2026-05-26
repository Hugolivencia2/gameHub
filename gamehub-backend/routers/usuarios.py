from fastapi import APIRouter, HTTPException, Header, Depends
from pydantic import BaseModel
import jwt
from datetime import datetime, timedelta

# 1. CONFIGURACIÓN INICIAL
router = APIRouter(prefix="/api/usuarios", tags=["Usuarios"])

SECRET_KEY = "super_secreto_gamehub_no_compartir"
ALGORITHM = "HS256"

# 2. DATOS SIMULADOS (Mock Data)
usuarios_db = [
    {"id": 1, "username": "admin_hugo", "email": "hugo@gamehub.com", "rol": "Admin"},
    {"id": 2, "username": "jugador99", "email": "jugador@test.com", "rol": "Suscriptor"}
]

# 3. MODELOS DE DATOS (Pydantic)
class LoginData(BaseModel):
    email: str
    password: str

class PerfilUpdateData(BaseModel):
    username: str
    website: str | None = None
    sobre_mi: str | None = None
    
class RegistroData(BaseModel):
    username: str
    email: str
    password: str

# 4. DEPENDENCIAS DE SEGURIDAD (Las barreras invisibles)

def obtener_usuario_autenticado(authorization: str = Header(...)):
    """Valida el Token y devuelve el ID del usuario."""
    try:
        tipo_token, token = authorization.split(" ")
        if tipo_token.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Tipo de autenticación inválido")
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return int(payload.get("sub"))
        
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, ValueError, IndexError):
        raise HTTPException(status_code=401, detail="Pase VIP (Token) inválido, expirado o ausente")

def verificar_admin(authorization: str = Header(...)):
    """Valida el Token y comprueba que el rol sea Admin."""
    try:
        tipo_token, token = authorization.split(" ")
        if tipo_token.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Tipo de autenticación inválido")
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        rol_usuario = payload.get("rol")
        
        # AQUÍ ESTÁ LA MAGIA DEL RBAC (Control de Acceso por Roles)
        if rol_usuario != "Admin":
            raise HTTPException(status_code=403, detail="Acceso denegado: Se requieren permisos de Administrador")
            
        return int(payload.get("sub"))
        
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, ValueError, IndexError):
        raise HTTPException(status_code=401, detail="Token inválido o expirado")


# 5. ENDPOINTS (Rutas de la API)

@router.get("/")
def obtener_todos_los_usuarios():
    return usuarios_db

@router.put("/perfil")
def actualizar_perfil(datos: PerfilUpdateData, usuario_id: int = Depends(obtener_usuario_autenticado)):
    usuario_encontrado = None
    for u in usuarios_db:
        if u["id"] == usuario_id:
            usuario_encontrado = u
            break

    if not usuario_encontrado:
        raise HTTPException(status_code=404, detail="El usuario no existe")

    usuario_encontrado["username"] = datos.username
    usuario_encontrado["website"] = datos.website
    usuario_encontrado["sobre_mi"] = datos.sobre_mi

    return {"mensaje": "Perfil actualizado", "usuario": usuario_encontrado}

@router.get("/perfil")
def ver_mi_perfil(usuario_id: int = Depends(obtener_usuario_autenticado)):
    # Buscamos al usuario en tu base de datos simulada
    usuario_encontrado = None
    for u in usuarios_db:
        if u["id"] == usuario_id:
            usuario_encontrado = u
            break
            
    if not usuario_encontrado:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Devolvemos los datos exactamente con los nombres que espera tu Dashboard.jsx
    return {
        "mensaje": f"¡Bienvenido a la zona VIP, {usuario_encontrado['username']}!",
        "email_registrado": usuario_encontrado["email"],
        "biografia": usuario_encontrado.get("sobre_mi", "Sin biografía"),
        "rol": usuario_encontrado["rol"]
    }
    
@router.post("/registro")
def registrar_usuario(datos: RegistroData):
    # 1. Comprobamos si el email ya existe para no crear duplicados
    for u in usuarios_db:
        if u["email"] == datos.email:
            raise HTTPException(status_code=400, detail="Este email ya está registrado")
            
    # 2. Creamos el nuevo usuario simulando una base de datos
    nuevo_id = len(usuarios_db) + 1
    nuevo_usuario = {
        "id": nuevo_id,
        "username": datos.username,
        "email": datos.email,
        "rol": "Suscriptor" # Por defecto, los nuevos son usuarios normales
    }
    
    # Añadimos el usuario a nuestra lista simulada
    usuarios_db.append(nuevo_usuario)
    
    return {"mensaje": "Usuario creado correctamente", "usuario": nuevo_usuario}

@router.get("/{usuario_id}")
def obtener_usuario_por_id(usuario_id: int):
    for u in usuarios_db:
        if u["id"] == usuario_id:
            return u
    raise HTTPException(status_code=404, detail="Usuario no encontrado")

@router.post("/login")
def iniciar_sesion(datos: LoginData):
    usuario_encontrado = None
    for u in usuarios_db:
        if u["email"] == datos.email:
            usuario_encontrado = u
            break
            
    if not usuario_encontrado or datos.password != "1234":
        raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")
        
    expiracion = datetime.utcnow() + timedelta(hours=2)
    datos_token = {
        "sub": str(usuario_encontrado["id"]),
        "rol": usuario_encontrado["rol"],
        "exp": expiracion
    }
    
    token = jwt.encode(datos_token, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer", "usuario": usuario_encontrado}



# Endpoint protegido SOLO para Administradores
@router.delete("/noticias/{id}")
def borrar_noticia(id: int, admin_id: int = Depends(verificar_admin)):
    # Aquí iría la lógica de borrar la noticia de la base de datos
    return {"mensaje": f"Noticia {id} borrada con éxito por el admin {admin_id}"}