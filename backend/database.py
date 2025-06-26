import mysql.connector

def conectar_db():
    return mysql.connector.connect(
        host="localhost",
        port=3306,
        user="root",
        password="123Queso",
        database="gestor_tareas_app"
    )
