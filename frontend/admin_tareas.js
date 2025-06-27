const API_BASE_URL = "http://localhost:8000";
const tableroId = "b53ce9a5-525c-11f0-b40f-00155d917c87"; // ID quemado por ahora

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const tablero = await getTablero(tableroId);
    document.getElementById("tablero-nombre").textContent = tablero.nombre;
    document.getElementById("tablero-descripcion").textContent = tablero.descripcion;

    const listas = await getListas(tableroId);
    renderListasKanban(listas);
    // Mostrar el modal al hacer clic en "+ Add Task"
    document.addEventListener("click", function (e) {
      if (e.target && e.target.classList.contains("add-task-btn")) {
        document.getElementById("modalCrearTarea").classList.remove("hidden");
      }
    });

    // Cerrar el modal
    document.getElementById("cerrarModal").addEventListener("click", function () {
      document.getElementById("modalCrearTarea").classList.add("hidden");
    });

    // Enviar formulario
    document.getElementById("formCrearTarea").addEventListener("submit", async function (e) {
      e.preventDefault();

      const nuevaTarea = {
        titulo: document.getElementById("titulo").value,
        descripcion: document.getElementById("descripcion").value,
        prioridad: document.getElementById("prioridad").value,
        fecha_limite: new Date().toISOString().split('T')[0], // puedes cambiar esto si el campo se agrega
        id_lista: null
      };

      const listas = await getListas(tableroId);
      if (listas.length > 0) {
        const listaId = listas[0].id;
        nuevaTarea.id_lista = listaId;

        // Obtener tareas existentes para esa lista y calcular posición
        const tareas = await getTareasPorLista(listaId);
        nuevaTarea.posicion = tareas.length + 1;
      } else {
        alert("No hay listas disponibles.");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/tareas/crear`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevaTarea)
        });

        if (!res.ok) throw new Error("Error al crear tarea");
        alert("✅ Tarea creada");
        document.getElementById("modalCrearTarea").classList.add("hidden");
        location.reload();
      } catch (error) {
        console.error(error);
        alert("❌ Error al crear la tarea");
      }
    });
  } catch (error) {
    console.error("Error cargando el tablero o listas:", error);
  }
});

async function getTablero(id) {
  const res = await fetch(`${API_BASE_URL}/tableros/${id}`);
  if (!res.ok) throw new Error("No se pudo obtener el tablero");
  return await res.json();
}

async function getListas(tableroId) {
  const res = await fetch(`${API_BASE_URL}/listas/tablero/${tableroId}`);
  if (!res.ok) throw new Error("Error al obtener listas");
  return await res.json();
}

async function getTareasPorLista(listaId) {
  const res = await fetch(`${API_BASE_URL}/tareas/lista/${listaId}`);
  if (!res.ok) throw new Error("Error al obtener tareas para la lista " + listaId);
  return await res.json();
}

async function renderListasKanban(listas) {
  const container = document.getElementById("listas-container");
  container.innerHTML = "";

  listas.sort((a, b) => a.posicion - b.posicion);

  for (const lista of listas) {
    const listaHTML = document.createElement("div");
    listaHTML.className = "kanban-column";

    // Obtener tareas de esta lista
    const tareas = await getTareasPorLista(lista.id);

    // Contenedor de tareas
    let tareasHTML = "";

    if (tareas.length === 0) {
      tareasHTML = `
        <div class="task-list empty">
          <p class="empty-message">Aún no hay tareas<br><small>Agrega tu primera tarea para comenzar</small></p>
        </div>
      `;
    } else {
      tareasHTML = `
        <div class="task-list">
          ${tareas
          .map(
            (t) => `
            <div class="tarea">
              <div class="titulo-tarea">
                <span>${t.titulo}</span>
                <div class="acciones-tarea">
                  <button class="btn-editar-tarea" data-id="${t.id}" title="Editar"><i class="fas fa-pen"></i></button>
                  <button class="btn-eliminar-tarea" data-id="${t.id}" title="Eliminar"><i class="fas fa-trash-alt"></i></button>
                </div>
              </div>
              <div class="etiquetas">
                <span class="etiqueta ${t.prioridad.toLowerCase()}">
                  ${t.prioridad}
                </span>
              </div>
              <p class="descripcion-tarea">${t.descripcion}</p>
              <select class="mover-tarea">
                ${listas.map(l => `<option value="${l.id}" ${l.id === lista.id ? 'selected' : ''}>${l.nombre}</option>`).join("")}
              </select>
            </div>
          `
          )
          .join("")}
        </div>
      `;
    }

    listaHTML.innerHTML = `
      <div class="kanban-column-header">
        <div class = header-dot>
          <div class="status-dot ${getColorDot(lista.nombre)}"></div>
          <h3>${lista.nombre}</h3>
        </div>
        <label class="task-count">${tareas.length}</label>  
      </div>
      <button class="add-task-btn">+ Add Task</button>
      ${tareasHTML}
    `;

    container.appendChild(listaHTML);
  }
}


function getColorDot(nombreLista) {
  const nombre = nombreLista.toLowerCase();
  if (nombre.includes("progreso")) return "dot-yellow";
  if (nombre.includes("hecho") || nombre.includes("done")) return "dot-green";
  return "dot-blue";
}


