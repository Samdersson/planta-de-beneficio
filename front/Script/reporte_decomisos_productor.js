document.addEventListener('DOMContentLoaded', function() {
    cargarDatos();
});

function cargarDatos() {
    fetch('../back/listar_decomisos_por_productor.php')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showModal('Error: ' + data.error);
                return;
            }
            mostrarMaxProductor(data.max_productor);
            llenarTabla(data.decomisos);
            dibujarGrafico(data.conteo);
        })
        .catch(error => {
            console.error('Error al cargar datos:', error);
            showModal('Error al cargar datos');
        });
}

function mostrarMaxProductor(max) {
    const div = document.getElementById('max-productor');
    div.textContent = max ? `Productor con más decomisos: ${max}` : 'No hay datos';
}

function llenarTabla(decomisos) {
    const tbody = document.querySelector('#decomisosTable tbody');
    tbody.innerHTML = '';
    decomisos.forEach(d => {
        const row = `<tr>
            <td>${d.id}</td>
            <td>${d.producto}</td>
            <td>${d.motivo}</td>
            <td>${d.cantidad}</td>
            <td>${d.cedula_veterinario}</td>
            <td>${d.numero_animal}</td>
            <td>${d.productor}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function dibujarGrafico(conteo) {
    const ctx = document.getElementById('decomisosChart').getContext('2d');
    const labels = conteo.map(c => c.productor);
    const data = conteo.map(c => parseInt(c.cantidad));
    const backgroundColors = conteo.map(c => c.productor === document.getElementById('max-productor').textContent.split(': ')[1] ? '#007bff' : '#cccccc');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Cantidad de Decomisos',
                data: data,
                backgroundColor: backgroundColors,
                borderColor: '#000',
                borderWidth: 1
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
