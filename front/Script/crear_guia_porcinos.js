
document.addEventListener('DOMContentLoaded', function() {
    const inputNumeroGuia = document.getElementById('numero-guia-input');
    const btnBuscarGuia = document.getElementById('buscar-guia-btn');
    const selectMarcas = document.getElementById('marcas-select');
    const selectAnimales = document.getElementById('animales-select');

    // Inicialmente deshabilitar selects
    selectMarcas.disabled = true;
    selectAnimales.disabled = true;

    btnBuscarGuia.addEventListener('click', function() {
        const numeroGuia = inputNumeroGuia.value.trim();
        if (!numeroGuia) {
            alert('Por favor ingrese un número de guía');
            return;
        }

        // Limpiar selects
        selectMarcas.innerHTML = '<option value="">Seleccione una marca</option>';
        selectAnimales.innerHTML = '<option value="">Seleccione un número de animal</option>';
        selectMarcas.disabled = true;
        selectAnimales.disabled = true;

        // Obtener marcas por número de guía
        fetch(`../back/listar_marcas_por_guia.php?numero_guia=${encodeURIComponent(numeroGuia)}`)
            .then(response => response.json())
            .then(marcas => {
                if (marcas.error) {
                    alert('Error al obtener marcas: ' + marcas.error);
                    return;
                }
                if (marcas.length === 0) {
                    alert('No se encontraron marcas para esta guía');
                    return;
                }
                marcas.forEach(marca => {
                    const option = document.createElement('option');
                    option.value = marca;
                    option.textContent = marca;
                    selectMarcas.appendChild(option);
                });
                selectMarcas.disabled = false;
            })
            .catch(error => {
                alert('Error al obtener marcas: ' + error);
            });
    });

    selectMarcas.addEventListener('change', function() {
        const numeroGuia = inputNumeroGuia.value.trim();
        const marca = this.value;
        if (!marca) {
            selectAnimales.innerHTML = '<option value="">Seleccione un número de animal</option>';
            selectAnimales.disabled = true;
            return;
        }

        // Limpiar select animales
        selectAnimales.innerHTML = '<option value="">Seleccione un número de animal</option>';
        selectAnimales.disabled = true;

        // Obtener animales por número de guía y marca
        fetch(`../back/listar_animales_por_guia_y_marca.php?numero_guia=${encodeURIComponent(numeroGuia)}&marca=${encodeURIComponent(marca)}`)
            .then(response => response.json())
            .then(animales => {
                if (animales.error) {
                    alert('Error al obtener animales: ' + animales.error);
                    return;
                }
                if (animales.length === 0) {
                    alert('No se encontraron animales para esta marca y guía');
                    return;
                }
                animales.forEach(numeroAnimal => {
                    const option = document.createElement('option');
                    option.value = numeroAnimal;
                    option.textContent = numeroAnimal;
                    selectAnimales.appendChild(option);
                });
                selectAnimales.disabled = false;
            })
            .catch(error => {
                alert('Error al obtener animales: ' + error);
            });
    });
});
