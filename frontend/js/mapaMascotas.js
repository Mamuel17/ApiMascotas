const API_URL = "http://192.168.1.5:3000";

// Función para obtener encabezados con token
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No se encontró token en localStorage");
    return {};
  }
  return {
    Authorization: `Bearer ${token}`,
  };
}

// Función para cargar las mascotas y mostrarlas en el mapa
async function loadPetsMap() {
  try {
    const response = await fetch(`${API_URL}/petscmzl`, { headers: getAuthHeaders() });
    if (!response.ok) {
      throw new Error("Error al obtener las mascotas");
    }
    const pets = await response.json();

    // Inicializar el mapa (centrado en una ubicación por defecto, ej. Bogotá)
    const map = L.map("map").setView([4.60971, -74.08175], 10); // Ajusta las coordenadas y zoom según tu región
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Filtrar mascotas con coordenadas y agregar marcadores
    pets
      .filter((pet) => pet.latitude && pet.longitude)
      .forEach((pet) => {
        L.marker([pet.latitude, pet.longitude])
          .addTo(map)
          .bindPopup(`
            <b>${pet.name}</b><br>
            Raza: ${pet.race?.name || "Sin raza"}<br>
            Categoría: ${pet.category?.name || "Sin categoría"}<br>
            Género: ${pet.gender?.name || "Sin género"}<br>
            Estado: ${pet.estado || "Sin estado"}<br>
            <a href="vermascota.html?id=${pet.id}">Ver detalles</a>
          `);
      });

    // Ajustar el mapa para mostrar todos los marcadores (si hay mascotas)
    if (pets.some((pet) => pet.latitude && pet.longitude)) {
      const group = new L.featureGroup(
        pets
          .filter((pet) => pet.latitude && pet.longitude)
          .map((pet) => L.marker([pet.latitude, pet.longitude]))
      );
      map.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
  } catch (error) {
    console.error("Error al cargar el mapa de mascotas:", error);
    alert("Error al cargar el mapa de mascotas");
    document.getElementById("map").innerHTML = "<p>Error al cargar las mascotas.</p>";
  }
}

// Inicialización
document.addEventListener("DOMContentLoaded", loadPetsMap);