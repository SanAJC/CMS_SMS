# 🏗️ Arquitectura Hexagonal - SMS CMS Backend

## 📐 Diagrama del Hexágono

```
                    ┌─────────────────────────────────────────────────────────┐
                    │                  MUNDO EXTERIOR                         │
                    │  (Clientes HTTP, Bases de Datos, APIs Externas)        │
                    └─────────────────────────────────────────────────────────┘
                                            │
                    ┌───────────────────────┴───────────────────────┐
                    │                                               │
                    ▼                                               ▼
        ┌───────────────────────┐                       ┌───────────────────────┐
        │  ADAPTADORES ENTRADA  │                       │  ADAPTADORES SALIDA   │
        │   (Driving/Primary)   │                       │   (Driven/Secondary)  │
        └───────────────────────┘                       └───────────────────────┘
                    │                                               │
                    │                                               │
        ┌───────────▼───────────┐                       ┌───────────▼───────────┐
        │   interfaces/         │                       │   adapters/           │
        │                       │                       │                       │
        │   ┌─────────────┐     │                       │   ┌─────────────┐     │
        │   │   routes/   │     │                       │   │persistence/ │     │
        │   │  - auth     │     │                       │   │  - db.py    │     │
        │   │  - contacto │     │                       │   │  - *_repo   │     │
        │   │  - message  │     │                       │   └─────────────┘     │
        │   └─────────────┘     │                       │                       │
        │                       │                       │   ┌─────────────┐     │
        │   ┌─────────────┐     │                       │   │   auth/     │     │
        │   │  schemas/   │     │                       │   │  - jwt      │     │
        │   │  - auth     │     │                       │   │  - password │     │
        │   │  - contacto │     │                       │   │  - oauth2   │     │
        │   │  - message  │     │                       │   └─────────────┘     │
        │   └─────────────┘     │                       │                       │
        └───────────┬───────────┘                       └───────────┬───────────┘
                    │                                               │
                    │              ┌─────────────┐                  │
                    └──────────────►             ◄──────────────────┘
                                   │             │
                    ┌──────────────►    CORE     ◄──────────────────┐
                    │              │  (HEXÁGONO) │                  │
                    │              │             │                  │
                    │              └─────────────┘                  │
                    │                                               │
        ┌───────────▼───────────┐                       ┌───────────▼───────────┐
        │   core/services/      │                       │   core/ports/         │
        │                       │                       │                       │
        │   ┌─────────────┐     │                       │   ┌─────────────┐     │
        │   │ auth_       │     │                       │   │ repository  │     │
        │   │ service.py  │     │                       │   │ (interfaces)│     │
        │   └─────────────┘     │                       │   └─────────────┘     │
        │                       │                       │                       │
        │   ┌─────────────┐     │                       │   ┌─────────────┐     │
        │   │ contacto_   │     │                       │   │ user_       │     │
        │   │ service.py  │     │                       │   │ repository  │     │
        │   └─────────────┘     │                       │   └─────────────┘     │
        │                       │                       │                       │
        │   ┌─────────────┐     │                       │   ┌─────────────┐     │
        │   │ message_    │     │                       │   │ message_    │     │
        │   │ service.py  │     │                       │   │ repository  │     │
        │   └─────────────┘     │                       │   └─────────────┘     │
        └───────────────────────┘                       └───────────────────────┘
                    │                                               │
                    │              ┌─────────────┐                  │
                    └──────────────►             ◄──────────────────┘
                                   │             │
                                   │core/models/ │
                                   │             │
                                   │  - User     │
                                   │  - Contacto │
                                   │  - Message  │
                                   │             │
                                   └─────────────┘
```

---

## 🎯 Capas de la Arquitectura

### 1️⃣ CORE (Centro del Hexágono) - Lógica de Negocio Pura

**📁 Ubicación:** `core/`

