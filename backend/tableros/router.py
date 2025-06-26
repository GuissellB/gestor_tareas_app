from fastapi import APIRouter, HTTPException
from database import conectar_db
from .model import Tablero

router = APIRouter(prefix="/tableros", tags=["Tableros"])

#Get tableros
@router.get("/", response_model=list[Tablero])
def obtener_tableros():
    db = conectar_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM tableros")
    tableros = cursor.fetchall()
    cursor.close()
    db.close()
    return tableros

#Get tablero por id
@router.get("/{id}", response_model=Tablero)
def obtener_tablero_por_id(id: str):
    db = conectar_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM tableros WHERE id = %s", (id,))
    tablero = cursor.fetchone()
    cursor.close()
    db.close()

    if not tablero:
        raise HTTPException(status_code=404, detail="Tablero no encontrado")

    return tablero
