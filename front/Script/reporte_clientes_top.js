document.addEventListener('DOMContentLoaded', function() {
    cargarDatos();
    const btn = document.getElementById('filtrarBtn');
    if (btn) {
        btn.addEventListener('click', function() {
            console.log('Filtrar clicked');
            cargarDatos();
        });
    } else {
        console.error('Button filtrarBtn not found');
    }
});

function cargarDatos() {
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;
    console.log('Fechas:', fechaInicio, fechaFin);
    const url = new URL('/planta_de_beneficio/back/listar_clientes_top.php', window.location.origin);
    if (fechaInicio) url.searchParams.append('fecha_inicio', fechaInicio);
    if (fechaFin) url.searchParams.append('fecha_fin', fechaFin);
    console.log('URL:', url.toString());

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Data received:', data);
            if (data.error) {
                showModal('Error: ' + data.error);
                return;
            }
            llenarTabla(data.top_ingresos);
            dibujarGrafico(data.top_ingresos);
        })
        .catch(error => {
            console.error('Error al cargar datos:', error);
            showModal('Error al cargar datos');
        });
}

function llenarTabla(clientes) {
    const tbody = document.querySelector('#clientesTable tbody');
    tbody.innerHTML = '';
    clientes.forEach(c => {
        const row = `<tr>
            <td>${c.cliente}</td>
            <td>${c.cantidad}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

let chartInstance = null;

function dibujarGrafico(clientes) {
    const ctx = document.getElementById('clientesChart').getContext('2d');
    const labels = clientes.map(c => c.cliente);
    const data = clientes.map(c => parseInt(c.cantidad));

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Cantidad de Animales',
                data: data,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#FF6384',
                    '#C9CBCF',
                    '#4BC0C0',
                    '#FF6384'
                ]
            }]
        },
        options: {
            responsive: true
        }
    });
}