#### 🔷 Models (`core/models/`)
Entidades del dominio con lógica de negocio

```
core/models/
├── user.py          → Modelo de Usuario
├── contacto.py      → Modelo de Contacto (con validación de teléfono)
└── message.py       → Modelo de Mensaje
```

**Características:**
- ✅ Lógica de negocio pura
- ✅ Sin dependencias externas
- ✅ Validaciones del dominio
- ❌ NO conoce bases de datos
- ❌ NO conoce HTTP/FastAPI

#### 🔷 Services (`core/services/`)
Casos de uso y orquestación de lógica

```
core/services/
├── auth_service.py      → Registro, autenticación
├── contacto_service.py  → Gestión de contactos, upload CSV
└── message_service.py   → Creación y listado de mensajes
```

**Características:**
- ✅ Orquesta la lógica de negocio
- ✅ Usa los ports (interfaces)
- ✅ Independiente de frameworks
- ❌ NO sabe de HTTP, SQL, JWT directamente

#### 🔷 Ports (`core/ports/`)
Interfaces (contratos) que definen qué necesita el core

```
core/ports/
├── repository.py           → Interface ContactoRepository
├── user_repository.py      → Interface UserRepository
└── message_repository.py   → Interface MessageRepository
```

**Características:**
- ✅ Define CONTRATOS (interfaces abstractas)
- ✅ El core depende de estas interfaces
- ✅ Los adaptadores IMPLEMENTAN estas interfaces
- 🎯 **Inversión de Dependencias**

---

### 2️⃣ ADAPTADORES DE ENTRADA (Driving Adapters)

**📁 Ubicación:** `interfaces/`

Traducen peticiones externas → llamadas al core

#### 🌐 Routes (`interfaces/routes/`)
Endpoints HTTP que reciben peticiones

```
interfaces/routes/
├── auth_routes.py      → POST /auth/register, /auth/login
├── contacto_routes.py  → POST /contacts/upload, GET /contacts
└── message_routes.py   → POST /messages, GET /messages
```

**Responsabilidades:**
- ✅ Recibir peticiones HTTP
- ✅ Validar con schemas
- ✅ Llamar a los services del core
- ✅ Manejar errores HTTP
- ✅ Aplicar autenticación (Depends)

#### 📋 Schemas (`interfaces/schemas/`)
DTOs para validación y serialización

```
interfaces/schemas/
├── auth_schema.py      → RegisterRequest, LoginRequest, TokenResponse
├── contacto_schema.py  → ContactoIn, ContactoOut
└── message_schema.py   → MessageCreate, MessageOut
```

**Responsabilidades:**
- ✅ Validar datos de entrada (Pydantic)
- ✅ Formatear datos de salida
- ✅ Proteger el dominio
- ✅ Documentación automática (OpenAPI)

---

### 3️⃣ ADAPTADORES DE SALIDA (Driven Adapters)

**📁 Ubicación:** `adapters/`

Implementan los ports del core para comunicarse con el exterior

#### 💾 Persistence (`adapters/persistence/`)
Implementación de repositorios para base de datos

```
adapters/persistence/
├── db.py              → Configuración del engine SQLModel
├── user_repo.py       → SqlUserRepository (implementa UserRepository)
├── contacto_repo.py   → SqlContactoRepository (implementa ContactoRepository)
└── message_repo.py    → SqlMessageRepository (implementa MessageRepository)
```

**Responsabilidades:**
- ✅ Implementar las interfaces de `core/ports/`
- ✅ Traducir modelos de dominio ↔ ORM
- ✅ Ejecutar queries SQL
- ✅ Manejar sesiones de BD

**Ejemplo de implementación:**
```python
# core/ports/repository.py (Interface)
class ContactoRepository(ABC):
    @abstractmethod
    def save(self, contacto): pass
    
    @abstractmethod
    def get_by_id(self, id: str): pass

# adapters/persistence/contacto_repo.py (Implementación)
class SqlContactoRepository(ContactoRepository):
    def save(self, contacto):
        # Implementación con SQLModel
        with Session(engine) as session:
            orm = ContactoORM(...)
            session.add(orm)
            session.commit()
```

