class ValidarInicio {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.usuario = this.form.querySelector('input[name="usuario"]');
        this.contrasena = this.form.querySelector('input[name="contrasena"]');
        this.form.addEventListener('submit', (e) => this.validarFormulario(e));
    }

    validarFormulario(event) {
        let errores = [];

        if (!this.usuario.value.trim()) {
            errores.push('El campo usuario es obligatorio.');
        }

        if (!this.contrasena.value.trim()) {
            errores.push('El campo contraseña es obligatorio.');
        }

        if (errores.length > 0) {
            event.preventDefault();
            alert(errores.join('\\n'));
        }
    }
}

// Para usar esta clase, crea una instancia después de que el DOM esté cargado:
// const validador = new ValidarInicio('idDelFormulario');
