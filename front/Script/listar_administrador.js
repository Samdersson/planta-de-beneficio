function listar_conductor(nombre, cedula) {
    fetch(`../back/listar_administrador.php?`)
        .then(response => response.json())
        .then(data => {
            const tabla = document.getElementById('firma-table');
            tabla.innerHTML = '';
            
            data.forEach(animal => {
                const fila = `
                    <tr>
                        <td>${nombre.nombre}</td>
                        <td>${cedula.cedula}</td>
                    </tr>
                `;
                tabla.innerHTML += fila;
            });
        })
        .catch(error => console.error('Error:', error));
}


