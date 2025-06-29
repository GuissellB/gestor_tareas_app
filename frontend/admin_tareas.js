const API_BASE_URL = "http://localhost:8000";
const urlParams = new URLSearchParams(window.location.search);
const tableroId = urlParams.get("id");
console.log("ID del tablero:", tableroId);

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const tablero = await getTablero(tableroId);
    document.getElementById("tablero-nombre").textContent = tablero.nombre;
    document.getElementById("tablero-descripcion").textContent = tablero.descripcion;

    const listas = await getListas(tableroId);
    renderListasKanban(listas);

    // ============ CREAR TAREA ============
    let idListaSeleccionada = null;

    document.addEventListener("click", function (e) {
      if (e.target && e.target.classList.contains("add-task-btn")) {
        idListaSeleccionada = e.target.value;
        document.getElementById("modalCrearTarea").classList.remove("hidden");

        const selectStatus = document.getElementById("status");
        selectStatus.innerHTML = "";

        listas.forEach(lista => {
          const option = document.createElement("option");
          option.value = lista.id;
          option.textContent = lista.nombre;
          if (lista.id === idListaSeleccionada) {
            option.selected = true;
          }
          selectStatus.appendChild(option);
        });
      }
    });

    document.getElementById("cerrarModal").addEventListener("click", function () {
      document.getElementById("modalCrearTarea").classList.add("hidden");
    });

    document.getElementById("formCrearTarea").addEventListener("submit", async function (e) {
      e.preventDefault();

      const nuevaTarea = {
        titulo: document.getElementById("titulo").value,
        descripcion: document.getElementById("descripcion").value,
        prioridad: document.getElementById("prioridad").value,
        fecha_limite: new Date().toISOString().split('T')[0],
        id_lista: document.getElementById("status").value
      };

      if (!idListaSeleccionada) {
        alert("No se seleccionó una lista.");
        return;
      }

      const tareas = await getTareasPorLista(idListaSeleccionada);
      nuevaTarea.posicion = tareas.length + 1;

      try {
        const res = await fetch(`${API_BASE_URL}/tareas/crear`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevaTarea)
        });

        if (!res.ok) throw new Error("Error al crear tarea");
        alert("✅ Tarea creada exitosamente");
        document.getElementById("modalCrearTarea").classList.add("hidden");
        location.reload();
      } catch (error) {
        console.error(error);
        alert("❌ Error al crear la tarea");
      }
    });

    // ============ MODIFICAR TAREA ============
    const modalEditar = document.getElementById("modalEditarTarea");
    const btnCerrarEditar = document.getElementById("cerrarModalEditar");
    const formEditar = document.getElementById("formEditarTarea");
    let tareaEditandoId = null;

    btnCerrarEditar.addEventListener("click", () => {
      modalEditar.classList.add("hidden");
    });

    document.getElementById("listas-container").addEventListener("click", async (e) => {
      if (e.target.closest(".btn-editar-tarea")) {
        const btnEditar = e.target.closest(".btn-editar-tarea");
        tareaEditandoId = btnEditar.getAttribute("data-id");

        try {
          const res = await fetch(`${API_BASE_URL}/tareas/${tareaEditandoId}`);
          if (!res.ok) throw new Error("Error al obtener tarea");
          const tarea = await res.json();

          formEditar.editarTitulo.value = tarea.titulo;
          formEditar.editarDescripcion.value = tarea.descripcion || "";
          formEditar.editarPrioridad.value = tarea.prioridad;

          const selectStatus = document.getElementById("editarStatus");
          selectStatus.innerHTML = "";
          listas.forEach(lista => {
            const option = document.createElement("option");
            option.value = lista.id;
            option.textContent = lista.nombre;
            if (lista.id === tarea.id_lista) option.selected = true;
            selectStatus.appendChild(option);
          });

          modalEditar.classList.remove("hidden");
        } catch (error) {
          alert("Error al cargar datos de la tarea");
          console.error(error);
        }
      }
    });

    formEditar.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!tareaEditandoId) return;

      const datosActualizados = {
        id_lista: formEditar.editarStatus.value,
        titulo: formEditar.editarTitulo.value,
        descripcion: formEditar.editarDescripcion.value,
        prioridad: formEditar.editarPrioridad.value,
        posicion: 1
      };

      try {
        const res = await fetch(`${API_BASE_URL}/tareas/actualizar/${tareaEditandoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosActualizados),
        });

        if (!res.ok) throw new Error("Error al actualizar tarea");

        alert("✅ Tarea actualizada exitosamente");
        modalEditar.classList.add("hidden");
        location.reload();
      } catch (error) {
        alert("❌ Error al actualizar la tarea");
        console.error(error);
      }
    });

    // ============ DRAG & DROP PARA MOVER ENTRE COLUMNAS ============
    document.addEventListener("dragstart", (e) => {
      if (e.target.classList.contains("tarea")) {
        e.dataTransfer.setData("text/plain", e.target.getAttribute("data-id"));
        e.target.classList.add("dragging");
      }
    });

    document.addEventListener("dragend", (e) => {
      if (e.target.classList.contains("tarea")) {
        e.target.classList.remove("dragging");
      }
    });

    document.querySelectorAll(".kanban-board").forEach(board => {
      board.addEventListener("dragover", e => e.preventDefault());
    });

    // drop corregido para enviar todos los datos
    document.addEventListener("drop", async (e) => {
      if (e.target.closest(".kanban-column")) {
        const column = e.target.closest(".kanban-column");
        const idListaNueva = column.querySelector(".add-task-btn").value;
        const idTarea = e.dataTransfer.getData("text/plain");

        const tareasEnColumna = column.querySelectorAll(".tarea");
        const nuevaPosicion = tareasEnColumna.length + 1;

        try {
          // obtener datos actuales
          const resTarea = await fetch(`${API_BASE_URL}/tareas/${idTarea}`);
          if (!resTarea.ok) throw new Error("No se pudo obtener la tarea");
          const tareaActual = await resTarea.json();

          const payload = {
            id_lista: idListaNueva,
            titulo: tareaActual.titulo,
            descripcion: tareaActual.descripcion,
            prioridad: tareaActual.prioridad,
            posicion: nuevaPosicion
          };

          const res = await fetch(`${API_BASE_URL}/tareas/actualizar/${idTarea}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });

          if (!res.ok) throw new Error("No se pudo mover la tarea");
          console.log(`Tarea ${idTarea} movida a lista ${idListaNueva} en posición ${nuevaPosicion}`);
          location.reload();
        } catch (error) {
          console.error(error);
          alert("❌ No se pudo mover la tarea");
        }
      }
    });

    // ============ CREAR NUEVA LISTA ============

    document.addEventListener("click", function (e) {
      if (e.target.closest(".btn-nueva-lista")) {
        document.getElementById("modalCrearLista").classList.remove("hidden");
      }

      if (e.target.id === "cancelarCrearLista") {
        document.getElementById("modalCrearLista").classList.add("hidden");
      }

       if (e.target.id === "cerrarModalCrearLista") {
        document.getElementById("modalCrearLista").classList.add("hidden");
      }
    });

    document.getElementById("crearListaBtn").addEventListener("click", async () => {
      const nombreLista = document.getElementById("nombreLista").value.trim();
      if (!nombreLista) {
        alert("Por favor ingresa un nombre para la lista.");
        return;
      }

      try {
        const listasActuales = await getListas(tableroId);

        const nuevaLista = {
          id_tablero: tableroId,
          nombre: nombreLista,
          posicion: listasActuales.length + 1
        };

        const res = await fetch(`${API_BASE_URL}/listas/crear`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevaLista)
        });

        if (!res.ok) throw new Error("No se pudo crear la lista");

        alert("✅ Lista creada exitosamente");
        document.getElementById("modalCrearLista").classList.add("hidden");
        location.reload();

      } catch (error) {
        console.error(error);
        alert("❌ Error al crear la lista");
      }
    });

  } catch (error) {
    console.error("Error cargando el tablero o listas:", error);
  }
});

