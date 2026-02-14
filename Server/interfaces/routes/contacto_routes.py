from fastapi import APIRouter, UploadFile, File
from adapters.persistence.contacto_repo import SqlContactoRepository
from core.services.contacto_service import ContactoService
from interfaces.schemas.contacto_schema import ContactoOut
from adapters.auth.auth_dependency import get_current_user
from fastapi import Depends
from adapters.persistence.db import engine
router = APIRouter()

repo = SqlContactoRepository()
service = ContactoService(repo)

@router.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    # Intentar decodificar con diferentes codificaciones
    raw_content = await file.read()
    
    # Intentar UTF-8 primero, luego Latin-1 (ISO-8859-1) que es común en Excel español
    try:
        content = raw_content.decode("utf-8")
    except UnicodeDecodeError:
        try:
            content = raw_content.decode("latin-1")
        except UnicodeDecodeError:
            content = raw_content.decode("cp1252")  # Windows-1252
    
    contactos = service.upload_contacts_from_csv(content)
    return [ContactoOut.from_orm(c) for c in contactos]

@router.get("/")
def list_contacts(user_id: str = Depends(get_current_user)):
    contactos = service.list_contacts()
    return [ContactoOut.from_orm(c) for c in contactos]