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
        alert("El formato de la guía no es válido. Debe ser numérico o alfanumérico con guion.");
        return null;
    }
}

function validarCantidad(cantidad) {
    const cantidadNum = Number(cantidad);
    if (!Number.isInteger(cantidadNum) || cantidadNum <= 0) {
        alert("La cantidad debe ser un número entero positivo.");
        return false;
    }
    return true;
}

function validarFecha(fecha) {
    const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
    if (!regexFecha.test(fecha)) {
        alert("La fecha debe tener el formato YYYY-MM-DD.");
        return false;
    }
    
    const dateObj = new Date(fecha);
    if (isNaN(dateObj.getTime())) {
        alert("La fecha no es válida.");
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

    if (!nombreSelect || !cedulaInput || !guiaInput || !cantidadInput || !fechaInput) {
        alert("nombre"+nombreSelect+ "cedula"+cedulaInput+"guia"+guiaInput+"cantidad"+cantidadInput+"fecha"+fechaInput);
        alert("Faltan campos obligatorios en el formulario.");
        return;
    }

    const nombre = nombreSelect.options[nombreSelect.selectedIndex].text;
    const cedula = cedulaInput.value.trim();
    const numero_guia = guiaInput.value.trim();
    const cantidad = cantidadInput.value.trim();
    const fecha_ica = fechaInput.value.trim();

    if (!cedula) {
        alert("La cédula del productor es obligatoria.");
        return;
    }

    if (!validarCantidad(cantidad)) return;
    if (!validarFecha(fecha_ica)) return;

    const destino = validarGuiaYRedirigir(numero_guia);
    if (!destino) return;

    try {
        const formData = new FormData();
        formData.append('numero_guia', numero_guia);
        formData.append('cantidad_animales', cantidad);
        formData.append('fecha_guia', fecha_ica);
        formData.append('cedula_productor', cedula);
        formData.append('nombre', nombre);

        const response = await fetch('../back/guias_movilizacion.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            alert(result.success);
            window.location.href = `${destino}?cedula_productor=${encodeURIComponent(cedula)}&numero_guia=${encodeURIComponent(numero_guia)}&cantidad_animales=${encodeURIComponent(cantidad)}&fecha_guia=${encodeURIComponent(fecha_ica)}`;
        } else {
            alert(result.error || 'Error desconocido al registrar la guía');
        }
    } catch (error) {
        alert('Error al enviar los datos: ' + error.message);
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
