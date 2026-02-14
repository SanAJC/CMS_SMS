# 📱 SMS CMS - Sistema de Gestión de Mensajes SMS

Sistema backend para gestión de contactos y envío de mensajes SMS, construido con FastAPI y Arquitectura Hexagonal.

## 🏗️ Arquitectura

Este proyecto implementa **Arquitectura Hexagonal (Ports & Adapters)**, separando la lógica de negocio de los detalles de implementación.

📖 **[Ver documentación completa de arquitectura](./ARQUITECTURA_HEXAGONAL.md)**

### Estructura del Proyecto

```
Server/
├── app/                    # Configuración de la aplicación
│   ├── main.py            # Punto de entrada FastAPI
│   └── config.py          # Variables de configuración
│
├── core/                   # 🎯 Lógica de negocio (Hexágono)
│   ├── models/            # Entidades del dominio
│   ├── services/          # Casos de uso
│   └── ports/             # Interfaces (contratos)
│
├── interfaces/             # 🌐 Adaptadores de entrada
│   ├── routes/            # Endpoints HTTP
│   └── schemas/           # DTOs (Pydantic)
│
├── adapters/               # 🔌 Adaptadores de salida
│   ├── persistence/       # Repositorios (PostgreSQL)
│   └── auth/              # JWT, OAuth2, Bcrypt
│
├── alembic/               # Migraciones de base de datos
└── tests/                 # Tests unitarios e integración
```

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Python 3.12+
- PostgreSQL 14+
- pip (gestor de paquetes de Python)

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd CMS_SMS/Server
```

### 2. Crear Entorno Virtual

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Instalar Dependencias

```bash
pip install -r requirements.txt
```

### 4. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto Server:

```env
# Base de datos PostgreSQL
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/cms_sms

# JWT Secret Key (genera una clave segura)
SECRET_KEY=tu_clave_secreta_muy_larga_y_segura_aqui

# API Key para SMS (opcional)
SMSMODE_KEY=tu_api_key_de_smsmode
```

**💡 Generar SECRET_KEY segura:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 5. Crear Base de Datos

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE cms_sms;

# Crear usuario (opcional)
CREATE USER cms_sms_user WITH PASSWORD 'tu_contraseña';
GRANT ALL PRIVILEGES ON DATABASE cms_sms TO cms_sms_user;
```

### 6. Ejecutar Migraciones

```bash
alembic upgrade head
```

Esto creará las tablas:
- `users` - Usuarios del sistema
- `contactos` - Contactos para envío de SMS
- `messages` - Mensajes enviados

### 7. Iniciar el Servidor

```bash
uvicorn app.main:app --reload
```

El servidor estará disponible en: **http://localhost:8000**

---

## 📚 Documentación de la API

Una vez iniciado el servidor, accede a:

- **Swagger UI (interactiva):** http://localhost:8000/docs
- **ReDoc (alternativa):** http://localhost:8000/redoc

---
