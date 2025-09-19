document.addEventListener('DOMContentLoaded', () => {
    const selectVeterinario = document.getElementById('select_veterinario');

    function listar_veterinarios() {
        fetch('../back/buscar_veterinario.php')
            .then(response => response.json())
            .then(data => {
                selectVeterinario.innerHTML = '<option value="">Seleccione un veterinario</option>';
                if (data.length === 0) {
                    const option = document.createElement('option');
                    option.textContent = 'No hay veterinarios disponibles';
                    option.disabled = true;
                    selectVeterinario.appendChild(option);
                } else {
                    data.forEach(veterinario => {
                        const option = document.createElement('option');
                        option.value = veterinario.cedula;
                        option.textContent = veterinario.nombre;
                        selectVeterinario.appendChild(option);
                    });
                }

            })
            .catch(error => {
                console.error('Error al listar veterinarios:', error);
                selectVeterinario.innerHTML = '<option value="">Error al cargar veterinarios</option>';
            });
    }

    listar_veterinarios();
});
