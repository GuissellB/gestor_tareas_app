const API_BASE_URL = "http://localhost:8000";

document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("lista-tableros");
  console.log("Contenedor encontrado:", contenedor);

  try {
    const res = await fetch(`${API_BASE_URL}/tableros`);
    if (!res.ok) throw new Error("Error al obtener tableros");

    const tableros = await res.json();
    const arregloTableros = Array.isArray(tableros) ? tableros : [tableros];

    if (arregloTableros.length === 0) {
      contenedor.innerHTML = "<p>No hay tableros aún.</p>";
      return;
    }

    arregloTableros.forEach(t => {
      const div = document.createElement("div");
      div.className = "tarjeta-tablero";
      div.innerHTML = `
        <h3>${t.nombre}</h3>
        <p>${t.descripcion}</p>
      `;
      div.onclick = () => window.location.href = `admin_tareas.html?id=${t.id}`;
      contenedor.appendChild(div);
    });

  } catch (error) {
    console.error("Error cargando tableros:", error);
    contenedor.innerHTML = "<p>Error al cargar los tableros</p>";
  }
});
// Popup modal - Nuevo tablero
const modal = document.getElementById("modal-nuevo-tablero");
const abrir = document.getElementById("abrir-modal-tablero");
const cerrar = document.getElementById("cerrar-modal-tablero");
const form = document.getElementById("form-nuevo-tablero");

abrir.onclick = () => modal.style.display = "block";
cerrar.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre-tablero").value.trim();
  const descripcion = document.getElementById("descripcion-tablero").value.trim();

  try {
    const res = await fetch(`${API_BASE_URL}/tableros/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, descripcion })
    });

    if (!res.ok) throw new Error("No se pudo crear el tablero");

    // Ocultar modal y recargar lista
    modal.style.display = "none";
    window.location.reload();  // o volver a llamar la función que lista tableros si prefieres no recargar
  } catch (err) {
    alert("Error al crear el tablero");
    console.error(err);
  }
});
const cancelar = document.getElementById("cerrar-modal-tablero-dos");
cancelar.onclick = () => modal.style.display = "none";
