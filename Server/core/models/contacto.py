from typing import Optional
from uuid import uuid4

class Contacto:
    def __init__(self, nombre: str, telefono: str, id: str = None):
        self.id = id or str(uuid4())
        self.nombre = nombre
        self.telefono = telefono

    def validar_telefono(self):
        if not self.telefono.isnumeric():
            raise ValueError("El teléfono debe contener solo números")
        if len(self.telefono) < 7:
            raise ValueError("Teléfono demasiado corto")