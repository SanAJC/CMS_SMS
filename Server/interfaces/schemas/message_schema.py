from pydantic import BaseModel


class MessageCreate(BaseModel):
    content: str
    contact_id: str


class MessageOut(BaseModel):
    id: str
    content: str
    contact_id: str
    user_id: str
    status: str