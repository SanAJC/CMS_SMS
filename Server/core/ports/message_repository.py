from abc import ABC, abstractmethod
from core.models.message import Message
from typing import List


class MessageRepository(ABC):

    @abstractmethod
    def create(self, message: Message) -> Message:
        ...

    @abstractmethod
    def get_by_user(self, user_id: str) -> List[Message]:
        ...

    @abstractmethod
    def update_status(self, message_id: str, status: str) -> None:
        ...
