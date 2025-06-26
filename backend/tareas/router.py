from fastapi import APIRouter, HTTPException
from database import conectar_db
from .model import Tarea

router = APIRouter(prefix="/tareas", tags=["Tareas"])

#Creacion de tareas
@router.post("/crear")
def guardar_tarea(tarea: Tarea):
    try:
        db = conectar_db()
        cursor = db.cursor()

        sql = """
        INSERT INTO tareas (id, id_lista, titulo, descripcion, prioridad, posicion, creado_en)
        VALUES (UUID(), %s, %s, %s, %s, %s, CURRENT_TIMESTAMP)
        """
        cursor.execute(sql, (
            tarea.id_lista,
            tarea.titulo,
            tarea.descripcion,
            tarea.prioridad,
            tarea.posicion
        ))
        db.commit()

        return {"mensaje": "Tarea guardada con éxito"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()

#GET de tareas por id de Lista
@router.get("/lista/{id_lista}", response_model=list[Tarea])
def obtener_tareas_por_lista(id_lista: str):
    try:
        db = conectar_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM tareas WHERE id_lista = %s", (id_lista,))
        tareas = cursor.fetchall()

        if not tareas:
            raise HTTPException(status_code=404, detail="No se encontraron tareas para esa lista")

        return tareas

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()