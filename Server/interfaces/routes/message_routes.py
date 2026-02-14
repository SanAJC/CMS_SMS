from fastapi import APIRouter, Depends, HTTPException
from adapters.persistence.message_repo import SqlMessageRepository
from adapters.persistence.contacto_repo import SqlContactoRepository
from core.services.message_service import MessageService
from interfaces.schemas.message_schema import MessageCreate
from adapters.auth.auth_dependency import get_current_user
from adapters.persistence.db import engine
router = APIRouter()

message_repo = SqlMessageRepository()
contact_repo = SqlContactoRepository()
service = MessageService(message_repo, contact_repo)


@router.post("/")
def create_message(
    data: MessageCreate,
    user_id: str = Depends(get_current_user)
):
    try:
        message = service.create_message(
            content=data.content,
            contact_id=data.contact_id,
            user_id=user_id
        )
        return message
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/")
def list_messages(
    user_id: str = Depends(get_current_user)
):
    return service.list_user_messages(user_id)