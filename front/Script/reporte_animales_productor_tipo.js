document.addEventListener('DOMContentLoaded', function() {
    cargarDatos();
});

function cargarDatos() {
    fetch('../back/listar_animales_por_productor_tipo.php')
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
    const tbody = document.querySelector('#animalesTipoTable tbody');
    tbody.innerHTML = '';
    data.forEach(d => {
        const row = `<tr>
            <td>${d.productor}</td>
            <td>${d.especie}</td>
            <td>${d.cantidad}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function dibujarGrafico(data) {
    const ctx = document.getElementById('animalesTipoChart').getContext('2d');
    // Group by productor
    const productores = [...new Set(data.map(d => d.productor))];
    const especies = [...new Set(data.map(d => d.especie))];

    const datasets = especies.map(especie => {
        return {
            label: especie,
            data: productores.map(prod => {
                const item = data.find(d => d.productor === prod && d.especie === especie);
                return item ? parseInt(item.cantidad) : 0;
            }),
            backgroundColor: getRandomColor(),
            borderColor: '#000',
            borderWidth: 1
        };
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: productores,
            datasets: datasets
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

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
