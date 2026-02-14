from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from core.models.user import User
from core.ports.user_repository import UserRepository
from sqlmodel import Session, select


class UserORM(SQLModel, table=True):
    __tablename__ = "users"

    id: str = Field(primary_key=True)
    email: str = Field(index=True, nullable=False, unique=True)
    password_hash: str = Field(nullable=False)
    is_active: bool = Field(default=True)
    created_at: datetime


from adapters.persistence.db import engine


class SqlUserRepository(UserRepository):

    def create(self, user: User) -> User:
        with Session(engine) as session:
            orm = UserORM(
                id=user.id,
                email=user.email,
                password_hash=user.password_hash,
                is_active=user.is_active,
                created_at=user.created_at
            )
            session.add(orm)
            session.commit()
            return user

    def get_by_email(self, email: str) -> User | None:
        with Session(engine) as session:
            statement = select(UserORM).where(UserORM.email == email.lower())
            orm = session.exec(statement).first()
            if not orm:
                return None

            return User(
                id=orm.id,
                email=orm.email,
                password_hash=orm.password_hash,
                is_active=orm.is_active,
                created_at=orm.created_at
            )

    def get_by_id(self, user_id: str) -> User | None:
        with Session(engine) as session:
            orm = session.get(UserORM, user_id)
            if not orm:
                return None

            return User(
                id=orm.id,
                email=orm.email,
                password_hash=orm.password_hash,
                is_active=orm.is_active,
                created_at=orm.created_at
            )