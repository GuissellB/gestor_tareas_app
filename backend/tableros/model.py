from pydantic import BaseModel
from datetime import datetime

class Tablero(BaseModel):
    id: str
    nombre: str
    descripcion: str
    id_usuario: str
    creado_en: datetime
    
class TableroCrear(BaseModel):
    nombre: str
    descripcion: str
