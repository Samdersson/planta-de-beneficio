function waitForShowModal(callback) {
    if (typeof window.showModal === 'function') {
        callback();
    } else {
        setTimeout(() => waitForShowModal(callback), 50);
    }
}

const form = document.getElementById('usuarioForm');
const btnGuardar = document.getElementById('btnGuardar');
const isUpdateInput = document.getElementById('isUpdate');
const idInput = document.getElementById('id');
const rolSelect = document.getElementById('rol_id');

// Cargar roles desde backend
fetch('../back/listar_roles.php')
    .then(response => response.json())
    .then(data => {
        if (Array.isArray(data)) {
            data.forEach(rol => {
                const option = document.createElement('option');
                option.value = rol.id;
                option.textContent = rol.nombre;
                rolSelect.appendChild(option);
            });
        } else {
            waitForShowModal(() => showModal('Error al cargar roles'));
        }
    })
    .catch(error => {
        waitForShowModal(() => showModal('Error en la comunicación con el servidor al cargar roles: ' + error));
    });

form.addEventListener('submit', function(event) {
    event.preventDefault();

    // Validar que se haya seleccionado un rol
    if (!rolSelect.value) {
        waitForShowModal(() => showModal('Por favor, seleccione un rol válido.'));
        return;
    }

    const formData = new FormData(form);


    fetch(form.action, {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(text => {
        if (text.includes('✅')) {
            waitForShowModal(() => showModal(isUpdateInput.value === '1' ? 'Usuario actualizado con éxito' : 'Usuario creado con éxito'));
            form.reset();
            isUpdateInput.value = '0';
            idInput.value = '0';
            btnGuardar.textContent = 'Guardar Usuario';
        } else if (text.includes('❌')) {
            waitForShowModal(() => showModal('Error: ' + text.replace('❌', '').trim()));
        } else {
            waitForShowModal(() => showModal('Respuesta inesperada del servidor: ' + text));
        }
    })
    .catch(error => {
       waitForShowModal(() => showModal(isUpdateInput.value === '1' ? 'Usuario actualizado con éxito' : 'Usuario creado con éxito'));
    });
});
