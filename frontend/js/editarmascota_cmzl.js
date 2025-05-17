const API_URL = "http://192.168.1.5:3000";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { "Authorization": `Bearer ${token}` } : {};
}

function fillSelect(selectId, data, label = "name") {
  const select = document.getElementById(selectId);
  select.innerHTML = '<option value="">Seleccione...</option>';
  data.forEach(item => {
    const option = document.createElement("option");
    option.value = item.id || item.identificacion;
    option.textContent = item[label] || `Sin ${label}`;
    select.appendChild(option);
  });
}

async function loadSelectData() {
  const [races, categories, genders, users] = await Promise.all([
    fetch(`${API_URL}/racecmzl`, { headers: getAuthHeaders() }).then(res => res.json()),
    fetch(`${API_URL}/categorycmzl`, { headers: getAuthHeaders() }).then(res => res.json()),
    fetch(`${API_URL}/gendercmzl`, { headers: getAuthHeaders() }).then(res => res.json()),
    fetch(`${API_URL}/userscmzl`, { headers: getAuthHeaders() }).then(res => res.json()),
  ]);

  fillSelect("race", races);
  fillSelect("category", categories);
  fillSelect("gender", genders);
  fillSelect("User", users, "fullname");
}

async function loadPetData(petId) {
  const response = await fetch(`${API_URL}/petscmzl/${petId}`, { headers: getAuthHeaders() });
  const pet = await response.json();

  document.getElementById("name").value = pet.name;
  document.getElementById("race").value = pet.race_id;
  document.getElementById("category").value = pet.category_id;
  document.getElementById("gender").value = pet.gender_id;
  document.getElementById("User").value = pet.User_id;
  document.getElementById("estado").value = pet.estado;
}

function getPetIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function setupFormHandler(petId) {
  const form = document.getElementById("petForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", document.getElementById("name").value);
    formData.append("race_id", document.getElementById("race").value);
    formData.append("category_id", document.getElementById("category").value);
    formData.append("gender_id", document.getElementById("gender").value);
    formData.append("User_id", document.getElementById("User").value);
    formData.append("estado", document.getElementById("estado").value);

    const photoInput = document.getElementById("photo");
    if (photoInput.files[0]) {
      formData.append("photo", photoInput.files[0]);
    }

    try {
      const response = await fetch(`${API_URL}/petscmzl/update/${petId}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Error al actualizar");
      }

      window.location.replace("listarMascotascmzl.html");
    } catch (error) {
      console.error("Error al actualizar mascota:", error);
      alert(`Error: ${error.message}`);
    }
  });
}

async function initializeApp() {
  const petId = getPetIdFromURL();
  if (!petId) {
    alert("ID de mascota no especificado");
    return;
  }

  await loadSelectData();
  await loadPetData(petId);
  setupFormHandler(petId);
}

document.addEventListener("DOMContentLoaded", initializeApp);
