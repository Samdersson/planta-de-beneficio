document.addEventListener('DOMContentLoaded', () => {
    const generarGuiaBtn = document.getElementById('generar-guia-btn');
    const agregarAnimalesBtn = document.getElementById('agregar-animales-btn');
    const listaAnimalesSelect = document.getElementById('lista-animales');
    const listaAnimalesSeleccionados = document.getElementById('lista-animales-seleccionados');

    
    let animalesSeleccionados = [];

    
    function renderAnimalesSeleccionados() {
        listaAnimalesSeleccionados.innerHTML = '';
        animalesSeleccionados.forEach(animal => {
            const li = document.createElement('li');
            li.textContent = animal;
            listaAnimalesSeleccionados.appendChild(li);
        });
    }

    // Add selected animals from select to the list
    if (agregarAnimalesBtn) {
        agregarAnimalesBtn.addEventListener('click', () => {
            const selectedOptions = Array.from(listaAnimalesSelect.selectedOptions);
            selectedOptions.forEach(option => {
                if (option.value && !animalesSeleccionados.includes(option.value)) {
                    animalesSeleccionados.push(option.value);
                }
            });
            renderAnimalesSeleccionados();
        });
    }

    // Existing generarGuiaBtn event listener (if present)
    if (generarGuiaBtn) {
        generarGuiaBtn.addEventListener('click', async () => {
            // Obtener valores de crear_guia_transporte.html
            const numeroGuia = document.getElementById('numero-guia').value;
            const marca = document.getElementById('marca-text').textContent;
            const clienteNombre = document.getElementById('cliente-nombre').textContent;
            const clienteDestino = document.getElementById('cliente-destino').textContent;
            const clienteTelefono = ''; 

            // Obtener conductor seleccionado
            const selectConductor = document.getElementById('select_conductor');
            const conductorCedula = selectConductor.value;
            const conductorNombre = selectConductor.options[selectConductor.selectedIndex].text;

            // Obtener veterinario seleccionado
            const selectVeterinario = document.getElementById('select_veterinario');
            const veterinarioCedula = selectVeterinario.value;
            const veterinarioNombre = selectVeterinario.options[selectVeterinario.selectedIndex].text;

            // Obtener teléfono del conductor desde backend
            let conductorTelefono = '';
            if (conductorCedula) {
                try {
                    const response = await fetch(`../back/validaciones/listar_conductor.php`);
                    if (response.ok) {
                        const conductores = await response.json();
                        const conductor = conductores.find(c => c.cedula === conductorCedula);
                        if (conductor) {
                            conductorTelefono = conductor.telefono || '';
                        }
                    }
                } catch (error) {
                    console.error('Error al obtener teléfono del conductor:', error);
                }
            }

            // Construir URL con parámetros para pasar a guia_transporte.html
            const params = new URLSearchParams();
            params.append('numeroGuia', numeroGuia);
            params.append('marca', marca);
            params.append('clienteNombre', clienteNombre);
            params.append('clienteDestino', clienteDestino);
            params.append('clienteTelefono', clienteTelefono);
            params.append('conductorNombre', conductorNombre);
            params.append('conductorCedula', conductorCedula);
            params.append('conductorTelefono', conductorTelefono);
            params.append('veterinarioNombre', veterinarioNombre);
            params.append('veterinarioCedula', veterinarioCedula);

            // Add selected animals to params
            animalesSeleccionados.forEach((animal, index) => {
                params.append(`animal${index + 1}`, animal);
            });

            // Redirigir a guia_transporte.html con parámetros
            window.location.href = `guia_transporte.html?${params.toString()}`;
        });
    }

    // Nuevo: Event listener para botón buscar-guia-btn
    const buscarGuiaBtn = document.getElementById('buscar-guia-btn');
    if (buscarGuiaBtn) {
        buscarGuiaBtn.addEventListener('click', async () => {
            const numeroGuiaInput = document.getElementById('numero-guia');
            const numeroGuia = numeroGuiaInput.value.trim();

            if (!numeroGuia) {
                alert('Por favor ingrese un número de guía.');
                return;
            }

            try {
                const response = await fetch(`../back/buscar_guia.php?numero_guia=${encodeURIComponent(numeroGuia)}`);
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                const data = await response.json();

                if (data.error) {
                    alert(data.error);
                    return;
                }

                // Actualizar detalles de la guía
                document.getElementById('detalle-numero-guia').textContent = data.numero_guia || '';
                document.getElementById('detalle-cantidad-animales').textContent = data.cantidad_animales || '';
                document.getElementById('detalle-fecha-guia').textContent = data.fecha_guia || '';
                document.getElementById('detalle-cedula-productor').textContent = data.cedula_productor || '';
                document.getElementById('detalle-cedula-usuario').textContent = data.cedula_usuario || '';

                // Mostrar el div de detalles
                const guiaDetallesDiv = document.getElementById('guia-detalles');
                if (guiaDetallesDiv) {
                    guiaDetallesDiv.style.display = 'block';
                }

                // Actualizar la tabla cliente-table en la columna No° GUIA
                const clienteTable = document.getElementById('cliente-table');
                if (clienteTable) {
                    // Asumiendo que la tabla tiene una sola fila de cliente en tbody
                    const tbody = clienteTable.querySelector('tbody');
                    if (tbody) {
                        const filaCliente = tbody.querySelector('tr');
                        if (filaCliente) {
                            // La columna No° GUIA es la cuarta columna (index 3)
                            const celdaGuia = filaCliente.cells[3];
                            if (celdaGuia) {
                                celdaGuia.textContent = data.numero_guia || '';
                            }
                        }
                    }
                }

            } catch (error) {
                console.error('Error al buscar la guía:', error);
                alert('Error al buscar la guía. Por favor intente nuevamente.');
            }
        });
    }
});
