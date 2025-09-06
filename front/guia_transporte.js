document.addEventListener('DOMContentLoaded', () => {
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
        // guiaDetallesDiv.style.display = 'none';
        // detalleNumeroGuia.textContent = '';
        // detalleCantidadAnimales.textContent = '';
        // detalleFechaGuia.textContent = '';
        // detalleCedulaProductor.textContent = '';
    }

    function mostrarDetallesGuia(guia) {
        // guiaDetallesDiv.style.display = 'block';
        // detalleNumeroGuia.textContent = guia.numero_guia || '';
        // detalleCantidadAnimales.textContent = guia.cantidad_animales || '';
        // detalleFechaGuia.textContent = guia.fecha_guia || '';
        // detalleCedulaProductor.textContent = guia.cedula_productor || '';
        
    }

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

            mostrarDetallesGuia(guiaData);

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

            animalesData.forEach(animal => {
                const option = document.createElement('option');
                option.value = animal.numero_animal;
                option.textContent = animal.numero_animal;
                listaAnimalesSelect.appendChild(option);
            });
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
                alert('No se encontraron decomisos para este animal.');
                return;
            }

            mostrarDecomisos(decomisosData);
        } catch (error) {
            console.error('Error al cargar la marca, detalles del cliente o decomisos:', error);
            alert('Error al cargar la marca, detalles del cliente o decomisos. Por favor, inténtelo de nuevo.');
        }
    });

    function mostrarDecomisos(decomisos) {
        const decomisosDiv = document.getElementById('decomisos-lista');
        const decomisosTableBody = document.querySelector('#decomisos-table tbody');
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
        const decomisosTableBody = document.querySelector('#decomisos-table tbody');
        decomisosTableBody.innerHTML = '';
        decomisosDiv.style.display = 'none';
    }

    function mostrarMarcaCliente(marca) {
        const marcaDiv = document.getElementById('marca-cliente');
        const marcaText = document.getElementById('marca-text');
        marcaText.textContent = marca || '';
        marcaDiv.style.display = 'block';
    }

    function ocultarMarcaCliente() {
        const marcaDiv = document.getElementById('marca-cliente');
        const marcaText = document.getElementById('marca-text');
        marcaText.textContent = '';
        marcaDiv.style.display = 'none';
    }

    function mostrarClienteDetalles(nombre, destino) {
        const clienteDiv = document.getElementById('cliente-detalles');
        const clienteNombre = document.getElementById('cliente-nombre');
        const clienteDestino = document.getElementById('cliente-destino');
        clienteNombre.textContent = nombre || '';
        clienteDestino.textContent = destino || '';
        clienteDiv.style.display = 'block';
    }

    function ocultarClienteDetalles() {
        const clienteDiv = document.getElementById('cliente-detalles');
        const clienteNombre = document.getElementById('cliente-nombre');
        const clienteDestino = document.getElementById('cliente-destino');
        clienteNombre.textContent = '';
        clienteDestino.textContent = '';
        clienteDiv.style.display = 'none';
    }
});
