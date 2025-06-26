# listas/model.py
from pydantic import BaseModel

class Lista(BaseModel):
    id: str
    id_tablero: str
    nombre: str
    posicion: int
