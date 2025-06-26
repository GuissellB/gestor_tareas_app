from fastapi import APIRouter
from database import conectar_db
from datetime import datetime
from .model import Tablero

router = APIRouter(prefix="/tableros", tags=["Tableros"])


@router.get("/", response_model=list[Tablero])
def obtener_tableros():
    db = conectar_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM tableros")
    tableros = cursor.fetchall()

    # Convertir el campo `creado_en` a ISO string
    for t in tableros:
        if isinstance(t["creado_en"], datetime):
            t["creado_en"] = t["creado_en"].isoformat()

    cursor.close()
    db.close()
    return tableros
