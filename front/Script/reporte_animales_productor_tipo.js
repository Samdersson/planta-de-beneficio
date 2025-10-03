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
    const url = new URL('/planta_de_beneficio/back/listar_animales_por_productor_tipo.php', window.location.origin);
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

let chartInstance = null;

function dibujarGrafico(data) {
    const ctx = document.getElementById('animalesTipoChart').getContext('2d');

    if (chartInstance) {
        chartInstance.destroy();
    }

    // Group by productor
    const productores = [...new Set(data.map(d => d.productor))];
    const especies = [...new Set(data.map(d => d.especie))];

    
    const colorMap = {
        'porcino': '#FF69B4', 
        'bovino': '#00a2ffff'
    };

    const datasets = especies.map(especie => {
        return {
            label: especie,
            data: productores.map(prod => {
                const item = data.find(d => d.productor === prod && d.especie === especie);
                return item ? parseInt(item.cantidad) : 0;
            }),
            backgroundColor: colorMap[especie.toLowerCase()] || getRandomColor(),
            borderColor: '#000',
            borderWidth: 1
        };
    });

    chartInstance = new Chart(ctx, {
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
