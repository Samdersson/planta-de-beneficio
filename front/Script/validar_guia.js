/**
 * Función para validar el campo "guia" y redirigir al formulario correspondiente.
 * 
 * @param {string} guia - Valor del campo guia a validar.
 */
function validarGuiaYRedirigir(guia) {
    // Expresión regular para numérico con guiones (ejemplo: 025-11001-0002196264)
    const regexNumericoGuion = /^(\d+-)+\d+$/;

    // Expresión regular para alfanumérico con guiones (ejemplo: 025-b-11001-0002196264)
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

/**
 * Función para validar la cantidad de animales.
 * 
 * @param {string} cantidad - Valor del campo cantidad a validar.
 */
function validarCantidad(cantidad) {
    const cantidadNum = Number(cantidad);
    if (!Number.isInteger(cantidadNum) || cantidadNum <= 0) {
        alert("La cantidad debe ser un número entero positivo.");
        return false;
    }
    return true;
}

/**
 * Función para validar la fecha de la guía.
 * 
 * @param {string} fecha - Valor del campo fecha a validar.
 */
function validarFecha(fecha) {
    // Expresión regular para formato YYYY-MM-DD
    const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
    if (!regexFecha.test(fecha)) {
        alert("La fecha debe tener el formato YYYY-MM-DD.");
        return false;
    }
    // Validar que la fecha sea válida (ejemplo: no 2023-02-30)
    const dateObj = new Date(fecha);
    if (isNaN(dateObj.getTime())) {
        alert("La fecha no es válida.");
        return false;
    }
    return true;
}

/**
 * Función para manejar el evento de envío del formulario.
 * Se debe llamar desde el formulario en entradas.html.
 * 
 * @param {Event} event - Evento submit del formulario.
 */
function manejarEnvioFormulario(event) {
    event.preventDefault(); // Evitar envío por defecto

    const guiaInput = document.getElementById("guia");
    const cantidadInput = document.getElementById("cantidad");
    const fechaInput = document.getElementById("fecha");

    if (!guiaInput || !cantidadInput || !fechaInput) {
        alert("Faltan campos obligatorios en el formulario.");
        return;
    }

    const guia = guiaInput.value.trim();
    const cantidad = cantidadInput.value.trim();
    const fecha = fechaInput.value.trim();

    if (!validarCantidad(cantidad)) return;
    if (!validarFecha(fecha)) return;

    const destino = validarGuiaYRedirigir(guia);
    if (!destino) return;

    // Si todas las validaciones pasan, redirigir a la página correspondiente
    window.location.href = destino;
}
