const API_BASE_URL = "http://localhost:8000";
const tableroId = "b53ce9a5-525c-11f0-b40f-00155d917c87"; // ID quemado por ahora

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const tablero = await getTablero(tableroId);
    document.getElementById("tablero-nombre").textContent = tablero.nombre;
    document.getElementById("tablero-descripcion").textContent = tablero.descripcion;

    const listas = await getListas(tableroId);
    renderListasKanban(listas);
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
