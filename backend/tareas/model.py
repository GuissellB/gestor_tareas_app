from pydantic import BaseModel
from typing import Optional

class Tarea(BaseModel):
    id: Optional[str] = None
    id_lista: str
    titulo: str
    descripcion: str
    prioridad: str
    posicion: int