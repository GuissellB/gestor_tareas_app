from fastapi import APIRouter, HTTPException
from database import conectar_db
from .model import Tarea

router = APIRouter(prefix="/tareas", tags=["Tareas"])

# Creacion de tarea
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

# GET de tareas por id de Lista
@router.get("/lista/{id_lista}", response_model=list[Tarea])
def obtener_tareas_por_lista(id_lista: str):
    try:
        db = conectar_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM tareas WHERE id_lista = %s", (id_lista,))
        tareas = cursor.fetchall()

        return tareas

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()

# Eliminar tareas
@router.delete("/eliminar/{id_tarea}")
def eliminar_tarea(id_tarea: str):
    try:
        db = conectar_db()
        cursor = db.cursor()

        sql = "DELETE FROM tareas WHERE id = %s"
        cursor.execute(sql, (id_tarea,))
        db.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Tarea no encontrada")

        return {"mensaje": "Tarea eliminada con éxito"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()

# Modificar tarea
@router.put("/actualizar/{id_tarea}")
def actualizar_tarea(id_tarea: str, tarea: Tarea):
    try:
        db = conectar_db()
        cursor = db.cursor()

        sql = """
        UPDATE tareas
        SET id_lista = %s,
            titulo = %s,
            descripcion = %s,
            prioridad = %s,
            posicion = %s
        WHERE id = %s
        """
        cursor.execute(sql, (
            tarea.id_lista,
            tarea.titulo,
            tarea.descripcion,
            tarea.prioridad,
            tarea.posicion,
            id_tarea
        ))
        db.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Tarea no encontrada para actualizar")

        return {"mensaje": "Tarea actualizada con éxito"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()

# Obtener una tarea por su ID
@router.get("/{id_tarea}", response_model=Tarea)
def obtener_tarea_por_id(id_tarea: str):
    try:
        db = conectar_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM tareas WHERE id = %s", (id_tarea,))
        tarea = cursor.fetchone()

        if not tarea:
            raise HTTPException(status_code=404, detail="Tarea no encontrada")

        return tarea

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()


