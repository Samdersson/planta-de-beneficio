document.addEventListener('DOMContentLoaded', function() {
    cargarDatos();
});

function cargarDatos() {
    fetch('../back/listar_clientes_top.php')
        .then(response => response.json())
        .then(data => {
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

function dibujarGrafico(clientes) {
    const ctx = document.getElementById('clientesChart').getContext('2d');
    const labels = clientes.map(c => c.cliente);
    const data = clientes.map(c => parseInt(c.cantidad));

    new Chart(ctx, {
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
