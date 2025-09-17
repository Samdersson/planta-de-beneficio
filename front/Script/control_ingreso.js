document.getElementById('btn-agregar').addEventListener('click', function() {
    const fechaFin = document.getElementById('fecha_fin').value;
    const especie = document.getElementById('especie').value;

    const messageContainer = document.getElementById('message-container');
    messageContainer.textContent = '';

    if (!fechaFin) {
        messageContainer.textContent = 'Por favor, seleccione la fecha.';
        return;
    }
    if (!especie) {
        messageContainer.textContent = 'Por favor, seleccione un tipo de animal.';
        return;
    }

    fetch(`../back/listar_animales_ingreso.php?fecha_fin=${fechaFin}&especie=${especie}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                messageContainer.textContent = 'Error al obtener los datos: ' + data.error;
                return;
            }

            const tbody = document.getElementById('bovinos-tbody');
            tbody.innerHTML = '';

            if (data.length === 0) {
                messageContainer.textContent = 'No se encontraron animales para los criterios seleccionados.';
                return;
            }

            data.forEach((animal, index) => {
                const tr = document.createElement('tr');

                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${animal.marca || ''}</td>
                    <td>${animal.numero_animal || ''}</td>
                    <td>${animal.sexo || ''}</td>
                    <td>${animal.peso || ''}</td>
                    <td>${animal.numero_tiquete || ''}</td>
                    <td>${animal.fecha_sacrificio || ''}</td>
                    <td>${animal.numero_guia || ''}</td>
                    <td>${animal.fecha_guia || ''}</td>
                    <td>${animal.numero_corral || ''}</td>
                    <td>${animal.hora_caida || ''}</td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            messageContainer.textContent = 'Error en la conexión: ' + error.message;
        });
});
