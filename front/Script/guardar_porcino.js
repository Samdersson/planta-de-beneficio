// Función para validar y enviar datos del formulario Porcinos.html
document.addEventListener('DOMContentLoaded', () => {
    const btnGuardar = document.querySelector('.btn-guardar');
    btnGuardar.addEventListener('click', async () => {
        // Obtener valores del formulario
        const numeroGuia = document.getElementById('guia-registrada').value.trim();
        const cantidadAnimales = document.getElementById('cantidad-animales').value.trim();
        const destino = document.getElementById('destino-select').value;
        const cliente = document.getElementById('cliente-input').value.trim();
        const cedula = document.getElementById('cedula-input').value.trim();
        const numeroAnimal = document.getElementById('no-animal-input').value.trim();
        const sexo = document.getElementById('sexo-select').value;
        const kilos = document.getElementById('kilos-input').value.trim();
        const numeroTiquete = document.getElementById('no-tiquete-input').value.trim();
        const fechaIngreso = document.getElementById('fecha-ingreso-input').value;
        const fechaGuia = document.getElementById('fecha-guia-ica').value;
        const numeroCorral = document.getElementById('no-corral-input').value.trim();

        // Validar campos obligatorios
        if (!numeroGuia || !numeroAnimal || !sexo || !kilos) {
            alert('Por favor, complete los campos obligatorios: Número de Guía, Número de Animal, Sexo y Kilos.');
            return;
        }

        // Validar sexo
        if (sexo !== 'M' && sexo !== 'H') {
            alert('El campo Sexo debe ser "M" o "H".');
            return;
        }

        // Preparar datos para enviar
        const formData = new FormData();
        formData.append('guia', numeroGuia);
        formData.append('cantidad_animales', cantidadAnimales);
        formData.append('destino', destino);
        formData.append('cliente', cliente);
        formData.append('cedula', cedula);
        formData.append('no_animal', numeroAnimal);
        formData.append('sexo', sexo);
        formData.append('peso', kilos);
        formData.append('numero_tiquete', numeroTiquete);
        formData.append('fecha_ingreso', fechaIngreso);
        formData.append('fecha_sacrificio', fechaGuia);
        formData.append('corral', numeroCorral);
        formData.append('especie', 'porcino'); // fijo para esta página

        try {
            const response = await fetch('../back/guardar_entrada.php', {
                method: 'POST',
                body: formData
            });
            const result = await response.text();
            alert(result);
        } catch (error) {
            console.error('Error al guardar porcino:', error);
            alert('Error al guardar porcino. Por favor, inténtelo de nuevo.');
        }
    });
});
