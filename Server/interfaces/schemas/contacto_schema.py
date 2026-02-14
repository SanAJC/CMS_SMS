from pydantic import BaseModel, ConfigDict

class ContactoIn(BaseModel):
    nombre: str
    telefono: str

class ContactoOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    nombre: str
    telefono: str