document.addEventListener('DOMContentLoaded', async () => {
    const petId = new URLSearchParams(window.location.search).get('id');
    const API_URL = "http://192.168.1.5:3000";

    // Función para obtener los encabezados de autenticación
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    };

    try {
        const response = await fetch(`${API_URL}/petscmzl/${petId}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (response.ok) {
            // Llenar los campos de la interfaz
            document.getElementById('petPhoto').src = data.photo 
                ? `${API_URL}/images/${data.photo}` 
                : 'images/default-pet.png';
            document.getElementById('petName').textContent = data.name || 'Sin nombre';
            document.getElementById('petRace').textContent = data.race?.name || 'Sin raza';
            document.getElementById('petCategory').textContent = data.category?.name || 'Sin categoría';
            document.getElementById('petGender').textContent = data.gender?.name || 'Sin género';
            document.getElementById('petEstado').textContent = data.estado || 'Sin estado';

            // Inicializar el mapa si hay coordenadas
            const mapContainer = document.getElementById('map');
            if (data.latitude && data.longitude) {
                const map = L.map(mapContainer).setView([data.latitude, data.longitude], 13);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);
                L.marker([data.latitude, data.longitude])
                    .addTo(map)
                    .bindPopup(`<b>${data.name}</b>`)
                    .openPopup();
            } else {
                mapContainer.innerHTML = '<p>No hay datos de ubicación disponibles.</p>';
                mapContainer.style.height = 'auto';
                mapContainer.style.textAlign = 'center';
                mapContainer.style.color = '#E0E0E0';
            }
        } else {
            alert('Error: ' + (data.msg || 'No se pudo cargar la mascota'));
        }
    } catch (error) {
        console.error('Error al cargar la mascota:', error);
        alert('Error de conexión con el servidor.');
    }
});