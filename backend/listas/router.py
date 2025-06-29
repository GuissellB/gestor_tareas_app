# listas.py
from fastapi import APIRouter, HTTPException
from database import conectar_db
from .model import Lista

router = APIRouter(prefix="/listas", tags=["Listas"])

#Get listas por id de tablero
@router.get("/tablero/{id_tablero}", response_model=list[Lista])
def obtener_listas_por_tablero(id_tablero: str):
    try:
        db = conectar_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM listas WHERE id_tablero = %s", (id_tablero,))
        listas = cursor.fetchall()

        if not listas:
            raise HTTPException(status_code=404, detail="No se encontraron listas para ese tablero")

        return listas

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()

# Crear una nueva lista
@router.post("/crear")
def guardar_lista(lista: Lista):
    try:
        db = conectar_db()
        cursor = db.cursor()

        sql = """
        INSERT INTO listas (id, id_tablero, nombre, posicion)
        VALUES (UUID(), %s, %s, %s)
        """
        cursor.execute(sql, (
            lista.id_tablero,
            lista.nombre,
            lista.posicion
        ))
        db.commit()

        return {"mensaje": "Lista guardada con éxito"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()
