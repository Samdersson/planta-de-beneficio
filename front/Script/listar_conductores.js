document.addEventListener('DOMContentLoaded', () => {
    const listarBtn = document.getElementById('listar-conductores-btn');
    const listaConductoresDiv = document.getElementById('lista-conductores');
    const conductoresTableBody = document.querySelector('#conductores-table tbody');
    const selectConductor = document.getElementById('select_conductor');

    listarBtn.addEventListener('click', () => {
        fetch('../back/validaciones/listar_conductor.php')
            .then(response => response.json())
            .then(data => {
                conductoresTableBody.innerHTML = '';
                selectConductor.innerHTML = '<option value="">Seleccione un conductor</option>';
                if (data.length === 0) {
                    conductoresTableBody.innerHTML = '<tr><td colspan="3">No hay conductores disponibles</td></tr>';
                } else {
                    data.forEach(conductor => {
                        // Populate table
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${conductor.cedula}</td>
                            <td>${conductor.nombre}</td>
                            <td>${conductor.telefono}</td>
                        `;
                        conductoresTableBody.appendChild(row);

                        // Populate dropdown
                        const option = document.createElement('option');
                        option.value = conductor.cedula;
                        option.textContent = conductor.nombre;
                        selectConductor.appendChild(option);
                    });
                }
                listaConductoresDiv.style.display = 'block';
            })
            .catch(error => {
                console.error('Error al listar conductores:', error);
                conductoresTableBody.innerHTML = '<tr><td colspan="3">Error al cargar conductores</td></tr>';
                listaConductoresDiv.style.display = 'block';
            });
    });
});