#### 🔐 Auth (`adapters/auth/`)
Implementación de autenticación y seguridad

```
adapters/auth/
├── jwt_handler.py       → Crear y validar tokens JWT
├── password_hasher.py   → Hash y verificación de contraseñas (bcrypt)
└── auth_dependency.py   → OAuth2 y extracción de usuario actual
```

**Responsabilidades:**
- ✅ Generar tokens JWT
- ✅ Hashear contraseñas
- ✅ Validar tokens
- ✅ Extraer usuario del token

---

## 🔄 Flujo de Datos Completo

### Ejemplo: Crear un Mensaje

```
1. CLIENTE
   POST /messages
   Body: {"content": "Hola", "contact_id": "123"}
   Header: Authorization: Bearer eyJ...
   
   ↓

2. ADAPTADOR DE ENTRADA (interfaces/routes/message_routes.py)
   @router.post("/")
   def create_message(data: MessageCreate, user_id: str = Depends(get_current_user))
   
   ↓ Valida con schema
   
3. SCHEMA (interfaces/schemas/message_schema.py)
   MessageCreate valida que content y contact_id existan
   
   ↓ Extrae user_id del token
   
4. AUTH ADAPTER (adapters/auth/auth_dependency.py)
   get_current_user() → valida JWT → retorna user_id
   
   ↓ Llama al servicio
   
5. SERVICE (core/services/message_service.py)
   service.create_message(content, contact_id, user_id)
   - Verifica que el contacto exista (usa port)
   - Crea el modelo Message
   - Guarda en repositorio (usa port)
   
   ↓ Usa port (interface)
   
6. PORT (core/ports/message_repository.py)
   MessageRepository.create(message)
   
   ↓ Implementación concreta
   
7. ADAPTADOR DE SALIDA (adapters/persistence/message_repo.py)
   SqlMessageRepository.create(message)
   - Convierte Message → MessageORM
   - Ejecuta INSERT en PostgreSQL
   
   ↓
   
8. BASE DE DATOS
   INSERT INTO messages VALUES (...)
   
   ↓ Retorna
   
9. RESPUESTA AL CLIENTE
   {"id": "abc", "content": "Hola", "status": "pending", ...}
```

---

## 🎨 Principios Aplicados

### 1. Dependency Inversion (Inversión de Dependencias)
```
❌ ANTES (Acoplamiento)
Service → SqlRepository (depende de implementación concreta)

✅ AHORA (Desacoplamiento)
Service → RepositoryInterface ← SqlRepository
         (depende de abstracción)
```

### 2. Separation of Concerns (Separación de Responsabilidades)
- **Core:** Lógica de negocio
- **Interfaces:** HTTP/API
- **Adapters:** BD, Auth, APIs externas

### 3. Single Responsibility (Responsabilidad Única)
- **Routes:** Solo manejan HTTP
- **Services:** Solo lógica de negocio
- **Repositories:** Solo acceso a datos
- **Schemas:** Solo validación/serialización

### 4. Open/Closed (Abierto/Cerrado)
Puedes cambiar la implementación sin tocar el core:
```
SqlContactoRepository → MongoContactoRepository
(Solo cambias el adaptador, el core no se entera)
```

---

## 📦 Estructura de Carpetas Completa

