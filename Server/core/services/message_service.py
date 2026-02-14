from core.models.message import Message
from core.ports.message_repository import MessageRepository
from core.ports.repository import ContactoRepository


class MessageService:

    def __init__(
        self,
        message_repo: MessageRepository,
        contact_repo: ContactoRepository
    ):
        self.message_repo = message_repo
        self.contact_repo = contact_repo

    def create_message(self, content: str, contact_id: str, user_id: str) -> Message:
        # Verificamos que el contacto exista
        contact = self.contact_repo.get_by_id(contact_id)
        if not contact:
            raise ValueError("El contacto no existe")

        message = Message(
            content=content,
            contact_id=contact_id,
            user_id=user_id
        )

        return self.message_repo.create(message)

    def list_user_messages(self, user_id: str):
        return self.message_repo.get_by_user(user_id)