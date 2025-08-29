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
    
    // Primero verificar si hay datos en sessionStorage (modo edición)
    const guiaEditar = sessionStorage.getItem('guiaEditar');
    
    if (guiaEditar) {
        // Modo edición: usar datos de sessionStorage
        const guia = JSON.parse(guiaEditar);
        document.getElementById("guia-registrada").value = guia.numero_guia || '';
        document.getElementById("cantidad-animales").value = guia.cantidad_animales || '';
        document.getElementById("fecha-guia-ica").value = guia.fecha_guia || '';
        // Limpiar sessionStorage después de usar
        sessionStorage.removeItem('guiaEditar');
    } else {
        // Modo normal: usar parámetros de URL
        if (params.numero_guia) {
            document.getElementById("guia-registrada").value = params.numero_guia;
        }
        if (params.cantidad_animales) {
            document.getElementById("cantidad-animales").value = params.cantidad_animales;
        }
        if (params.fecha_guia) {
            document.getElementById("fecha-guia-ica").value = params.fecha_guia;
        }
    }
}

// Cargar marcas de clientes para el select DESTINO
function cargarMarcas() {
    fetch('../back/listar_marcas.php')
        .then(response => response.json())
        .then(marcas => {
            const select = document.getElementById('destino-select');
            marcas.forEach(marca => {
                const option = document.createElement('option');
                option.value = marca;
                option.textContent = marca;
                select.appendChild(option);
            });
            console.log('Marcas cargadas en destino:', marcas);
        })
        .catch(error => {
            console.error('Error al cargar marcas:', error);
            
            const select = document.getElementById('destino-select');
            const defaultOptions = ['Destino1', 'Destino2', 'Destino3'];
            defaultOptions.forEach(marca => {
                const option = document.createElement('option');
                option.value = marca;
                option.textContent = marca;
                select.appendChild(option);
            });
        });
}

// Función para buscar cliente por marca y llenar campos
function buscarClientePorMarca(marca) {
    if (!marca) return;
    
    fetch(`../back/buscar_cliente_por_marca.php?marca=${encodeURIComponent(marca)}`)
        .then(response => response.json())
        .then(cliente => {
            if (cliente.error) {
                console.warn(cliente.error);
                return;
            }
            
            // Llenar campos de nombre y cédula
            const clienteInput = document.getElementById('cliente-input');
            const cedulaInput = document.getElementById('cedula-input');
            
            if (clienteInput) clienteInput.value = cliente.nombre || '';
            if (cedulaInput) cedulaInput.value = cliente.cedula || '';
        })
        .catch(error => {
            console.error('Error al buscar cliente:', error);
        });
}

// Event listener para cambio de selección en destino
function configurarEventoDestino() {
    const selectDestino = document.getElementById('destino-select');
    if (selectDestino) {
        selectDestino.addEventListener('change', function() {
            buscarClientePorMarca(this.value);
        });
    }
}

window.onload = function() {
    cargarMarcas();
    llenarCampos();
    configurarEventoDestino();
};
