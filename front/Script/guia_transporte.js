document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('guia_transporte.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('numeroGuia')) {
            const numeroGuia = urlParams.get('numeroGuia');
            const marca = urlParams.get('marca');
            const clienteNombre = urlParams.get('clienteNombre');
            const clienteDestino = urlParams.get('clienteDestino');
            const clienteTelefono = urlParams.get('clienteTelefono');
            const conductorNombre = urlParams.get('conductorNombre');
            const conductorCedula = urlParams.get('conductorCedula');
            const veterinarioNombre = urlParams.get('veterinarioNombre');
            const veterinarioCedula = urlParams.get('veterinarioCedula');

            
            document.getElementById('numero-orden').value = numeroGuia;
            const marcaInput = document.getElementById('marca-input');
            if (marcaInput) {
                marcaInput.value = marca;
                
                const event = new Event('input', { bubbles: true });
                marcaInput.dispatchEvent(event);
            }

            const clienteRow = document.querySelector('#cliente-table tbody tr');
            clienteRow.cells[0].textContent = clienteNombre;
            clienteRow.cells[1].textContent = clienteDestino;
            clienteRow.cells[2].textContent = clienteTelefono;
            clienteRow.cells[3].textContent = numeroGuia;

            
            function formatearCedula(cedula) {
                if (!cedula) return '';
                return cedula.toString().replace(/\D/g, '').replace(/(\d{1,3})(?=(\d{3})+(?!\d))/g, '$1 ');
            }

            const vehiculoRow = document.querySelector('#vehiculo-table tbody tr');
            vehiculoRow.cells[0].textContent = 'Furgón';
            vehiculoRow.cells[1].textContent = 'UFG 687';
            vehiculoRow.cells[2].textContent = 'X';
            vehiculoRow.cells[3].textContent = conductorNombre;
            vehiculoRow.cells[4].textContent = formatearCedula(conductorCedula);

            const firmaRow = document.querySelector('#firma-table tbody tr');
            firmaRow.cells[0].textContent = veterinarioNombre;
            firmaRow.cells[1].textContent = veterinarioCedula;
            firmaRow.cells[2].textContent = 'VETERINARIO';
            firmaRow.cells[3].textContent = '322 447 0297';

            
            const decomisosTableBody = document.querySelector('#decomisos-guia-table tbody');
            decomisosTableBody.innerHTML = '';
            const animals = [];
            for (let i = 1; ; i++) {
                const animal = urlParams.get(`animal${i}`);
                if (!animal) break;
                animals.push(animal);
            }
            
            animals.forEach(async (numeroAnimal) => {
                try {
                    const response = await fetch(`../back/buscar_decomisos_por_numero_animal.php?numero_animal=${encodeURIComponent(numeroAnimal)}`);
                    const data = await response.json();
                    if (data && data.length > 0) {
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
        }
    }
});

const buscarGuiaBtn = document.getElementById('buscar-guia-btn');
const numeroGuiaInput = document.getElementById('numero-guia');
const listaAnimalesSelect = document.getElementById('lista-animales');
const guiaDetallesDiv = document.getElementById('guia-detalles');
const detalleNumeroGuia = document.getElementById('detalle-numero-guia');
const detalleCantidadAnimales = document.getElementById('detalle-cantidad-animales');
const detalleFechaGuia = document.getElementById('detalle-fecha-guia');
const detalleCedulaProductor = document.getElementById('detalle-cedula-productor');
const detalleCedulaUsuario = document.getElementById('detalle-cedula-usuario');

function limpiarListaAnimales() {
    listaAnimalesSelect.innerHTML = '<option value="">Seleccione un animal</option>';
}

function ocultarDetallesGuia() {
    guiaDetallesDiv.style.display = 'none';
    detalleNumeroGuia.textContent = '';
    detalleCantidadAnimales.textContent = '';
    detalleFechaGuia.textContent = '';
    detalleCedulaProductor.textContent = '';
    detalleCedulaUsuario.textContent = '';
}

function mostrarDetallesGuia(guia) {
    guiaDetallesDiv.style.display = 'block';
    detalleNumeroGuia.textContent = guia.numero_guia || '';
    detalleCantidadAnimales.textContent = guia.cantidad_animales || '';
    detalleFechaGuia.textContent = guia.fecha_guia || '';
    detalleCedulaProductor.textContent = guia.cedula_productor || '';
    detalleCedulaUsuario.textContent = guia.cedula_usuario || '';
}

let guiaActual = null; // Variable global para almacenar datos de la guía actual
let animalesDetallados = []; // Variable global para almacenar datos detallados de animales

buscarGuiaBtn.addEventListener('click', async () => {
    const numeroGuia = numeroGuiaInput.value.trim();
    limpiarListaAnimales();
    ocultarDetallesGuia();
    ocultarMarcaCliente();

    if (!numeroGuia) {
        alert('Por favor, ingrese un número de guía.');
        return;
    }

    try {
        // Obtener detalles de la guía
        const guiaResponse = await fetch(`../back/buscar_guia.php?numero_guia=${encodeURIComponent(numeroGuia)}`);
        if (!guiaResponse.ok) {
            throw new Error('Error en la respuesta del servidor al obtener la guía');
        }
        const guiaData = await guiaResponse.json();

        if (guiaData.error) {
            alert(guiaData.error);
            return;
        }

        guiaActual = guiaData; // Guardar datos de la guía actual

        // Obtener animales asociados a la guía
        const animalesResponse = await fetch(`../back/buscar_animales_por_guia.php?numero_guia=${encodeURIComponent(numeroGuia)}`);
        if (!animalesResponse.ok) {
            throw new Error('Error en la respuesta del servidor al obtener los animales');
        }
        const animalesData = await animalesResponse.json();

        if (animalesData.error) {
            alert(animalesData.error);
            return;
        }

        if (!animalesData || animalesData.length === 0) {
            alert('No se encontraron animales para esta guía.');
            return;
        }

        listaAnimalesSelect.innerHTML = '';
        animalesData.forEach(animal => {
            const option = document.createElement('option');
            option.value = animal.numero_animal;
            option.textContent = animal.numero_animal;
            listaAnimalesSelect.appendChild(option);
        });

        // Cargar información del cliente para el primer animal
        if (animalesData.length > 0) {
            const firstAnimal = animalesData[0].numero_animal;
            try {
                const marcaResponse = await fetch(`../back/buscar_marca_por_numero_animal.php?numero_animal=${encodeURIComponent(firstAnimal)}`);
                if (!marcaResponse.ok) {
                    throw new Error('Error al obtener la marca');
                }
                const marcaData = await marcaResponse.json();
                if (marcaData.error) {
                    alert(marcaData.error);
                } else {
                    mostrarMarcaCliente(marcaData.marca);

                    const clienteResponse = await fetch(`../back/buscar_cliente_por_marca.php?marca=${encodeURIComponent(marcaData.marca)}`);
                    if (!clienteResponse.ok) {
                        throw new Error('Error al obtener los detalles del cliente');
                    }
                    const clienteData = await clienteResponse.json();
                    if (clienteData.error) {
                        alert(clienteData.error);
                    } else {
                        // Mostrar datos en tabla cliente
                        const clienteRow = document.querySelector('#cliente-table tbody tr');
                        if (clienteRow) {
                            clienteRow.cells[0].textContent = clienteData.nombre || '';
                            clienteRow.cells[1].textContent = clienteData.destino || '';
                            clienteRow.cells[2].textContent = clienteData.telefono || '';
                            clienteRow.cells[3].textContent = numeroGuia || '';
                        }
                    }
                }
            } catch (error) {
                console.error('Error al cargar la marca y cliente:', error);
                alert('Error al cargar la marca y cliente. Por favor, inténtelo de nuevo.');
            }
        }

        // Cargar datos detallados de animales para la tabla de producto
        try {
            const animalesDetalladosResponse = await fetch(`../back/buscar_animales_por_guia_detallado.php?numero_guia=${encodeURIComponent(numeroGuia)}`);
            if (!animalesDetalladosResponse.ok) {
                throw new Error('Error al obtener los datos detallados de animales');
            }
            animalesDetallados = await animalesDetalladosResponse.json();
            if (animalesDetallados.error) {
                alert(animalesDetallados.error);
            } else if (animalesDetallados && animalesDetallados.length > 0) {
                // Inicialmente no llenar la tabla producto aquí
                const productoTableBody = document.querySelector('#producto-table tbody');
                productoTableBody.innerHTML = '';
            }
        } catch (error) {
            console.error('Error al cargar los datos detallados de animales:', error);
            alert('Error al cargar los datos detallados de animales. Por favor, inténtelo de nuevo.');
        }

        // Cargar decomisos para todos los animales
        const decomisosTableBody = document.querySelector('#decomisos-guia-table tbody');
        decomisosTableBody.innerHTML = '';
        const decomisosDiv = document.getElementById('decomisos-lista');
        for (const animal of animalesData) {
            try {
                const decomisosResponse = await fetch(`../back/buscar_decomisos_por_numero_animal.php?numero_animal=${encodeURIComponent(animal.numero_animal)}`);
                if (!decomisosResponse.ok) {
                    throw new Error('Error al obtener los decomisos');
                }
                const decomisosData = await decomisosResponse.json();
                if (decomisosData.error) {
                    alert(decomisosData.error);
                } else if (decomisosData && decomisosData.length > 0) {
                    decomisosData.forEach(decomiso => {
                        const row = document.createElement('tr');

                        const idCell = document.createElement('td');
                        idCell.textContent = decomiso.id;
                        row.appendChild(idCell);

                        const productoCell = document.createElement('td');
                        productoCell.textContent = decomiso.producto;
                        row.appendChild(productoCell);

                        const motivoCell = document.createElement('td');
                        motivoCell.textContent = decomiso.motivo;
                        row.appendChild(motivoCell);

                        const cantidadCell = document.createElement('td');
                        cantidadCell.textContent = decomiso.cantidad;
                        row.appendChild(cantidadCell);

                        const numeroAnimalCell = document.createElement('td');
                        numeroAnimalCell.textContent = decomiso.numero_animal;
                        row.appendChild(numeroAnimalCell);

                        decomisosTableBody.appendChild(row);
                    });
                    decomisosDiv.style.display = 'block';
                }
            } catch (error) {
                console.error('Error al cargar los decomisos:', error);
                alert('Error al cargar los decomisos. Por favor, inténtelo de nuevo.');
            }
        }
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        alert('Error al cargar los datos. Por favor, inténtelo de nuevo.');
    }
});

listaAnimalesSelect.addEventListener('change', async () => {
    const numeroAnimal = listaAnimalesSelect.value;
    ocultarMarcaCliente();
    ocultarClienteDetalles();
    ocultarDecomisos();

    if (!numeroAnimal) {
        return;
    }

    try {
        const response = await fetch(`../back/buscar_marca_por_numero_animal.php?numero_animal=${encodeURIComponent(numeroAnimal)}`);
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor al obtener la marca');
        }
        const data = await response.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        mostrarMarcaCliente(data.marca);

        // Obtener detalles del cliente por marca
        const clienteResponse = await fetch(`../back/buscar_cliente_por_marca.php?marca=${encodeURIComponent(data.marca)}`);
        if (!clienteResponse.ok) {
            throw new Error('Error en la respuesta del servidor al obtener los detalles del cliente');
        }
        const clienteData = await clienteResponse.json();

        if (clienteData.error) {
            alert(clienteData.error);
            return;
        }

        mostrarClienteDetalles(clienteData.nombre, clienteData.destino, clienteData.telefono, guiaActual ? guiaActual.numero_guia : '');

        // Mostrar detalles de la guía usando datos almacenados
        if (guiaActual) {
            const guiaDetallesDiv = document.getElementById('guia-detalles');
            if (guiaDetallesDiv) {
                guiaDetallesDiv.style.display = 'block';
            }
            document.getElementById('detalle-numero-guia').textContent = guiaActual.numero_guia || '';
            document.getElementById('detalle-cantidad-animales').textContent = guiaActual.cantidad_animales || '';
            document.getElementById('detalle-fecha-guia').textContent = guiaActual.fecha_guia || '';
            document.getElementById('detalle-cedula-productor').textContent = guiaActual.cedula_productor || '';
            document.getElementById('detalle-cedula-usuario').textContent = guiaActual.cedula_usuario || '';
        }

        // Actualizar tabla producto con datos del animal seleccionado
        const productoTableBody = document.querySelector('#producto-table tbody');
        productoTableBody.innerHTML = '';
        const animalSeleccionado = animalesDetallados.find(animal => animal.numero_animal === numeroAnimal);
        if (animalSeleccionado) {
            const row = document.createElement('tr');
            const lotePesoTiquete = `${animalSeleccionado.numero_animal || ''}-${animalSeleccionado.sexo || ''}-${animalSeleccionado.peso || ''}Kg-${animalSeleccionado.numero_tiquete || ''}`;
            row.innerHTML = `
                <td>${lotePesoTiquete}</td>
                <td contenteditable="true">${animalSeleccionado.carne_en_octavo !== null && animalSeleccionado.carne_en_octavo !== undefined ? animalSeleccionado.carne_en_octavo : '8'}</td>
                <td contenteditable="true">${animalSeleccionado.viceras_blancas !== null && animalSeleccionado.viceras_blancas !== undefined ? animalSeleccionado.viceras_blancas : '1'}</td>
                <td contenteditable="true">${animalSeleccionado.viceras_rojas !== null && animalSeleccionado.viceras_rojas !== undefined ? animalSeleccionado.viceras_rojas : '1'}</td>
                <td contenteditable="true">${animalSeleccionado.cabezas !== null && animalSeleccionado.cabezas !== undefined ? animalSeleccionado.cabezas : '1'}</td>
                <td contenteditable="true">${animalSeleccionado.temperatura_promedio !== null && animalSeleccionado.temperatura_promedio !== undefined ? animalSeleccionado.temperatura_promedio : '39° - 39.5°'}</td>
                <td contenteditable="true">${animalSeleccionado.dictamen !== null && animalSeleccionado.dictamen !== undefined ? animalSeleccionado.dictamen : 'A'}</td>
            `;
            productoTableBody.appendChild(row);
        }

        // Obtener decomisos asociados al numero de animal
        const decomisosResponse = await fetch(`../back/buscar_decomisos_por_numero_animal.php?numero_animal=${encodeURIComponent(numeroAnimal)}`);
        if (!decomisosResponse.ok) {
            throw new Error('Error en la respuesta del servidor al obtener los decomisos');
        }
        const decomisosData = await decomisosResponse.json();

        if (decomisosData.error) {
            alert(decomisosData.error);
            return;
        }

        if (!decomisosData || decomisosData.length === 0) {
            
            return;
        }

        mostrarDecomisos(decomisosData);
    } catch (error) {
        console.error('Error al cargar la marca, detalles del cliente o decomisos:', error);
        alert('Error al cargar la marca, detalles del cliente o decomisos. Por favor, inténtelo de nuevo.');
    }
});

