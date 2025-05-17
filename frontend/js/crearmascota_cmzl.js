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

// Función para llenar los selects con datos
function fillSelect(selectId, data, label = "name") {
  const select = document.getElementById(selectId);
  if (!select) {
    console.error(`Elemento con ID ${selectId} no encontrado`);
    return;
  }

  select.innerHTML = '<option value="">Seleccione...</option>';

  if (!Array.isArray(data)) {
    console.error(`Datos para ${selectId} no son un array`);
    return;
  }

  data.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id || item.identificacion;
    option.textContent = item[label] || `Sin ${label}`;
    select.appendChild(option);
  });
}

// Cargar datos para los selects
async function loadSelectData() {
  try {
    const [races, categories, genders, users] = await Promise.all([
      fetch(`${API_URL}/racecmzl`, { headers: getAuthHeaders() }).then((res) => res.json()),
      fetch(`${API_URL}/categorycmzl`, { headers: getAuthHeaders() }).then((res) => res.json()),
      fetch(`${API_URL}/gendercmzl`, { headers: getAuthHeaders() }).then((res) => res.json()),
      fetch(`${API_URL}/userscmzl`, { headers: getAuthHeaders() }).then((res) => res.json()),
    ]);

    fillSelect("race", races);
    fillSelect("category", categories);
    fillSelect("gender", genders);
    fillSelect("User", users, "fullname");
  } catch (error) {
    console.error("Error al cargar datos de los selects:", error);
    alert("Error al cargar datos iniciales");
  }
}

// Obtener ubicación actual del usuario
function setupGeolocation() {
  const getLocationBtn = document.getElementById("getLocation");
  if (!getLocationBtn) return;

  getLocationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          document.getElementById("latitude").value = position.coords.latitude;
          document.getElementById("longitude").value = position.coords.longitude;
        },
        (error) => {
          console.error("Error al obtener la ubicación:", error);
          alert("No se pudo obtener la ubicación. Por favor, ingrese las coordenadas manualmente.");
        }
      );
    } else {
      alert("La geolocalización no es compatible con este navegador.");
    }
  });
}

// Registrar mascota
function setupFormHandler() {
  const form = document.getElementById("petForm");
  if (!form) {
    console.error("Formulario no encontrado");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const elements = {
      name: document.getElementById("name"),
      race: document.getElementById("race"),
      category: document.getElementById("category"),
      gender: document.getElementById("gender"),
      User: document.getElementById("User"),
      estado: document.getElementById("estado"),
      photo: document.getElementById("photo"),
      latitude: document.getElementById("latitude"),
      longitude: document.getElementById("longitude"),
    };

    for (const [field, element] of Object.entries(elements)) {
      if (!element) {
        alert(`Error: Campo ${field} no encontrado`);
        return;
      }
    }

    if (!elements.name.value || !elements.estado.value) {
      alert("Nombre y estado son campos requeridos");
      return;
    }

    const formData = new FormData();
    formData.append("name", elements.name.value);
    formData.append("race_id", elements.race.value);
    formData.append("category_id", elements.category.value);
    formData.append("gender_id", elements.gender.value);
    formData.append("User_id", elements.User.value);
    formData.append("estado", elements.estado.value);
    if (elements.latitude.value) formData.append("latitude", elements.latitude.value);
    if (elements.longitude.value) formData.append("longitude", elements.longitude.value);
    if (elements.photo.files[0]) {
      formData.append("photo", elements.photo.files[0]);
    }

    try {
      const response = await fetch(`${API_URL}/petscmzl`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Respuesta del servidor:", errorData);
        throw new Error(errorData.message || "Error en el servidor");
      }

      window.location.href = "listarMascotascmzl.html";
      form.reset();
    } catch (error) {
      console.error("Error al registrar mascota:", error);
      alert(`Error: ${error.message}`);
    }
  });
}

// Inicialización
function initializeApp() {
  try {
    loadSelectData(); // Cargar datos para los selects
    setupFormHandler(); // Configurar el formulario
    setupGeolocation(); // Configurar la geolocalización
  } catch (error) {
    console.error("Error al inicializar la aplicación:", error);
    alert("Error al cargar la aplicación");
  }
}

document.addEventListener("DOMContentLoaded", initializeApp);