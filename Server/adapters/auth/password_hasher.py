from passlib.context import CryptContext

_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class PasswordHasher:

    @staticmethod
    def hash(password: str) -> str:
        return _pwd_context.hash(password)

    @staticmethod
    def verify(password: str, hashed: str) -> bool:
        return _pwd_context.verify(password, hashed)