/*listaAnimalesSelect.addEventListener('change', async () => {
    const numeroAnimal = listaAnimalesSelect.value;
    ocultarMarcaCliente();
    ocultarClienteDetalles();
    ocultarDecomisos();

    if (!numeroAnimal) {
        return;
    }

    try {
        const response = await fetch(`../back/buscar_marca_por_numero_animal.php?numero_animal=${encodeURIComponent(numeroAnimal)}`);
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor al obtener la marca');
        }
        const data = await response.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        mostrarMarcaCliente(data.marca);

        // Obtener detalles del cliente por marca
        const clienteResponse = await fetch(`../back/buscar_cliente_por_marca.php?marca=${encodeURIComponent(data.marca)}`);
        if (!clienteResponse.ok) {
            throw new Error('Error en la respuesta del servidor al obtener los detalles del cliente');
        }
        const clienteData = await clienteResponse.json();

        if (clienteData.error) {
            alert(clienteData.error);
            return;
        }

        mostrarClienteDetalles(clienteData.nombre, clienteData.destino);

        // Obtener decomisos asociados al numero de animal
        const decomisosResponse = await fetch(`../back/buscar_decomisos_por_numero_animal.php?numero_animal=${encodeURIComponent(numeroAnimal)}`);
        if (!decomisosResponse.ok) {
            throw new Error('Error en la respuesta del servidor al obtener los decomisos');
        }
        const decomisosData = await decomisosResponse.json();

        if (decomisosData.error) {
            alert(decomisosData.error);
            return;
        }

        if (!decomisosData || decomisosData.length === 0) {
            
            return;
        }

        mostrarDecomisos(decomisosData);
    } catch (error) {
        console.error('Error al cargar la marca, detalles del cliente o decomisos:', error);
        alert('Error al cargar la marca, detalles del cliente o decomisos. Por favor, inténtelo de nuevo.');
    }
});*/

