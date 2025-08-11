 // Función para obtener parámetros de la URL
    function getQueryParams() {
        const params = {};
        const queryString = window.location.search.substring(1);
        const vars = queryString.split("&");
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split("=");
            params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
        return params;
    }

    // Función para llenar los campos con los datos recibidos
    function llenarCampos() {
        const params = getQueryParams();
        if (params.guia) {
            document.getElementById("guia-registrada").value = params.guia;
        }
        if (params.cantidad) {
            document.getElementById("cantidad-animales").value = params.cantidad;
        }
        if (params.fecha) {
            document.getElementById("fecha-guia-ica").value = params.fecha;
        }
    }

    window.onload = llenarCampos;

function cargarMarcasEnDestino() {
    fetch('../back/listar_clientes.php')
        .then(response => response.json())
        .then(data => {
            const selectDestino = document.getElementById('destino-select');
            if (!selectDestino) {
                console.error('Elemento destino-select no encontrado');
                return;
            }
            
            selectDestino.innerHTML = '<option value="">Seleccione destino</option>';
            
            // Guardar datos completos para búsqueda posterior
            window.clientesData = data;
            
            // Extraer marcas únicas y no vacías
            const marcasUnicas = [...new Set(data.map(cliente => cliente.marca).filter(marca => marca && marca.trim() !== ''))];
            
            marcasUnicas.forEach(marca => {
                const option = document.createElement('option');
                option.value = marca;
                option.textContent = marca;
                selectDestino.appendChild(option);
            });

            // Evento para llenar campos al seleccionar marca
            selectDestino.addEventListener('change', function() {
                const marcaSeleccionada = this.value;
                const clienteInput = document.getElementById('cliente-input');
                const cedulaInput = document.getElementById('cedula-input');

                if (!clienteInput || !cedulaInput) {
                    console.error('Campos cliente-input o cedula-input no encontrados');
                    return;
                }

                if (marcaSeleccionada === '') {
                    clienteInput.value = '';
                    cedulaInput.value = '';
                    return;
                }

                // Buscar primer cliente con la marca seleccionada
                const cliente = window.clientesData.find(c => c.marca === marcaSeleccionada);
                if (cliente) {
                    clienteInput.value = cliente.nombre || '';
                    cedulaInput.value = cliente.cedula || '';
                } else {
                    clienteInput.value = '';
                    cedulaInput.value = '';
                }
            });
            
            console.log('Marcas cargadas en destino:', marcasUnicas);
        })
        .catch(error => {
            console.error('Error al cargar marcas en destino:', error);
            const selectDestino = document.getElementById('destino-select');
            if (selectDestino) {
                selectDestino.innerHTML = '<option value="">Error al cargar destinos</option>';
            }
        });
}

document.addEventListener('DOMContentLoaded', function() {
    cargarMarcasEnDestino();
});
