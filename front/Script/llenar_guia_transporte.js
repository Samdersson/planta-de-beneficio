document.addEventListener('DOMContentLoaded', () => {
    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);

    const numeroGuia = urlParams.get('numeroGuia');
    const marca = urlParams.get('marca');
    const clienteNombre = urlParams.get('clienteNombre');
    const clienteDestino = urlParams.get('clienteDestino');
    const clienteTelefono = urlParams.get('clienteTelefono');
    const conductorNombre = urlParams.get('conductorNombre');
    const conductorCedula = urlParams.get('conductorCedula');
    const veterinarioNombre = urlParams.get('veterinarioNombre');
    const veterinarioCedula = urlParams.get('veterinarioCedula');

    // Llenar marca en el input
    if (marca) {
        document.getElementById('marca-input').value = marca;
    }

    // Llenar tabla CLIENTE
    const clienteTableBody = document.querySelector('table:nth-of-type(2) tbody tr');
    if (clienteTableBody) {
        const cells = clienteTableBody.querySelectorAll('td');
        if (cells.length >= 4) {
            cells[0].textContent = clienteNombre || '';
            cells[1].textContent = clienteDestino || '';
            cells[2].textContent = clienteTelefono || '';
            cells[3].textContent = numeroGuia || '';
        }
    }

    // Llenar tabla VEHICULO TRANSPORTADOR
    const vehiculoTableBody = document.querySelector('table:nth-of-type(3) tbody tr');
    if (vehiculoTableBody) {
        const cells = vehiculoTableBody.querySelectorAll('td');
        if (cells.length >= 5) {
            cells[3].textContent = conductorNombre || '';
            cells[4].textContent = conductorCedula || '';
        }
    }

    // Llenar tabla FIRMA RESPONSABLE
    const firmaTableBody = document.querySelector('table:nth-of-type(4) tbody tr');
    if (firmaTableBody) {
        const cells = firmaTableBody.querySelectorAll('td');
        if (cells.length >= 4) {
            cells[0].textContent = veterinarioNombre || '';
            cells[1].textContent = veterinarioCedula || '';
            cells[2].textContent = 'VETERINARIO';
            cells[3].textContent = '' || ''; 
        }
    }
});
