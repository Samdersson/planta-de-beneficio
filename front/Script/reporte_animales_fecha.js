document.addEventListener('DOMContentLoaded', function() {
    cargarClientes();
    cargarDatos();
});

function cargarClientes() {
    fetch('../back/listar_clientes.php')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('cliente');
            data.forEach(c => {
                const option = document.createElement('option');
                option.value = c.marca;
                option.textContent = c.nombre;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error cargando clientes:', error));
}

function cargarDatos() {
    const fechaInicio = document.getElementById('fecha_inicio').value;
    const fechaFin = document.getElementById('fecha_fin').value;
    const cliente = document.getElementById('cliente').value;

    const url = `../back/listar_animales_por_fecha.php?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}&cliente=${cliente}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('Error: ' + data.error);
                return;
            }
            llenarTabla(data.detalles);
            dibujarGrafico(data.cantidades_fecha);
        })
        .catch(error => {
            console.error('Error al cargar datos:', error);
            alert('Error al cargar datos');
        });
}

function llenarTabla(detalles) {
    const tbody = document.querySelector('#detallesTable tbody');
    tbody.innerHTML = '';
    detalles.forEach(d => {
        const row = `<tr>
            <td>${d.cliente}</td>
            <td>${d.especie}</td>
            <td>${d.sexo}</td>
            <td>${d.cantidad}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function dibujarGrafico(cantidades) {
    const ctx = document.getElementById('animalesChart').getContext('2d');
    const labels = cantidades.map(c => c.fecha);
    const data = cantidades.map(c => parseInt(c.cantidad));

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Cantidad de Animales',
                data: data,
                borderColor: '#007bff',
                backgroundColor: 'rgba(0,123,255,0.1)',
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
