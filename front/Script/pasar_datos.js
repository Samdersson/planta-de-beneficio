    // Función para obtener parámetros de la URL
    function getQueryParams() {
        const params = {};
        const queryString = window.location.search.substring(1);
        const vars = queryString.split("&");
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split("=");
            params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
        return params;
    }

    // Función para llenar los campos con los datos recibidos
    function llenarCampos() {
        const params = getQueryParams();
        if (params.guia) {
            document.getElementById("guia-registrada").value = params.guia;
        }
        if (params.cantidad) {
            document.getElementById("cantidad-animales").value = params.cantidad;
        }
        if (params.fecha) {
            document.getElementById("fecha-guia-ica").value = params.fecha;
        }
    }

    window.onload = llenarCampos;
