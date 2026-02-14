from uuid import uuid4
from datetime import datetime

class Message:

    def __init__(
        self,
        content: str,
        contact_id: str,
        user_id: str,
        status: str = "pending",
        id: str | None = None,
        created_at: datetime | None = None
    ):
        self.id = id or str(uuid4())
        self.content = content
        self.contact_id = contact_id
        self.user_id = user_id
        self.status = status  # pending, sent, failed
        self.created_at = created_at or datetime.utcnow()

    def mark_as_sent(self):
        self.status = "sent"

    def mark_as_failed(self):
        self.status = "failed"