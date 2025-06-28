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
      div.onclick = () => window.location.href = `tablero.html?id=${t.id}`;
      contenedor.appendChild(div);
    });

  } catch (error) {
    console.error("Error cargando tableros:", error);
    contenedor.innerHTML = "<p>Error al cargar los tableros</p>";
  }
});
