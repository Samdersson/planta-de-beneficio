document.addEventListener('DOMContentLoaded', () => {
    listar_administrador(); // Cargar datos del administrador en firma-table

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

    
    const selectConductor = document.getElementById('select_conductor');
    if (selectConductor) {
        selectConductor.addEventListener('change', () => {
            const conductorNombre = selectConductor.options[selectConductor.selectedIndex].text;
            const conductorCedula = selectConductor.value;

            const vehiculoTable = document.getElementById('vehiculo-table');
            if (vehiculoTable) {
                const tbody = vehiculoTable.querySelector('tbody');
                if (tbody) {
                    const row = tbody.querySelector('tr');
                    if (row) {

                        row.cells[3].textContent = conductorNombre;
                        row.cells[4].textContent = conductorCedula;
                    }
                }
            }
        });
    }

    const selectVeterinario = document.getElementById('select_veterinario');
    if (selectVeterinario) {
        selectVeterinario.addEventListener('change', () => {
            const veterinarioNombre = selectVeterinario.options[selectVeterinario.selectedIndex].text;

            const examenTable = document.getElementById('examen-table');
            if (examenTable) {
                const tbody = examenTable.querySelector('tbody');
                if (tbody) {
                    const row = tbody.querySelector('tr');
                    if (row) {
                        row.cells[1].textContent = veterinarioNombre;
                    }
                }
            }
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

    async function fetchDecomisosPorAnimales(animales) {
        const todosDecomisos = [];
        for (const animal of animales) {
            try {
                const response = await fetch(`../back/buscar_decomisos_por_numero_animal.php?numero_animal=${encodeURIComponent(animal.numeroAnimal)}`);
                const data = await response.json();
                if (data && data.length > 0) {
                    todosDecomisos.push(...data);
                }
            } catch (error) {
                console.error('Error fetching decomisos for animal', animal.numeroAnimal, error);
            }
        }
        return todosDecomisos;
    }

    function renderDecomisos(decomisos) {
        decomisosTableBody.innerHTML = '';
        if (!decomisos || decomisos.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="10" style="text-align:center;">No hay decomisos para los animales seleccionados</td>`;
            decomisosTableBody.appendChild(row);
            decomisosDiv.style.display = 'block';
            return;
        }

        // Llenar la tabla de izquierda a derecha, 2 decomisos por fila (10 columnas)
        for (let i = 0; i < decomisos.length; i += 2) {
            const row = document.createElement('tr');

            // Primer decomiso
            const d1 = decomisos[i];
            row.innerHTML = `
                <td>${d1.id}</td>
                <td>${d1.producto}</td>
                <td>${d1.motivo}</td>
                <td>${d1.cantidad}</td>
                <td>${d1.numero_animal}</td>
            `;

            // Segundo decomiso si existe
            if (i + 1 < decomisos.length) {
                const d2 = decomisos[i + 1];
                row.innerHTML += `
                    <td>${d2.id}</td>
                    <td>${d2.producto}</td>
                    <td>${d2.motivo}</td>
                    <td>${d2.cantidad}</td>
                    <td>${d2.numero_animal}</td>
                `;
            } else {
                // Si no hay segundo decomiso, llenar con celdas vacías
                row.innerHTML += `<td colspan="5"></td>`;
            }

            decomisosTableBody.appendChild(row);
        }
        decomisosDiv.style.display = 'block';
    }

    async function agregarAnimalDinamico() {
        const numeroAnimal = listaAnimalesSelect.value;
        if (!numeroAnimal) {
            return;
        }
        if (animalesSeleccionados.some(a => a.numeroAnimal === numeroAnimal)) {
            return;
        }
        let marca = '';
        let numeroGuia = '';
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
        try {
            const guiaResponse = await fetch(`../back/buscar_numero_guia_por_animal.php?numero_animal=${encodeURIComponent(numeroAnimal)}`);
            const guiaData = await guiaResponse.json();
            if (guiaData.numero_guia) {
                numeroGuia = guiaData.numero_guia;
            }
        } catch (error) {
            console.error('Error obteniendo numero_guia:', error);
        }
        try {
            const clienteResponse = await fetch(`../back/buscar_cliente_por_marca.php?marca=${encodeURIComponent(marca)}`);
            const clienteData = await clienteResponse.json();
            if (clienteData.nombre) {
                const clienteRow = document.querySelector('#cliente-table tbody tr');
                if (clienteRow) {
                    clienteRow.cells[0].textContent = clienteData.nombre;
                    clienteRow.cells[1].textContent = clienteData.destino;
                    clienteRow.cells[2].textContent = clienteData.telefono;
                    clienteRow.cells[3].textContent = numeroGuia;
                }
            }
        } catch (error) {
            console.error('Error obteniendo cliente:', error);
        }
        animalesSeleccionados.push({ numeroAnimal, marca });
        renderAnimalesAgregados();

        try {
            if (numeroGuia) {
                const response = await fetch(`../back/buscar_animales_por_guia_detallado.php?numero_guia=${encodeURIComponent(numeroGuia)}`);
                const data = await response.json();
                console.log('Datos detallados recibidos:', data);
                if (data && data.length > 0) {
                    const animalDetalle = data.find(a => a.numero_animal === numeroAnimal);
                    if (animalDetalle) {
                        animalesDetallados.push(animalDetalle);
                        renderProductoTable();
                    } else {
                        console.warn('No se encontró detalle para el animal:', numeroAnimal);
                    }
                } else {
                    console.warn('No se recibieron datos detallados para numero_guia:', numeroGuia);
                }
            }
        } catch (error) {
            console.error('Error obteniendo datos detallados:', error);
        }
    }

    function eliminarAnimal(numeroAnimal) {
        animalesSeleccionados = animalesSeleccionados.filter(a => a.numeroAnimal !== numeroAnimal);
        animalesDetallados = animalesDetallados.filter(a => a.numero_animal !== numeroAnimal);
        renderAnimalesAgregados();
        renderProductoTable();
    }

    listaAnimalesSelect.addEventListener('change', async (event) => {
        await agregarAnimalDinamico();
        const decomisos = await fetchDecomisosPorAnimales(animalesSeleccionados);
        renderDecomisos(decomisos);
    });

    if (eliminarAnimalBtn) {
        eliminarAnimalBtn.addEventListener('click', () => {
            const numeroAnimal = listaAnimalesSelect.value;
            if (!numeroAnimal) {
                alert('Por favor, seleccione un animal para eliminar.');
                return;
            }
            eliminarAnimal(numeroAnimal);
            renderDecomisos();
        });
    }

    // Obtener número incremental para mostrar en tiempo real
    const numeroOrdenInput = document.getElementById('numero-orden');
    if (numeroOrdenInput) {
        async function actualizarNumeroIncremental() {
            const marca = document.getElementById('marca-input').value || '';
            const tipo_animal = marca === '1' ? 'bovino' : 'porcino';
            try {
                const response = await fetch(`../back/generar_numero_remision.php?tipo_animal=${tipo_animal}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.numero_remision) {
                        numeroOrdenInput.value = data.numero_remision;
                    }
                }
            } catch (error) {
                // console.error('Error al obtener número incremental:', error);
            }
        }
        actualizarNumeroIncremental();
        const marcaInput = document.getElementById('marca-input');
        if (marcaInput) {
            marcaInput.addEventListener('input', actualizarNumeroIncremental);
        }
        // Actualizar también al hacer foco en el campo numero-orden
        numeroOrdenInput.addEventListener('focus', actualizarNumeroIncremental);
    }

    const generarGuiaBtn = document.getElementById('generar-guia-btn');
    if (generarGuiaBtn) {
        generarGuiaBtn.addEventListener('click', async () => {
            const marca = document.getElementById('marca-input').value || '';
            const clienteNombre = document.getElementById('cliente-nombre').textContent || '';
            const clienteDestino = document.getElementById('cliente-destino').textContent || '';
            const clienteTelefono = '';

            const selectConductor = document.getElementById('select_conductor');
            const conductorCedula = selectConductor ? selectConductor.value : '';
            const conductorNombre = selectConductor ? selectConductor.options[selectConductor.selectedIndex].text : '';

            const selectVeterinario = document.getElementById('select_veterinario');
            const veterinarioCedula = selectVeterinario ? selectVeterinario.value : '';
            const veterinarioNombre = selectVeterinario ? selectVeterinario.options[selectVeterinario.selectedIndex].text : '';

            const numeroGuiaSpan = document.getElementById('detalle-numero-guia');
            const numeroOrdenInput = document.getElementById('numero-orden');

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

            // Detectar tipo de remisión según el título h1 con clase "title"
            let tipo_animal = 'porcino'; // valor por defecto
            const titulo = document.querySelector('h1.title');
            if (titulo) {
                if (titulo.textContent.trim() === 'REMISIONES DE BOVINOS') {
                    tipo_animal = 'bovino';
                } else if (titulo.textContent.trim() === 'REMISIONES DE PORCINOS') {
                    tipo_animal = 'porcino';
                }
            }

            const datosRemision = {
                tipo_animal: tipo_animal,
                cliente_nombre: clienteNombre,
                cliente_direccion: '',
                cliente_telefono: clienteTelefono,
                marca: marca,
                conductor_nombre: conductorNombre,
                conductor_cedula: conductorCedula,
                veterinario_nombre: veterinarioNombre,
                veterinario_cedula: veterinarioCedula,
                animales: animalesSeleccionados
            };

            try {
                const response = await fetch('../back/guardar_remision.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datosRemision)
                });

                const result = await response.json();

                if (result.success) {
                    alert('Remisión guardada con número: ' + result.numero_remision);
                    if (numeroGuiaSpan) {
                        numeroGuiaSpan.textContent = result.numero_remision;
                    }
                    if (numeroOrdenInput) {
                        numeroOrdenInput.value = result.numero_remision;
                    }
                } else {
                    alert('Error al guardar la remisión: ' + (result.error || 'Error desconocido'));
                }
            } catch (error) {
                console.error('Error al guardar la remisión:', error);
                alert('Error al guardar la remisión. Por favor intente nuevamente.');
            }
        });
    }

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

                document.getElementById('detalle-numero-guia').textContent = data.numero_guia || '';
                document.getElementById('detalle-cantidad-animales').textContent = data.cantidad_animales || '';
                document.getElementById('detalle-fecha-guia').textContent = data.fecha_guia || '';
                document.getElementById('detalle-cedula-productor').textContent = data.cedula_productor || '';
                document.getElementById('detalle-cedula-usuario').textContent = data.cedula_usuario || '';

                const guiaDetallesDiv = document.getElementById('guia-detalles');
                if (guiaDetallesDiv) {
                    guiaDetallesDiv.style.display = 'block';
                }

                const clienteTable = document.getElementById('cliente-table');
                if (clienteTable) {
                    const tbody = clienteTable.querySelector('tbody');
                    if (tbody) {
                        const filaCliente = tbody.querySelector('tr');
                        if (filaCliente) {
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
