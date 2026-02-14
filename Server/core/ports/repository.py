from abc import ABC, abstractmethod
from typing import List

class ContactoRepository(ABC):

    @abstractmethod
    def save(self, contacto) -> None:
        ...

    @abstractmethod
    def list_all(self) -> List:
        ...