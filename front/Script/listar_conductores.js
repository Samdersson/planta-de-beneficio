document.addEventListener('DOMContentLoaded', () => {
    const selectConductor = document.getElementById('select_conductor');

    function listar_conductores() {
        fetch('../back/validaciones/listar_conductor.php')
            .then(response => response.json())
            .then(data => {
                selectConductor.innerHTML = '<option value="">Seleccione un conductor</option>';
                if (data.length === 0) {
                    const option = document.createElement('option');
                    option.textContent = 'No hay conductores disponibles';
                    option.disabled = true;
                    selectConductor.appendChild(option);
                } else {
                    data.forEach(conductor => {
                        const option = document.createElement('option');
                        option.value = conductor.cedula;
                        option.textContent = conductor.nombre;
                        selectConductor.appendChild(option);
                    });
                }
            })
            .catch(error => {
                console.error('Error al listar conductores:', error);
                selectConductor.innerHTML = '<option value="">Error al cargar conductores</option>';
            });
    }

    listar_conductores();
});
