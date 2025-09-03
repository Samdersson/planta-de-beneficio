const btnBuscarGuia = document.getElementById('btn_buscar_guia');
const numeroGuiaInput = document.getElementById('numero_guia');
const animalesContainer = document.getElementById('animales-container');
const numeroAnimalSelect = document.getElementById('numero_animal');
const formDecomiso = document.getElementById('form-decomiso');
const btnGuardarDecomiso = document.getElementById('btn_guardar_decomiso');
const messageDiv = document.getElementById('message');

btnBuscarGuia.addEventListener('click', async () => {
    const numeroGuia = numeroGuiaInput.value.trim();
    messageDiv.textContent = '';
    animalesContainer.style.display = 'none';
    formDecomiso.style.display = 'none';
    numeroAnimalSelect.innerHTML = '';

    if (!numeroGuia) {
        messageDiv.textContent = 'Por favor, ingrese un número de guía.';
        return;
    }

    try {
        const response = await fetch(`../back/buscar_animales_por_guia.php?numero_guia=${encodeURIComponent(numeroGuia)}`);
        if (!response.ok) {
            throw new Error('Error al buscar animales.');
        }
        const data = await response.json();
        if (data.error) {
            messageDiv.textContent = data.error;
            return;
        }
        if (data.length === 0) {
            messageDiv.textContent = 'No se encontraron animales para el número de guía proporcionado.';
            return;
        }

        data.forEach(animal => {
            const option = document.createElement('option');
            option.value = animal.numero_animal;
            option.textContent = animal.numero_animal;
            numeroAnimalSelect.appendChild(option);
        });

        animalesContainer.style.display = 'block';
        formDecomiso.style.display = 'block';
    } catch (error) {
        messageDiv.textContent = error.message;
    }
});

btnGuardarDecomiso.addEventListener('click', async () => {
    const producto = document.getElementById('producto').value.trim();
    const motivo = document.getElementById('motivo').value.trim();
    const cantidad = document.getElementById('cantidad').value.trim();
    const numeroAnimal = numeroAnimalSelect.value;
    messageDiv.textContent = '';

    if (!producto || !motivo || !cantidad || !numeroAnimal) {
        messageDiv.textContent = 'Por favor, complete todos los campos.';
        return;
    }

    // Omitir prompt y no enviar cédula desde frontend, será obtenida en backend desde sesión
    try {
        const response = await fetch('../back/guardar_decomiso.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                producto,
                motivo,
                cantidad,
                numero_animal: numeroAnimal
            })
        });

        if (!response.ok) {
            throw new Error('Error al guardar el decomiso.');
        }

        const result = await response.json();
        if (result.error) {
            messageDiv.textContent = result.error;
            return;
        }

        messageDiv.style.color = 'green';
        messageDiv.textContent = 'Decomiso guardado correctamente.';
        // Limpiar formulario
        document.getElementById('producto').value = '';
        document.getElementById('motivo').value = '';
        document.getElementById('cantidad').value = '';
        numeroGuiaInput.value = '';
        animalesContainer.style.display = 'none';
        formDecomiso.style.display = 'none';
    } catch (error) {
        messageDiv.style.color = 'red';
        messageDiv.textContent = error.message;
    }
});