function mostrarDecomisos(decomisos) {
    const decomisosDiv = document.getElementById('decomisos-lista');
    const decomisosTableBody = document.querySelector('#decomisos-guia-table tbody');
    decomisosTableBody.innerHTML = '';

    decomisos.forEach(decomiso => {
        const row = document.createElement('tr');

        const idCell = document.createElement('td');
        idCell.textContent = decomiso.id;
        row.appendChild(idCell);

        const productoCell = document.createElement('td');
        productoCell.textContent = decomiso.producto;
        row.appendChild(productoCell);

        const motivoCell = document.createElement('td');
        motivoCell.textContent = decomiso.motivo;
        row.appendChild(motivoCell);

        const cantidadCell = document.createElement('td');
        cantidadCell.textContent = decomiso.cantidad;
        row.appendChild(cantidadCell);

        // const cedulaVetCell = document.createElement('td');
        // cedulaVetCell.textContent = decomiso.cedula_veterinario;
        // row.appendChild(cedulaVetCell);

        const numeroAnimalCell = document.createElement('td');
        numeroAnimalCell.textContent = decomiso.numero_animal;
        row.appendChild(numeroAnimalCell);

        decomisosTableBody.appendChild(row);
    });

    decomisosDiv.style.display = 'block';
}

function ocultarDecomisos() {
    const decomisosDiv = document.getElementById('decomisos-lista');
    const decomisosTableBody = document.querySelector('#decomisos-guia-table tbody');
    decomisosTableBody.innerHTML = '';
    decomisosDiv.style.display = 'none';
}

