from sqlmodel import SQLModel, Field, Session, select
from core.ports.repository import ContactoRepository
from adapters.persistence.db import engine

class ContactoORM(SQLModel, table=True):
    id: str = Field(primary_key=True)
    nombre: str
    telefono: str

class SqlContactoRepository(ContactoRepository):

    def save(self, contacto):
        with Session(engine) as session:
            orm = ContactoORM(id=contacto.id, nombre=contacto.nombre, telefono=contacto.telefono)
            session.add(orm)
            session.commit()

    def get_by_id(self, contact_id: str):
        with Session(engine) as session:
            return session.get(ContactoORM, contact_id)

    def list_all(self):
        with Session(engine) as session:
            statement = select(ContactoORM)
            result = session.exec(statement).all()
            return result