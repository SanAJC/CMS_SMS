from typing import List
from core.ports.repository import ContactoRepository
from core.models.contacto import Contacto

class ContactoService:

    def __init__(self, repo: ContactoRepository):
        self.repo = repo

    def upload_contacts_from_csv(self, file_content: str) -> List[Contacto]:
        contactos = []
        lines = file_content.split("\n")
        
        # Detectar el delimitador (coma o punto y coma)
        delimiter = ","
        if lines and ";" in lines[0]:
            delimiter = ";"
        
        for i, row in enumerate(lines):
            # Saltar líneas vacías
            if not row.strip():
                continue
            
            # Saltar la primera línea si parece un encabezado
            if i == 0 and ("nombre" in row.lower() or "name" in row.lower()):
                continue
            
            # Intentar parsear la línea
            parts = row.split(delimiter)
            
            # Validar que tenga exactamente 2 columnas
            if len(parts) != 2:
                print(f"⚠️ Línea {i+1} ignorada (formato incorrecto): {row}")
                continue
            
            nombre, telefono = parts
            nombre = nombre.strip()
            telefono = telefono.strip()
            
            # Validar que no estén vacíos
            if not nombre or not telefono:
                print(f"⚠️ Línea {i+1} ignorada (campos vacíos): {row}")
                continue
            
            try:
                contact = Contacto(nombre, telefono)
                contact.validar_telefono()
                self.repo.save(contact)
                contactos.append(contact)
            except Exception as e:
                print(f"⚠️ Error en línea {i+1}: {str(e)}")
                continue
        
        return contactos

    def list_contacts(self):
        return self.repo.list_all()