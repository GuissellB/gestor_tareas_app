# database.py

import pymysql

def conectar_db():
    return pymysql.connect(
        host="127.0.0.1",
        port=3306,
        user="root",
        password="123Queso",
        database="gestor_tareas_app",
        cursorclass=pymysql.cursors.DictCursor
    )
