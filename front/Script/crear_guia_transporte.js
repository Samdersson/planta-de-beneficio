document.addEventListener('DOMContentLoaded', () => {
    const agregarAnimalBtn = document.getElementById('agregar-animal-btn');
    const eliminarAnimalBtn = document.getElementById('eliminar-animal-btn');
    const listaAnimalesSelect = document.getElementById('lista-animales');
    const animalesAgregadosTableBody = document.querySelector('#animales-agregados-table tbody');
    const animalesAgregadosDiv = document.getElementById('animales-agregados');
    const productoTableBody = document.querySelector('#producto-table tbody');
    const decomisosTableBody = document.querySelector('#decomisos-guia-table tbody');
    const decomisosDiv = document.getElementById('decomisos-lista');

    let animalesSeleccionados = [];
    let animalesDetallados = [];

    function renderAnimalesAgregados() {
        animalesAgregadosTableBody.innerHTML = '';
        if (animalesSeleccionados.length === 0) {
            animalesAgregadosDiv.style.display = 'none';
            return;
        }
        animalesAgregadosDiv.style.display = 'block';
        animalesSeleccionados.forEach((animal) => {
            const row = document.createElement('tr');

            const numeroAnimalCell = document.createElement('td');
            numeroAnimalCell.textContent = animal.numeroAnimal;
            row.appendChild(numeroAnimalCell);

            const marcaCell = document.createElement('td');
            marcaCell.textContent = animal.marca;
            row.appendChild(marcaCell);

            const eliminarCell = document.createElement('td');
            const eliminarBtn = document.createElement('button');
            eliminarBtn.textContent = 'Eliminar';
            eliminarBtn.type = 'button';
            eliminarBtn.addEventListener('click', () => {
                eliminarAnimal(animal.numeroAnimal);
            });
            eliminarCell.appendChild(eliminarBtn);
            row.appendChild(eliminarCell);

            animalesAgregadosTableBody.appendChild(row);
        });
    }

    function renderProductoTable() {
        productoTableBody.innerHTML = '';
        animalesDetallados.forEach((animal) => {
            const row = document.createElement('tr');
            const lotePesoTiquete = `${animal.numero_animal || ''}-${animal.sexo || ''}-${animal.peso || ''}Kg-${animal.numero_tiquete || ''}`;
            row.innerHTML = `
                <td>${lotePesoTiquete}</td>
                <td contenteditable="true">${animal.carne_en_octavo !== null && animal.carne_en_octavo !== undefined ? animal.carne_en_octavo : '8'}</td>
                <td contenteditable="true">${animal.viceras_blancas !== null && animal.viceras_blancas !== undefined ? animal.viceras_blancas : '1'}</td>
                <td contenteditable="true">${animal.viceras_rojas !== null && animal.viceras_rojas !== undefined ? animal.viceras_rojas : '1'}</td>
                <td contenteditable="true">${animal.cabezas !== null && animal.cabezas !== undefined ? animal.cabezas : '1'}</td>
                <td contenteditable="true">${animal.temperatura_promedio !== null && animal.temperatura_promedio !== undefined ? animal.temperatura_promedio : '39° - 39.5°'}</td>
                <td contenteditable="true">${animal.dictamen !== null && animal.dictamen !== undefined ? animal.dictamen : 'A'}</td>
            `;
            productoTableBody.appendChild(row);
        });
    }

    function renderDecomisos() {
        decomisosTableBody.innerHTML = '';
        let hasDecomisos = false;
        animalesSeleccionados.forEach(async (animal) => {
            try {
                const response = await fetch(`../back/buscar_decomisos_por_numero_animal.php?numero_animal=${encodeURIComponent(animal.numeroAnimal)}`);
                const data = await response.json();
                if (data && data.length > 0) {
                    hasDecomisos = true;
                    data.forEach(decomiso => {
                        const row = document.createElement('tr');
                        row.innerHTML = `<td>${decomiso.id}</td><td>${decomiso.producto}</td><td>${decomiso.motivo}</td><td>${decomiso.cantidad}</td><td>${decomiso.numero_animal}</td>`;
                        decomisosTableBody.appendChild(row);
                    });
                }
            } catch (error) {
                console.error('Error fetching decomisos:', error);
            }
        });
        if (hasDecomisos) {
            decomisosDiv.style.display = 'block';
        } else {
            decomisosDiv.style.display = 'none';
        }
    }

    async function agregarAnimalDinamico() {
        const numeroAnimal = listaAnimalesSelect.value;
        if (!numeroAnimal) {
            return;
        }
        // Verificar si el animal ya está agregado
        if (animalesSeleccionados.some(a => a.numeroAnimal === numeroAnimal)) {
            return; // Ya agregado, no hacer nada
        }

        // Obtener la marca
        let marca = '';
        try {
            const response = await fetch(`../back/buscar_marca_por_numero_animal.php?numero_animal=${encodeURIComponent(numeroAnimal)}`);
            const data = await response.json();
            if (data.marca) {
                marca = data.marca;
                document.getElementById('marca-input').value = marca;
            }
        } catch (error) {
            console.error('Error obteniendo marca:', error);
        }

        // Agregar a la lista
        animalesSeleccionados.push({ numeroAnimal, marca });
        renderAnimalesAgregados();

        // Obtener datos detallados
        try {
            const response = await fetch(`../back/buscar_animales_por_guia_detallado.php?numero_guia=${encodeURIComponent(document.getElementById('numero-guia').value)}`);
            const data = await response.json();
            if (data && data.length > 0) {
                const animalDetalle = data.find(a => a.numero_animal === numeroAnimal);
                if (animalDetalle) {
                    animalesDetallados.push(animalDetalle);
                    renderProductoTable();
                }
            }
        } catch (error) {
            console.error('Error obteniendo datos detallados:', error);
        }

        // Render decomisos
        renderDecomisos();
    }

    function eliminarAnimal(numeroAnimal) {
        animalesSeleccionados = animalesSeleccionados.filter(a => a.numeroAnimal !== numeroAnimal);
        animalesDetallados = animalesDetallados.filter(a => a.numero_animal !== numeroAnimal);
        renderAnimalesAgregados();
        renderProductoTable();
        renderDecomisos();
    }

    // Evento para agregar dinámicamente al seleccionar
    listaAnimalesSelect.addEventListener('change', agregarAnimalDinamico);

    if (eliminarAnimalBtn) {
        eliminarAnimalBtn.addEventListener('click', () => {
            const numeroAnimal = listaAnimalesSelect.value;
            if (!numeroAnimal) {
                alert('Por favor, seleccione un animal para eliminar.');
                return;
            }
            eliminarAnimal(numeroAnimal);
        });
    }

    // Modificar el botón generar-guia-btn para enviar los animales agregados
    const generarGuiaBtn = document.getElementById('generar-guia-btn');
    if (generarGuiaBtn) {
        generarGuiaBtn.addEventListener('click', async () => {
            const marca = document.getElementById('marca-input').value || '';
            const clienteNombre = document.getElementById('cliente-nombre').textContent || '';
            const clienteDestino = document.getElementById('cliente-destino').textContent || '';
            const clienteTelefono = ''; // No se obtiene en este contexto

            // Obtener conductor seleccionado
            const selectConductor = document.getElementById('select_conductor');
            const conductorCedula = selectConductor ? selectConductor.value : '';
            const conductorNombre = selectConductor ? selectConductor.options[selectConductor.selectedIndex].text : '';

            // Obtener veterinario seleccionado
            const selectVeterinario = document.getElementById('select_veterinario');
            const veterinarioCedula = selectVeterinario ? selectVeterinario.value : '';
            const veterinarioNombre = selectVeterinario ? selectVeterinario.options[selectVeterinario.selectedIndex].text : '';

            // Obtener número de guía
            const numeroGuia = document.getElementById('detalle-numero-guia').textContent || '';

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

            // Agregar animales seleccionados a los parámetros
            animalesSeleccionados.forEach((animal, index) => {
                params.append(`animal${index + 1}`, animal.numeroAnimal);
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
                                celdaGuia.textContent = numeroGuia;
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
