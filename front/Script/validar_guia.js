class validar_guia {
    constructor() {
        this.guiaPorcinos = document.getElementById('guia-porcinos');
        this.guiaBovinos = document.getElementById('guia-bovinos');
        this.btnRegistrar = document.querySelector('.btn-registrar');
        this.btnRegistrar.addEventListener('click', (e) => this.validarGuia(e));
    }};