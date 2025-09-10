document.addEventListener('DOMContentLoaded', () => {
    const generarGuiaBtn = document.getElementById('generar-guia-btn');

    generarGuiaBtn.addEventListener('click', () => {
        // Obtener valores de crear_guia_transporte.html
        const numeroGuia = document.getElementById('numero-guia').value;
        const marca = document.getElementById('marca-text').textContent;
        const clienteNombre = document.getElementById('cliente-nombre').textContent;
        const clienteDestino = document.getElementById('cliente-destino').textContent;
        const clienteTelefono = ''; // No hay campo visible para teléfono, se puede agregar si existe

        // Obtener conductor seleccionado
        const selectConductor = document.getElementById('select_conductor');
        const conductorCedula = selectConductor.value;
        const conductorNombre = selectConductor.options[selectConductor.selectedIndex].text;

        // Obtener veterinario seleccionado
        const selectVeterinario = document.getElementById('select_veterinario');
        const veterinarioCedula = selectVeterinario.value;
        const veterinarioNombre = selectVeterinario.options[selectVeterinario.selectedIndex].text;

        // Construir URL con parámetros para pasar a guia_transporte.html
        const params = new URLSearchParams();
        params.append('numeroGuia', numeroGuia);
        params.append('marca', marca);
        params.append('clienteNombre', clienteNombre);
        params.append('clienteDestino', clienteDestino);
        params.append('clienteTelefono', clienteTelefono);
        params.append('conductorNombre', conductorNombre);
        params.append('conductorCedula', conductorCedula);
        params.append('veterinarioNombre', veterinarioNombre);
        params.append('veterinarioCedula', veterinarioCedula);

        // Redirigir a guia_transporte.html con parámetros
        window.location.href = `guia_transporte.html?${params.toString()}`;
    });
});
