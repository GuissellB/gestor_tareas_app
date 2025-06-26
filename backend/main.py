from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from usuarios import router as usuarios_router
from listas import router as lista_router
from tableros import router as tableros_router
from tareas import router as tareas_router

app = FastAPI()

origins = ["http://localhost","http://localhost:8000","*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#app.include_router(usuarios_router.router)
app.include_router(tableros_router.router)
#app.include_router(lista_router.router)
app.include_router(tareas_router.router)
