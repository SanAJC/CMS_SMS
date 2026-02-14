from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from interfaces.routes import contacto_routes
from interfaces.routes import auth_routes
from interfaces.routes import message_routes


app = FastAPI(title="SMS CMS con FastAPI y Arquitectura Hexagonal")

# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica los orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(contacto_routes.router, prefix="/contacts")
app.include_router(auth_routes.router, prefix="/auth")
app.include_router(message_routes.router, prefix="/messages", tags=["Messages"])

@app.get("/")
def home():
    return {"message": "API SMS CMS funcionando 🚀"}