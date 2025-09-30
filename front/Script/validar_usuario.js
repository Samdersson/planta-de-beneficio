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
                    showModal('Error al cargar roles');
                }
            })
            .catch(error => {
                showModal('Error en la comunicación con el servidor al cargar roles: ' + error);
            });

form.addEventListener('submit', function(event) {
    event.preventDefault();

    // Validar que se haya seleccionado un rol
    if (!rolSelect.value) {
        showModal('Por favor, seleccione un rol válido.');
        return;
    }

    const formData = new FormData(form);

    // Ajustar valor de checkbox activo
    formData.set('activo', document.getElementById('activo').checked ? 1 : 0);

    fetch(form.action, {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(text => {
        if (text.includes('✅')) {
            showModal(isUpdateInput.value === '1' ? 'Usuario actualizado con éxito' : 'Usuario creado con éxito');
            form.reset();
            isUpdateInput.value = '0';
            idInput.value = '0';
            btnGuardar.textContent = 'Guardar Usuario';
        } else if (text.includes('❌')) {
            showModal('Error: ' + text.replace('❌', '').trim());
        } else {
            showModal('Respuesta inesperada del servidor: ' + text);
        }
    })
    .catch(error => {
        showModal('Error en la comunicación con el servidor: ' + error);
    });
});
