from fastapi import APIRouter, HTTPException
from adapters.persistence.user_repo import SqlUserRepository
from adapters.auth.password_hasher import PasswordHasher
from adapters.auth.jwt_handler import JWTHandler
from core.services.auth_service import AuthService
from interfaces.schemas.auth_schema import (
    RegisterRequest,
    LoginRequest,
    TokenResponse
)
from adapters.persistence.db import engine

router = APIRouter()

repo = SqlUserRepository()
auth_service = AuthService(repo)

@router.post("/register", response_model=TokenResponse)
def register(data: RegisterRequest):
    try:
        # Validar longitud antes de hashear
        if len(data.password.encode('utf-8')) > 72:
            raise HTTPException(
                status_code=400, 
                detail="La contraseña es demasiado larga (máximo 72 caracteres)"
            )
        
        hashed = PasswordHasher.hash(data.password)
        user = auth_service.register(data.email, hashed)
        token = JWTHandler.create_access_token({"sub": user.id})
        return {"access_token": token}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest):
    try:
        user = auth_service.authenticate(
            data.email,
            data.password,
            PasswordHasher
        )
        token = JWTHandler.create_access_token({"sub": user.id})
        return {"access_token": token}
    except ValueError:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")