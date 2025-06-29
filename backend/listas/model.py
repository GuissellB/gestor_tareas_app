# listas/model.py
from pydantic import BaseModel
from typing import Optional

class Lista(BaseModel):
    id: Optional[str] = None
    id_tablero: str
    nombre: str
    posicion: int
