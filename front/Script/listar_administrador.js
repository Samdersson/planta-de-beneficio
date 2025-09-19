function listar_administrador() {
    fetch('../back/listar_administrador.php')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error:', data.error);
                return;
            }
            const tabla = document.getElementById('firma-table');
            const tbody = tabla.querySelector('tbody');
            const row = tbody.querySelector('tr'); 
            if (data.length > 0) {
                const admin = data[0];
                row.cells[0].textContent = admin.nombre || '';
                row.cells[1].textContent = admin.cedula || '';
                row.cells[2].textContent = admin.rol || ''; 
            } else {
                console.warn('No se encontraron administradores.');
            }
        })
        .catch(error => console.error('Error al cargar administradores:', error));
}


