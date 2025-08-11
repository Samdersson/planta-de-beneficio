// front/Script/listar_animales.js
function cargarAnimalesConClientes(fecha) {
    fetch(`../back/listar_animales_con_clientes.php?fecha=${fecha}`)
        .then(response => response.json())
        .then(data => {
            const tabla = document.getElementById('tablaAnimales');
            tabla.innerHTML = '';
            
            data.forEach(animal => {
                const fila = `
                    <tr>
                        <td>${animal.marca}</td>
                        <td>${animal.nombre_animal || 'N/A'}</td>
                        <td>${animal.fecha}</td>
                        <td>${animal.nombre || 'Sin cliente'}</td>
                        <td>${animal.cedula || 'N/A'}</td>
                    </tr>
                `;
                tabla.innerHTML += fila;
            });
        })
        .catch(error => console.error('Error:', error));
}

// Función para cargar cuando cambia la fecha
function inicializarFechaListener() {
    const fechaInput = document.getElementById('fechaFiltro');
    if (fechaInput) {
        fechaInput.addEventListener('change', function() {
            cargarAnimalesConClientes(this.value);
        });
        
        // Cargar datos iniciales
        cargarAnimalesConClientes(fechaInput.value);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarFechaListener);
