from core.models.user import User
from core.ports.user_repository import UserRepository

class AuthService:

    def __init__(self,user_repo:UserRepository):
        self.user_repo = user_repo

    def register(self, email: str, password_hash: str) -> User:
        existing_user = self.user_repo.get_by_email(email)
        if existing_user:
            raise ValueError("El usuario ya existe")

        user = User(email=email, password_hash=password_hash)
        return self.user_repo.create(user)

    def authenticate(self, email: str, password: str, hasher) -> User:
        user = self.user_repo.get_by_email(email)
        if not user:
            print(f"❌ Usuario no encontrado: {email}")
            raise ValueError("Credenciales inválidas")

        print(f"✅ Usuario encontrado: {email}")
        print(f"🔐 Verificando contraseña...")
        
        if not hasher.verify(password, user.password_hash):
            print(f"❌ Contraseña incorrecta")
            raise ValueError("Credenciales inválidas, Password Incorrecta")

        print(f"✅ Contraseña correcta")
        
        if not user.is_active:
            print(f"❌ Usuario inactivo")
            raise ValueError("Usuario inactivo")
        
        print(f"✅ Usuario activo, login exitoso")
        return user