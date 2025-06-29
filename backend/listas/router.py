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

        return listas

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()

@router.post("/crear")
def crear_lista(lista: Lista):
    db = conectar_db()
    cursor = db.cursor()

    # Si la posición no viene definida, buscamos la máxima actual
    if lista.posicion is None:
        cursor.execute(
            "SELECT MAX(posicion) FROM listas WHERE id_tablero = %s", 
            (lista.id_tablero,)
        )
        max_pos = cursor.fetchone()[0]
        nueva_posicion = (max_pos or 0) + 1
    else:
        nueva_posicion = lista.posicion

    sql = """
        INSERT INTO listas (id, id_tablero, nombre, posicion)
        VALUES (UUID(), %s, %s, %s)
    """
    cursor.execute(sql, (lista.id_tablero, lista.nombre, nueva_posicion))
    db.commit()
    cursor.close()
    db.close()
    return {"message": "Lista creada correctamente"}

# Elimina una lista             
@router.delete("/eliminar/{id_lista}")
def eliminar_lista(id_lista: str):
    try:
        db = conectar_db()
        cursor = db.cursor()

        cursor.execute("DELETE FROM listas WHERE id = %s", (id_lista,))
        db.commit()

        return {"mensaje": "Lista eliminada con éxito"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()