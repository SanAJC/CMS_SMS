from sqlmodel import SQLModel, Field, Session, select
from datetime import datetime
from core.models.message import Message
from core.ports.message_repository import MessageRepository
from adapters.persistence.db import engine


class MessageORM(SQLModel, table=True):
    __tablename__ = "messages"

    id: str = Field(primary_key=True)
    content: str
    contact_id: str
    user_id: str
    status: str = Field(default="pending")
    created_at: datetime


class SqlMessageRepository(MessageRepository):

    def create(self, message: Message) -> Message:
        with Session(engine) as session:
            orm = MessageORM(
                id=message.id,
                content=message.content,
                contact_id=message.contact_id,
                user_id=message.user_id,
                status=message.status,
                created_at=message.created_at
            )
            session.add(orm)
            session.commit()
            return message

    def get_by_user(self, user_id: str):
        with Session(engine) as session:
            statement = select(MessageORM).where(MessageORM.user_id == user_id)
            results = session.exec(statement).all()
            return results

    def update_status(self, message_id: str, status: str):
        with Session(engine) as session:
            orm = session.get(MessageORM, message_id)
            if orm:
                orm.status = status
                session.add(orm)
                session.commit()