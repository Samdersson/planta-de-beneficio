async function cargarProductores() {
    try {
        console.log('Intentando cargar productores...');
        const response = await fetch('../back/listar_productores.php');
        console.log('Respuesta recibida:', response);
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        const productores = await response.json();
        console.log('Productores obtenidos:', productores);

        const selectNombre = document.getElementById('nombre');
        selectNombre.options.length = 1;
        productores.forEach(productor => {
            const option = document.createElement('option');
            option.value = productor.cedula;
            option.textContent = productor.Nombre;
            selectNombre.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar los productores:', error);
    }
}

function actualizarCedula() {
    const selectNombre = document.getElementById('nombre');
    const cedulaInput = document.getElementById('cedula');
    cedulaInput.value = selectNombre.value;
}

function validarGuiaYRedirigir(guia) {
    const regexNumericoGuion = /^(\d+-)+\d+$/;
    const regexAlfanumericoGuion = /^([a-zA-Z0-9]+-)+\d+$/;

    if (regexNumericoGuion.test(guia)) {
        return "Porcinos.html";
    } else if (regexAlfanumericoGuion.test(guia)) {
        return "Bovinos.html";
    } else {
        showModal("El formato de la guía no es válido. Debe ser numérico o alfanumérico con guion.");
        return null;
    }
}

function validarCantidad(cantidad) {
    const cantidadNum = Number(cantidad);
    if (!Number.isInteger(cantidadNum) || cantidadNum <= 0) {
        showModal("La cantidad debe ser un número entero positivo.");
        return false;
    }
    return true;
}

function validarFecha(fecha) {
    const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
    if (!regexFecha.test(fecha)) {
        showModal("La fecha debe tener el formato YYYY-MM-DD.");
        return false;
    }

    const dateObj = new Date(fecha);
    if (isNaN(dateObj.getTime())) {
        showModal("La fecha no es válida.");
        return false;
    }
    return true;
}

async function manejarEnvioFormulario(event) {
    event.preventDefault();

    const nombreSelect = document.getElementById("nombre");
    const cedulaInput = document.getElementById("cedula"); 
    const guiaInput = document.getElementById("guia");
    const cantidadInput = document.getElementById("cantidad");
    const fechaInput = document.getElementById("fecha");
    const btnRegistrar = document.querySelector('.btn-registrar');

    if (!nombreSelect || !cedulaInput || !guiaInput || !cantidadInput || !fechaInput) {
        showModal("Faltan campos obligatorios en el formulario.");
        return;
    }

    const nombre = nombreSelect.options[nombreSelect.selectedIndex].text;
    const cedula = cedulaInput.value.trim();
    const numero_guia = guiaInput.value.trim();
    const cantidad = cantidadInput.value.trim();
    const fecha_ica = fechaInput.value.trim();

    if (!cedula) {
        showModal("La cédula del productor es obligatoria.");
        return;
    }

    if (!validarCantidad(cantidad)) return;
    if (!validarFecha(fecha_ica)) return;

    // Determinar si estamos en modo edición (botón dice "ACTUALIZAR")
    const esModoEdicion = btnRegistrar.textContent === 'ACTUALIZAR';
    const destino = validarGuiaYRedirigir(numero_guia);
    if (!destino) return;

    try {
        const formData = new FormData();
        formData.append('numero_guia', numero_guia);
        formData.append('cantidad_animales', cantidad);
        formData.append('fecha_guia', fecha_ica);
        formData.append('cedula_productor', cedula);
        
        if (esModoEdicion) {
            formData.append('accion', 'editar');
        } else {
            formData.append('accion', 'insertar');
        }

        const response = await fetch('../back/guias_movilizacion.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            showModal(result.success);
            if (esModoEdicion) {
                // Después de editar, volver a la lista de guías
                window.location.href = 'ver_guias.html';
            } else {
                // Después de crear, redirigir a la página correspondiente
                // Guardar datos en sessionStorage para que Porcinos.html pueda leerlos
                const guiaData = {
                    numero_guia: numero_guia,
                    cantidad_animales: cantidad,
                    fecha_guia: fecha_ica,
                    cedula_productor: cedula
                };
                sessionStorage.setItem('guiaEditar', JSON.stringify(guiaData));
                window.location.href = destino;
            }
        } else {
            showModal(result.error || 'Error desconocido al procesar la guía');
        }
    } catch (error) {
        showModal('Error al enviar los datos: ' + error.message);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    cargarProductores();
    const selectNombre = document.getElementById('nombre');
    if (selectNombre) {
        selectNombre.addEventListener('change', actualizarCedula);
    }
    const entradaForm = document.getElementById('entradaForm');
    if (entradaForm) {
        entradaForm.addEventListener('submit', manejarEnvioFormulario);
    }
});
