function listar_conductor() {
    fetch(`../back/validaciones/listar_conductor.php`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 1) {
                const conductor = data[0];
                document.getElementById('conductor').value = conductor.nombre;
                document.getElementById('cedula-conductor').value = conductor.cedula;
            } else {
                console.warn('Se esperaba un solo conductor, pero se recibieron:', data.length);
                
            }
        })
        .catch(error => console.error('Error:', error));
}


document.addEventListener('DOMContentLoaded', () => {
    listar_conductor();
});