```
Server/
│
├── app/
│   ├── main.py              # 🚀 Punto de entrada, configuración FastAPI
│   └── config.py            # ⚙️ Configuración (env vars)
│
├── core/                    # 🎯 HEXÁGONO (Lógica de Negocio)
│   ├── models/              # 📦 Entidades del dominio
│   │   ├── user.py
│   │   ├── contacto.py
│   │   └── message.py
│   │
│   ├── services/            # 🔧 Casos de uso
│   │   ├── auth_service.py
│   │   ├── contacto_service.py
│   │   └── message_service.py
│   │
│   └── ports/               # 🔌 Interfaces (contratos)
│       ├── repository.py
│       ├── user_repository.py
│       └── message_repository.py
│
├── interfaces/              # 🌐 ADAPTADORES DE ENTRADA
│   ├── routes/              # 🛣️ Endpoints HTTP
│   │   ├── auth_routes.py
│   │   ├── contacto_routes.py
│   │   └── message_routes.py
│   │
│   └── schemas/             # 📋 DTOs (Pydantic)
│       ├── auth_schema.py
│       ├── contacto_schema.py
│       └── message_schema.py
│
├── adapters/                # 🔌 ADAPTADORES DE SALIDA
│   ├── persistence/         # 💾 Base de datos
│   │   ├── db.py
│   │   ├── user_repo.py
│   │   ├── contacto_repo.py
│   │   └── message_repo.py
│   │
│   └── auth/                # 🔐 Autenticación
│       ├── jwt_handler.py
│       ├── password_hasher.py
│       └── auth_dependency.py
│
├── alembic/                 # 🗄️ Migraciones de BD
│   └── versions/
│
├── tests/                   # 🧪 Tests
│   ├── api/
│   └── core/
│
├── .env                     # 🔒 Variables de entorno
├── requirements.txt         # 📚 Dependencias
└── alembic.ini             # ⚙️ Config de migraciones
```

---

## 🎓 Ventajas de Esta Arquitectura

### ✅ Testeable
```python
# Puedes testear el core sin BD ni HTTP
def test_create_message():
    mock_repo = MockMessageRepository()
    service = MessageService(mock_repo, mock_contact_repo)
    message = service.create_message("Hola", "123", "user1")
    assert message.content == "Hola"
```

### ✅ Mantenible
- Cambios en BD no afectan la lógica de negocio
- Cambios en API no afectan el core
- Cada capa tiene responsabilidades claras

### ✅ Escalable
- Puedes agregar nuevos adaptadores (GraphQL, gRPC)
- Puedes cambiar de PostgreSQL a MongoDB
- Puedes agregar cache, message queues, etc.

### ✅ Independiente de Frameworks
- El core no depende de FastAPI
- Podrías cambiar a Flask, Django, etc.
- La lógica de negocio sobrevive

---

## 🔍 Reglas de Dependencia

```
┌─────────────────────────────────────────┐
│  REGLA DE ORO:                          │
│  Las dependencias apuntan HACIA ADENTRO │
└─────────────────────────────────────────┘

Adaptadores → Core  ✅ (permitido)
Core → Adaptadores  ❌ (prohibido)

Interfaces → Services  ✅
Services → Interfaces  ❌

Services → Ports  ✅
Ports → Services  ❌
```

---

## 📚 Glosario

- **Port:** Interface/contrato que define qué necesita el core
- **Adapter:** Implementación concreta de un port
- **Driving Adapter:** Adaptador que LLAMA al core (HTTP, CLI)
- **Driven Adapter:** Adaptador LLAMADO por el core (BD, APIs)
- **DTO:** Data Transfer Object (schemas de Pydantic)
- **ORM:** Object-Relational Mapping (SQLModel)
- **Service:** Caso de uso, orquesta la lógica de negocio
- **Repository:** Patrón para acceso a datos

---

## 🎯 Próximos Pasos

1. ✅ Agregar tests unitarios en `tests/core/`
2. ✅ Agregar tests de integración en `tests/api/`
3. ✅ Implementar logging
4. ✅ Agregar más validaciones en el dominio
5. ✅ Implementar paginación en listados
6. ✅ Agregar manejo de errores más robusto

---

**¿Preguntas? ¿Algo que quieras profundizar?** 🚀
