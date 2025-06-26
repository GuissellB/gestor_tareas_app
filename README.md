
# 📋 GESTOR_TAREAS_APP

Aplicación de gestión de tareas tipo *Kanban*, desarrollada con **FastAPI**, **MySQL** y estructurada en backend y frontend. Este proyecto permite administrar **tableros**, **listas** y **tareas**, útil para organización personal o en equipo.

---

## 📁 Estructura del Proyecto

```
gestor_tareas_app/
├── backend/
│   ├── database.py
│   ├── main.py
│   ├── requirements.txt
│   ├── listas/
│   ├── tableros/
│   ├── tareas/
│   └── usuarios/
├── db/
│   └── (Scripts .sql para crear las tablas)
├── frontend/
│   └── (Opcional para versión visual del proyecto)
└── README.md
```

---

## ⚙️ Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- Python 3.10+
- Git
- MyMySQL (y una base de datos llamada `gestor_tareas_app` ya creada)

---

## 🚀 Instalación del Proyecto (Backend)

Sigue estos pasos después de clonar el repositorio:

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/gestor_tareas_app.git
cd gestor_tareas_app
```

### 2. Ir a la carpeta del backend

```bash
cd backend
```

### 3. Crear el entorno virtual

```bash
python -m venv venv
```

### 4. Activar el entorno virtual

```bash
venv\Scripts\activate
```

> En Mac/Linux:
> ```bash
> source venv/bin/activate
> ```

### 5. Instalar dependencias

```bash
pip install -r requirements.txt
```
### 6. crear base de datos

```bash
CREATE DATABASE IF NOT EXISTS gestor_tareas_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gestor_tareas_app;
y ejecutar los query de SQL en el orden que se menciona en el aparatado de base de datos 

```
### 7. Ejecutar la API

```bash
uvicorn main:app --reload
```

Verás algo como:

```
Uvicorn running on http://127.0.0.1:8000
```

---

## 📌 Endpoints principales

Una vez la API esté corriendo, puedes acceder a la documentación automática:

- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc

---

## 🛠️ Estructura de Módulos (Backend)

- `tableros/`: creación y consulta de tableros.
- `listas/`: manejo de listas por tablero.
- `tareas/`: creación, consulta y asociación de tareas por lista.
- `usuarios/`: (opcional) módulo en construcción para autenticación o identificación de usuarios.

---

## 🗃️ Base de Datos

- Utiliza MySQL
- El archivo `.sql` para cada módulo está en la carpeta `/db`
- Ejecuta los scripts en este orden: usuarios, tableros, listas, tareas

---

## 📦 Dependencias principales

Se instalan con el `requirements.txt`:

- `fastapi`
- `uvicorn`
- `pymysql`
- `cryptography`
- `pydantic`

---

## 👥 Colaboración

Si vas a colaborar:

1. Sigue los pasos anteriores para tener la app local.
2. Crea una rama para tus cambios.
3. Haz `pull request` hacia `main`.

---

## 🧾 Notas

- El entorno virtual se encuentra dentro de la carpeta `backend/venv`
- No olvides agregar el archivo `.env` si se decide usar variables de entorno en futuras versiones

---

## 🧑‍💻 Autor

- Guissell Betancur y equipo