document.addEventListener("click", async function (e) {
  if (e.target.closest(".btn-eliminar-tarea")) {
    const boton = e.target.closest(".btn-eliminar-tarea");
    const idTarea = boton.getAttribute("data-id");

    const confirmar = confirm("¿Estás seguro de que deseas eliminar esta tarea?");
    if (!confirmar) return;

    try {
      const res = await fetch(`${API_BASE_URL}/tareas/eliminar/${idTarea}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Error al eliminar la tarea");

      alert("✅ Tarea eliminada exitosamente");
      location.reload();
    } catch (error) {
      console.error(error);
      alert("❌ No se pudo eliminar la tarea");
    }
  }
});

//Opciones de tareas
document.addEventListener("click", async function (e) {
  // Mostrar/ocultar el menú de una lista
  if (e.target.closest(".btn-menu-lista")) {
    const idLista = e.target.closest(".btn-menu-lista").dataset.id;
    const menu = document.getElementById(`menu-${idLista}`);

    // Cerrar otros menús abiertos
    document.querySelectorAll(".menu-opciones").forEach(m => m.classList.add("hidden"));
    menu.classList.toggle("hidden");
    return;
  }

  // Eliminar una lista
  if (e.target.closest(".btn-eliminar-lista")) {
    const idLista = e.target.closest(".btn-eliminar-lista").dataset.id;
    const confirmar = confirm("¿Estás seguro de que deseas eliminar esta lista?");
    if (!confirmar) return;

    try {
      const res = await fetch(`${API_BASE_URL}/listas/eliminar/${idLista}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Error al eliminar la lista");

      alert("✅ Lista eliminada exitosamente");
      location.reload();
    } catch (error) {
      console.error(error);
      alert("❌ No se pudo eliminar la lista");
    }
  }

  // Ocultar menú si se hace clic fuera de él
  if (!e.target.closest(".lista-menu")) {
    document.querySelectorAll(".menu-opciones").forEach(m => m.classList.add("hidden"));
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

  // Si hay listas, las renderizamos
  if (listas.length > 0) {
    listas.sort((a, b) => a.posicion - b.posicion);

    for (const lista of listas) {
      const listaHTML = document.createElement("div");
      listaHTML.className = "kanban-column";

      const tareas = await getTareasPorLista(lista.id);

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
            ${tareas.map(t => `
              <div class="tarea" draggable="true" data-id="${t.id}">
                <div class="titulo-tarea">
                  <span>${t.titulo}</span>
                  <div class="acciones-tarea">
                    <button class="btn-editar-tarea" data-id="${t.id}" title="Editar"><i class="fas fa-pen"></i></button>
                    <button class="btn-eliminar-tarea" data-id="${t.id}" title="Eliminar"><i class="fas fa-trash-alt"></i></button>
                  </div>
                </div>
                <div class="etiquetas">
                  <span class="etiqueta ${t.prioridad.toLowerCase()}">${t.prioridad}</span>
                </div>
                <p class="descripcion-tarea">${t.descripcion}</p>
              </div>
            `).join("")}
          </div>
        `;
      }

      listaHTML.innerHTML = `
        <div class="kanban-column-header">
          <div class="header-dot">
            <div class="status-dot ${lista.nombre}"></div>
            <h3>${lista.nombre}</h3>
            <div class="lista-menu">
              <button class="btn-menu-lista" data-id="${lista.id}"><i class="fas fa-ellipsis-v"></i></button>
              <div class="menu-opciones hidden" id="menu-${lista.id}">
                <button class="btn-eliminar-lista" data-id="${lista.id}">Eliminar</button>
              </div>
            </div>
          </div>
          <label class="task-count">${tareas.length}</label>
        </div>
        <button class="add-task-btn" value="${lista.id}">+ Agregar tarea</button>
        ${tareasHTML}
      `;

      container.appendChild(listaHTML);
    }
  }

  const nuevaListaDiv = document.createElement("div");
  nuevaListaDiv.innerHTML = `
  <button class="btn-nueva-lista">
    <i class="fas fa-plus"></i> Añadir lista
  </button>
`;
  container.appendChild(nuevaListaDiv);
}




