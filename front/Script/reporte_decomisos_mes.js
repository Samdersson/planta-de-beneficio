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
    const url = new URL('/planta_de_beneficio/back/listar_decomisos_por_mes.php', window.location.origin);
    if (fechaInicio) url.searchParams.append('fecha_inicio', fechaInicio);
    if (fechaFin) url.searchParams.append('fecha_fin', fechaFin);
    console.log('URL:', url.toString());

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showModal('Error: ' + data.error);
                return;
            }
            llenarTabla(data);
            dibujarGrafico(data);
        })
        .catch(error => {
            console.error('Error al cargar datos:', error);
            showModal('Error al cargar datos');
        });
}

function llenarTabla(data) {
    const tbody = document.querySelector('#decomisosMesTable tbody');
    tbody.innerHTML = '';
    data.forEach(d => {
        const row = `<tr>
            <td>${d.mes}</td>
            <td>${d.cantidad}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

let chartInstance = null;

function dibujarGrafico(data) {
    const ctx = document.getElementById('decomisosMesChart').getContext('2d');

    if (chartInstance) {
        chartInstance.destroy();
    }

    const labels = data.map(d => d.mes);
    const cantidades = data.map(d => parseInt(d.cantidad));

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Cantidad de Decomisos',
                data: cantidades,
                borderColor: '#FF6384',
                backgroundColor: 'rgba(255,99,132,0.1)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
