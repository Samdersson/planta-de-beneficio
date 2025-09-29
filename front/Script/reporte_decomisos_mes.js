document.addEventListener('DOMContentLoaded', function() {
    cargarDatos();
});

function cargarDatos() {
    fetch('../back/listar_decomisos_por_mes.php')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('Error: ' + data.error);
                return;
            }
            llenarTabla(data);
            dibujarGrafico(data);
        })
        .catch(error => {
            console.error('Error al cargar datos:', error);
            alert('Error al cargar datos');
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

function dibujarGrafico(data) {
    const ctx = document.getElementById('decomisosMesChart').getContext('2d');
    const labels = data.map(d => d.mes);
    const cantidades = data.map(d => parseInt(d.cantidad));

    new Chart(ctx, {
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
