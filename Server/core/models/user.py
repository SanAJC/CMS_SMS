from uuid import uuid4
from datetime import datetime


class User:
    def __init__(
        self,
        email: str,
        password_hash: str,
        is_active: bool = True,
        id: str | None = None,
        created_at: datetime | None = None
    ):
        self.id = id or str(uuid4())
        self.email = email.lower()
        self.password_hash = password_hash
        self.is_active = is_active
        self.created_at = created_at or datetime.utcnow()

    def deactivate(self):
        self.is_active = False