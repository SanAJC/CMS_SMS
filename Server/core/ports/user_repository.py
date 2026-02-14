from abc import ABC, abstractmethod
from core.models.user import User


class UserRepository(ABC):

    @abstractmethod
    def create(self, user: User) -> User:
        ...

    @abstractmethod
    def get_by_email(self, email: str) -> User | None:
        ...

    @abstractmethod
    def get_by_id(self, user_id: str) -> User | None:
        ...