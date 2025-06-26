from fastapi import APIRouter
from database import conectar_db
from .model import Tarea

router = APIRouter(prefix="/tareas", tags=["Tareas"])

@router.post("/crear")
def guardar_tarea(tarea: Tarea):
    db = conectar_db()
    cursor = db.cursor()

    sql = """
    INSERT INTO tareas (id, id_lista, titulo, descripcion, prioridad, posicion, creado_en)
    VALUES (UUID(), %s, %s, %s, %s, %s, CURRENT_TIMESTAMP)
    """
    cursor.execute(sql, (tarea.id_lista, tarea.titulo, tarea.descripcion, tarea.prioridad, tarea.posicion))
    db.commit()
    cursor.close()
    db.close()

    return {"mensaje": "Tarea guardada con éxito"}
