let tbody, fechaInicioInput, fechaFinInput, btnAgregar, messageContainer;

document.addEventListener('DOMContentLoaded', () => {
    tbody = document.getElementById('registro-tbody');
    fechaInicioInput = document.getElementById('fecha_inicio');
    fechaFinInput = document.getElementById('fecha_fin');
    btnAgregar = document.getElementById('btn-agregar');
    messageContainer = document.getElementById('message-container');
    btnImprimir = document.getElementById('btn-imprimir');

    

    btnImprimir.addEventListener('click', () => {
        window.print();
    });

    btnAgregar.addEventListener('click', () => {
        cargarDatos();
    });
});



async function imprimir() {
    
    window.print();
    
}

async function cargarDatos() {
    const fechaInicio = fechaInicioInput.value;
    const fechaFin = fechaFinInput.value;

    if (!fechaInicio || !fechaFin) {
        messageContainer.textContent = 'Por favor, selecciona ambas fechas: inicio y fin.';
        tbody.innerHTML = '';
        actualizarTotales(0, 0, 0, 0);
        return;
    }

    if (fechaInicio > fechaFin) {
        messageContainer.textContent = 'La fecha de inicio no puede ser mayor que la fecha fin.';
        tbody.innerHTML = '';
        actualizarTotales(0, 0, 0, 0);
        return;
    }

    messageContainer.textContent = '';

    try {
        const response = await fetch(`../back/listar_animales.php?fecha_inicio=${encodeURIComponent(fechaInicio)}&fecha_fin=${encodeURIComponent(fechaFin)}`);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const responseText = await response.text();
        if (!responseText.trim()) {
            messageContainer.textContent = 'No hay datos para mostrar en el rango de fechas seleccionado.';
            tbody.innerHTML = '';
            actualizarTotales(0, 0, 0, 0);
            return;
        }

        // Intentar parsear JSON
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (jsonError) {
            console.error('Error parsing JSON:', jsonError, 'Response:', responseText);
            throw new Error('Formato de respuesta inválido del servidor');
        }

        if (data.error) {
            messageContainer.textContent = data.error;
            tbody.innerHTML = '';
            actualizarTotales(0, 0, 0, 0);
            return;
        }

        const grouped = {};

        data.forEach(item => {
            const marca = item.marca || 'Sin Marca';
            const especie = item.especie.toLowerCase(); // 'bovino' o 'porcino'
            const sexo = item.sexo.toUpperCase(); // 'M' o 'H'

            if (!grouped[marca]) {
                grouped[marca] = {
                    marca: marca,
                    cedula: item.cedula,
                    bobinos: { macho: 0, hembra: 0 },
                    porcinos: { macho: 0, hembra: 0 }
                };
            }

            if (especie === 'bovino') { // bobinos
                if (sexo === 'M') {
                    grouped[marca].bobinos.macho++;
                } else if (sexo === 'H') {
                    grouped[marca].bobinos.hembra++;
                }
            } else if (especie === 'porcino') { // porcinos
                if (sexo === 'M') {
                    grouped[marca].porcinos.macho++;
                } else if (sexo === 'H') {
                    grouped[marca].porcinos.hembra++;
                }
            }
        });

        
        const marcasUnicas = Object.keys(grouped);
        const clientesInfo = {};

        for (const marca of marcasUnicas) {
            if (marca !== 'Sin Marca') {
                try {
                    const clienteResponse = await fetch(`../back/buscar_cliente_por_marca.php?marca=${encodeURIComponent(marca)}`);
                    const clienteData = await clienteResponse.json();
                    
                    if (!clienteData.error) {
                        clientesInfo[marca] = {
                            nombre: clienteData.nombre,
                            cedula: clienteData.cedula
                        };
                    } else {
                        clientesInfo[marca] = {
                            nombre: 'Cliente no encontrado',
                            cedula: grouped[marca].cedula || 'N/A'
                        };
                    }
                } catch (error) {
                    console.error(`Error obteniendo cliente para marca ${marca}:`, error);
                    clientesInfo[marca] = {
                        nombre: 'Error al obtener cliente',
                        cedula: grouped[marca].cedula || 'N/A'
                    };
                }
            } else {
                clientesInfo[marca] = {
                    nombre: 'Sin Cliente',
                    cedula: 'N/A'
                };
            }
        }

        
        tbody.innerHTML = '';

        
        let totalBobinosMacho = 0;
        let totalBobinosHembra = 0;
        let totalPorcinosMacho = 0;
        let totalPorcinosHembra = 0;

        
        for (const marca in grouped) {
            const row = document.createElement('tr');

            const tdNombre = document.createElement('td');
            tdNombre.textContent = clientesInfo[marca]?.nombre || 'N/A';

            const tdCC = document.createElement('td');
            tdCC.textContent = clientesInfo[marca]?.cedula || 'N/A';

            const tdMarca = document.createElement('td');
            tdMarca.textContent = marca;

            const tdBobinosMacho = document.createElement('td');
            tdBobinosMacho.textContent = grouped[marca].bobinos.macho;

            const tdBobinosHembra = document.createElement('td');
            tdBobinosHembra.textContent = grouped[marca].bobinos.hembra;

            const tdPorcinosMacho = document.createElement('td');
            tdPorcinosMacho.textContent = grouped[marca].porcinos.macho;

            const tdPorcinosHembra = document.createElement('td');
            tdPorcinosHembra.textContent = grouped[marca].porcinos.hembra;

            row.appendChild(tdNombre);
            row.appendChild(tdCC);
            row.appendChild(tdMarca);
            row.appendChild(tdBobinosMacho);
            row.appendChild(tdBobinosHembra);
            row.appendChild(tdPorcinosMacho);
            row.appendChild(tdPorcinosHembra);

            tbody.appendChild(row);

        
            totalBobinosMacho += grouped[marca].bobinos.macho;
            totalBobinosHembra += grouped[marca].bobinos.hembra;
            totalPorcinosMacho += grouped[marca].porcinos.macho;
            totalPorcinosHembra += grouped[marca].porcinos.hembra;
        }

        actualizarTotales(totalBobinosMacho, totalBobinosHembra, totalPorcinosMacho, totalPorcinosHembra);
    } catch (error) {
        console.error('Error fetching animales:', error);
        messageContainer.textContent = 'Error al cargar los datos de animales.';
    }
}

function actualizarTotales(bm, bh, pm, ph) {
    document.getElementById('total-bobinos-macho').textContent = bm;
    document.getElementById('total-bobinos-hembra').textContent = bh;
    document.getElementById('total-porcinos-macho').textContent = pm;
    document.getElementById('total-porcinos-hembra').textContent = ph;
}
