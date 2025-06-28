from uuid import uuid4
from fastapi import APIRouter, HTTPException
from database import conectar_db
from .model import Tablero, TableroCrear  
from datetime import datetime

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

# POST: Crear un nuevo tablero
@router.post("/", response_model=Tablero)
def crear_tablero(tablero: TableroCrear):  # Usar modelo sin ID para la entrada
    db = conectar_db()
    cursor = db.cursor()
    
    creado_en = datetime.now()
    id_usuario = "0ea88c3e-525c-11f0-b40f-00155d917c87"  # Usuario quemado

    nuevo_id = str(uuid4())
    try:
        cursor.execute(
            "INSERT INTO tableros (id, nombre, descripcion, id_usuario, creado_en) VALUES (%s, %s, %s, %s, %s)",
            (nuevo_id, tablero.nombre, tablero.descripcion, id_usuario, creado_en)
        )

        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error al crear el tablero")

    cursor.close()
    db.close()

    return {
    "id": nuevo_id,
    "nombre": tablero.nombre,
    "descripcion": tablero.descripcion,
    "id_usuario": "1",  # o quien sea el usuario actual
    "creado_en": datetime.now()
}