function mostrarMarcaCliente(marca) {
    // Instead of showing marca in the div with id 'marca-cliente', set it in the input with id 'marca-input'
    const marcaInput = document.getElementById('marca-input');
    if (marcaInput) {
        marcaInput.value = marca || '';
    }
    // Hide the marca-cliente div if visible
    const marcaDiv = document.getElementById('marca-cliente');
    if (marcaDiv) {
        marcaDiv.style.display = 'none';
    }
}

function ocultarMarcaCliente() {
    const marcaInput = document.getElementById('marca-input');
    if (marcaInput) {
        marcaInput.value = '';
    }
    const marcaDiv = document.getElementById('marca-cliente');
    if (marcaDiv) {
        marcaDiv.style.display = 'none';
    }
}

function mostrarClienteDetalles(nombre, destino, telefono, numeroGuia) {
    const clienteRow = document.querySelector('#cliente-table tbody tr');
    if (clienteRow) {
        clienteRow.cells[0].textContent = nombre || '';
        clienteRow.cells[1].textContent = destino || '';
        clienteRow.cells[2].textContent = telefono || '';
        clienteRow.cells[3].textContent = numeroGuia || '';
    }
}

function ocultarClienteDetalles() {
    const clienteDiv = document.getElementById('cliente-detalles');
    const clienteNombre = document.getElementById('cliente-nombre');
    const clienteDestino = document.getElementById('cliente-destino');
    clienteNombre.textContent = '';
    clienteDestino.textContent = '';
    clienteDiv.style.display = 'none';
}
