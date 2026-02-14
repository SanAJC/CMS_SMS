# 📱 SMS CMS - Sistema de Gestión de Mensajes

Sistema completo para gestión de contactos y envío de mensajes SMS con interfaz web moderna.

## 📂 Estructura del Proyecto

```
CMS_SMS/
├── Server/          # Backend - FastAPI + PostgreSQL
└── Client/          # Frontend - React + TypeScript + Vite
```

---

## 🚀 Inicio Rápido

### Backend (Server)

```bash
cd Server

# Crear entorno virtual
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Configurar .env (ver Server/README.md)
# Ejecutar migraciones
alembic upgrade head

# Iniciar servidor
uvicorn app.main:app --reload
```

**URL:** http://localhost:8000  
**Docs:** http://localhost:8000/docs

📖 [Ver documentación completa del Backend](./Server/README.md)

---

### Frontend (Client)

```bash
cd Client

# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev
```

**URL:** http://localhost:5173

📖 [Ver documentación completa del Frontend](./Client/README.md)

---

## 🛠️ Stack Tecnológico

### Backend
- **FastAPI** - Framework web Python
- **PostgreSQL** - Base de datos
- **SQLModel** - ORM
- **JWT** - Autenticación
- **Alembic** - Migraciones

### Frontend
- **React 18** - Librería UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **Shadcn/ui** - Componentes UI
- **TailwindCSS** - Estilos
- **React Router** - Navegación
- **TanStack Query** - Manejo de estado

---

## 📋 Funcionalidades

✅ Autenticación de usuarios (JWT)  
✅ Gestión de contactos  
✅ Importación masiva desde CSV  
✅ Creación y envío de mensajes  
✅ Historial de mensajes  
✅ Interfaz responsive  

---

## 🏗️ Arquitectura

El backend implementa **Arquitectura Hexagonal** (Ports & Adapters):

- **Core:** Lógica de negocio pura
- **Interfaces:** Adaptadores HTTP (FastAPI)
- **Adapters:** Persistencia (PostgreSQL) y Auth (JWT)

📖 [Ver diagrama de arquitectura](./Server/ARQUITECTURA_HEXAGONAL.md)

---

## 📝 Variables de Entorno

### Server/.env
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/cms_sms
SECRET_KEY=tu_clave_secreta_jwt
SMSMODE_KEY=tu_api_key_opcional
```

### Client/.env (si es necesario)
```env
VITE_API_URL=http://localhost:8000
```

---

## 🧪 Testing

### Backend
```bash
cd Server
pytest
```

### Frontend
```bash
cd Client
npm run test
```

---

## 📦 Despliegue

### Backend
- Render, Railway, Heroku, AWS, etc.
- Requiere PostgreSQL

### Frontend
- Vercel, Netlify, GitHub Pages, etc.
- Build estático: `npm run build`

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agregar funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

---

## 📄 Licencia

Proyecto privado y confidencial.

---

**Desarrollado con ❤️**
