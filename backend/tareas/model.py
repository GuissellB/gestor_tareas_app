from pydantic import BaseModel

class Tarea(BaseModel):
    id: str
    id_lista: str
    titulo: str
    descripcion: str
    prioridad: str
    posicion: int