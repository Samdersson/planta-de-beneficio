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


function cargarMarcasEnDestino() {
    const especieSelect = document.getElementById('especie-select');
    const especie = especieSelect ? especieSelect.value : '';

    fetch(`../back/listar_animal_marca.php?especie=${encodeURIComponent(especie)}`)
        .then(response => response.json())
        .then(data => {
            const selectDestino = document.getElementById('destino-select');
            if (!selectDestino) {
                console.error('Elemento destino-select no encontrado');
                return;
            }

            selectDestino.innerHTML = '<option value="">Seleccione destino</option>';

            // Los datos son un array de strings (marcas), no objetos
            // Filtrar marcas únicas y no vacías
            const marcasUnicas = [...new Set(data.filter(marca => marca && marca.trim() !== ''))];

            marcasUnicas.forEach(marca => {
                const option = document.createElement('option');
                option.value = marca;
                option.textContent = marca;
                selectDestino.appendChild(option);
            });

            // Agregar evento para cargar animales al seleccionar una marca
            selectDestino.addEventListener('change', function() {
                const marcaSeleccionada = this.value;
                const listaAnimales = document.getElementById('lista-animales');
                if (!listaAnimales) {
                    console.error('Elemento lista-animales no encontrado');
                    return;
                }
                if (marcaSeleccionada === '') {
                    listaAnimales.innerHTML = '<option value="">Seleccione un animal</option>';
                    return;
                }
                const especieSelect = document.getElementById('especie-select');
                const especie = especieSelect ? especieSelect.value : '';
                fetch(`../back/listar_animales_por_marca.php?marca=${encodeURIComponent(marcaSeleccionada)}&especie=${encodeURIComponent(especie)}`)
                    .then(response => response.json())
                    .then(animales => {
                        if (animales.error) {
                            console.error('Error al obtener animales:', animales.error);
                            listaAnimales.innerHTML = '<option value="">Error al cargar animales</option>';
                            return;
                        }
                        listaAnimales.innerHTML = '<option value="">Seleccione un animal</option>';
                        animales.forEach(animal => {
                            const option = document.createElement('option');
                            option.value = animal.numero_animal;
                            option.textContent = animal.numero_animal;
                            listaAnimales.appendChild(option);
                        });
                    })
                    .catch(error => {
                        console.error('Error al cargar animales:', error);
                        listaAnimales.innerHTML = '<option value="">Error al cargar animales</option>';
                    });
            });

            console.log('Marcas cargadas en destino:', marcasUnicas);
        })
        .catch(error => {
            console.error('Error al cargar marcas en destino:', error);
            const selectDestino = document.getElementById('destino-select');
            if (selectDestino) {
                selectDestino.innerHTML = '<option value="">Error al cargar destinos</option>';
            }
        });
}

document.addEventListener('DOMContentLoaded', function() {
    const especieSelect = document.getElementById('especie-select');
    if (especieSelect) {
        especieSelect.addEventListener('change', () => {
            cargarMarcasEnDestino();
            const listaAnimales = document.getElementById('lista-animales');
            if (listaAnimales) {
                listaAnimales.innerHTML = '<option value="">Seleccione un animal</option>';
            }
        });
    }
    cargarMarcasEnDestino();
});

document.addEventListener('DOMContentLoaded', function() {
    cargarMarcasEnDestino();
});
