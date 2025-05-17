const API_URL = "http://192.168.1.5:3000";
let allPets = [];
let chartInstance = null; // para actualizar la gráfica

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { "Authorization": `Bearer ${token}` } : {};
}

async function loadPets() {
  try {
    const res = await fetch(`${API_URL}/petscmzl`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`Error al cargar mascotas: ${res.statusText}`);

    const pets = await res.json();
    allPets = pets;
    const container = document.getElementById("petList");
    container.innerHTML = "";

    if (!pets || pets.length === 0) {
      container.innerHTML = "<p>No hay mascotas registradas.</p>";
      return;
    }

    pets.forEach(pet => {
      const card = document.createElement("div");
      card.className = "pet-card";

      card.innerHTML = `
        <div class="pet-info">
          <img class="pet-photo" src="${pet.photo ? `${API_URL}/images/${pet.photo}` : 'images/default-pet.png'}" alt="Foto">
          <div>
            <h1 class="pet-name">${pet.name || 'Sin nombre'}</h1>
            <p class="pet-rate">${pet.race?.name || 'Sin raza'}</p>
            <p class="pet-status">Estado: ${pet.estado || 'Sin estado'}</p>
          </div>
        </div>
        <div class="pet-actions">
          <a href="vermascota.html?id=${pet.id}">
            <img src="images/btn-show.svg" alt="Ver">
          </a>
          <a href="editarmascotas.html?id=${pet.id}">
            <img src="images/btn-edit.svg" alt="Editar">
          </a>
          <img class="btn-delete" src="images/btn-delete.svg" alt="Eliminar" data-id="${pet.id}">
        </div>
      `;

      container.appendChild(card);
    });

    setupDeleteButtons();
    setupReportButtons();
    renderGraficaMascotas(); // cargar o actualizar la gráfica
  } catch (error) {
    console.error("Error al cargar mascotas:", error);
    const container = document.getElementById("petList");
    container.innerHTML = `<p>Error al cargar las mascotas. Verifica la conexión o el servidor: ${error.message}</p>`;
  }
}

function setupDeleteButtons() {
  document.querySelectorAll(".btn-delete").forEach(button => {
    button.addEventListener("click", async (event) => {
      const petId = event.currentTarget.getAttribute("data-id");
      if (!confirm("¿Estás seguro de que quieres eliminar esta mascota?")) return;

      try {
        const response = await fetch(`${API_URL}/petscmzl/${petId}`, {
          method: "DELETE",
          headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error(`Error al eliminar mascota: ${response.statusText}`);

        alert("Mascota eliminada correctamente");
        loadPets();
      } catch (error) {
        console.error("Error al eliminar mascota:", error);
        alert(`Error al eliminar mascota: ${error.message}`);
      }
    });
  });
}

function setupReportButtons() {
  document.getElementById("btnReporteTodas")?.addEventListener("click", () => {
    generarReporte(allPets, "Reporte de Todas las Mascotas");
  });

  document.getElementById("btnReporteDisponibles")?.addEventListener("click", () => {
    const filtradas = allPets.filter(p => p.estado?.toLowerCase() === "disponible");
    generarReporte(filtradas, "Reporte de Mascotas Disponibles");
  });

  document.getElementById("btnReporteAdoptadas")?.addEventListener("click", () => {
    const filtradas = allPets.filter(p => p.estado?.toLowerCase() === "adoptado");
    generarReporte(filtradas, "Reporte de Mascotas Adoptadas");
  });
}

function generarReporte(data, titulo) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text(titulo, 14, 20);

  const rows = data.map(pet => [
    pet.name || "Sin nombre",
    pet.race?.name || "Sin raza",
    pet.estado || "Sin estado"
  ]);

  doc.autoTable({
    head: [["Nombre", "Raza", "Estado"]],
    body: rows,
    startY: 30,
    theme: "striped",
  });

  doc.save(`${titulo.replace(/\s+/g, "_").toLowerCase()}.pdf`);
}

// Nueva función para mostrar la gráfica
function renderGraficaMascotas() {
  const total = allPets.length;
  const disponibles = allPets.filter(p => p.estado?.toLowerCase() === "disponible").length;
  const adoptadas = allPets.filter(p => p.estado?.toLowerCase() === "adoptado").length;

  const ctx = document.getElementById("graficaMascotas")?.getContext("2d");
  if (!ctx) return;

  // Destruir la gráfica anterior si existe
  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Total", "Disponibles", "Adoptadas"],
      datasets: [{
        label: "Cantidad de Mascotas",
        data: [total, disponibles, adoptadas],
        backgroundColor: ["#4ecb8f", "#36a2eb", "#ff6384"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: "Resumen de Mascotas" }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 }
        }
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", loadPets);
