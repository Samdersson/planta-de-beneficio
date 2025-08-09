let tbody, fechaInput, btnAgregar, messageContainer;

document.addEventListener('DOMContentLoaded', () => {
    tbody = document.getElementById('registro-tbody');
    fechaInput = document.getElementById('fecha');
    btnAgregar = document.getElementById('btn-agregar');
    messageContainer = document.getElementById('message-container');

    btnAgregar.addEventListener('click', () => {
        cargarDatos();
    });
});

async function cargarDatos() {
    const fecha = fechaInput.value;
    if (!fecha) {
        messageContainer.textContent = 'Por favor, selecciona una fecha.';
        tbody.innerHTML = '';
        actualizarTotales(0, 0, 0, 0);
        return;
    }
    messageContainer.textContent = '';

    try {
        const response = await fetch(`../back/listar_animales.php?fecha=${encodeURIComponent(fecha)}`);
        const data = await response.json();

        if (data.error) {
            messageContainer.textContent = data.error;
            tbody.innerHTML = '';
            actualizarTotales(0, 0, 0, 0);
            return;
        }

        // Group data by marca and especie/sexo
        const grouped = {};

        data.forEach(item => {
            const marca = item.marca || 'Sin Marca';
            const especie = item.especie; // 0 = bobinos, 1 = porcinos
            const sexo = item.sexo.toLowerCase();

            if (!grouped[marca]) {
                grouped[marca] = {
                    marca: marca,
                    bobinos: { macho: 0, hembra: 0 },
                    porcinos: { macho: 0, hembra: 0 }
                };
            }

            if (especie == 0) { // bobinos
                if (sexo === 'm' || sexo === 'masculino') {
                    grouped[marca].bobinos.macho++;
                } else if (sexo === 'f' || sexo === 'hembra') {
                    grouped[marca].bobinos.hembra++;
                }
            } else if (especie == 1) { // porcinos
                if (sexo === 'm' || sexo === 'masculino') {
                    grouped[marca].porcinos.macho++;
                } else if (sexo === 'f' || sexo === 'hembra') {
                    grouped[marca].porcinos.hembra++;
                }
            }
        });

        // Clear tbody
        tbody.innerHTML = '';

        // Totals
        let totalBobinosMacho = 0;
        let totalBobinosHembra = 0;
        let totalPorcinosMacho = 0;
        let totalPorcinosHembra = 0;

        // Create rows
        for (const marca in grouped) {
            const row = document.createElement('tr');

            // Empty cells for Nombre y Apellido and C.C.
            const tdNombre = document.createElement('td');
            tdNombre.textContent = '';

            const tdCC = document.createElement('td');
            tdCC.textContent = '';

            const tdMarca = document.createElement('td');
            tdMarca.textContent = grouped[marca].marca;

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

            // Update totals
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
