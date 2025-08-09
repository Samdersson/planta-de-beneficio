document.addEventListener('DOMContentLoaded', () => {
    const fechaInput = document.getElementById('fecha');
    const btnAgregar = document.getElementById('btn-agregar');
    const registroTbody = document.getElementById('registro-tbody');
    const totalBobinosMacho = document.getElementById('total-bobinos-macho');
    const totalBobinosHembra = document.getElementById('total-bobinos-hembra');
    const totalPorcinosMacho = document.getElementById('total-porcinos-macho');
    const totalPorcinosHembra = document.getElementById('total-porcinos-hembra');
    const marcaSelect = document.createElement('select');
    marcaSelect.id = 'marca-select';
    marcaSelect.className = 'small-select';

    // Insertar el select de marcas antes de la tabla
    const registroContainer = document.querySelector('.registro-container');
    if (registroContainer) {
        const formRow = registroContainer.querySelector('.form-row');
        if (formRow) {
            const marcaDiv = document.createElement('div');
            marcaDiv.className = 'maca';
            const label = document.createElement('label');
            label.htmlFor = 'marca-select';
            label.textContent = 'MARCA';
            marcaDiv.appendChild(label);
            marcaDiv.appendChild(marcaSelect);
            formRow.insertBefore(marcaDiv, formRow.firstChild);
        }
    }

    async function cargarMarcas(fecha) {
        try {
            if (!fecha) {
                marcaSelect.innerHTML = '<option value="">Seleccione una fecha primero</option>';
                return;
            }

            const params = new URLSearchParams();
            params.append('fecha', fecha);

            const response = await fetch('../back/listar_marcas.php?' + params.toString());
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const marcas = await response.json();
            if (!Array.isArray(marcas)) throw new Error('La respuesta no es un array válido');

            marcaSelect.innerHTML = '<option value="">Seleccione</option>';
            marcas.forEach(marca => {
                if (marca) {
                    const option = document.createElement('option');
                    option.value = marca;
                    option.textContent = marca;
                    marcaSelect.appendChild(option);
                }
            });
        } catch (error) {
            console.error('Error al cargar las marcas:', error);
            marcaSelect.innerHTML = '<option value="">Error al cargar marcas</option>';
        }
    }

    async function fetchData() {
        try {
            if (!fechaInput || !registroTbody) {
                console.error('Elementos esenciales del DOM no encontrados');
                return;
            }

            const params = new URLSearchParams();
            if (fechaInput.value) params.append('fecha', fechaInput.value);
            if (marcaSelect.value) params.append('marca', marcaSelect.value);

            const response = await fetch('../back/listar_registro_diario.php?' + params.toString());
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            if (!Array.isArray(data)) {
                console.error('La respuesta no es un array válido:', data);
                return;
            }

            registroTbody.innerHTML = '';

            let totalBM = 0, totalBH = 0, totalPM = 0, totalPH = 0;

            data.forEach(item => {
                const tr = document.createElement('tr');

                const machosBovinos = parseInt(item.machos_bovinos) || 0;
                const hembrasBovinos = parseInt(item.hembras_bovinos) || 0;
                const machosPorcinos = parseInt(item.machos_porcinos) || 0;
                const hembrasPorcinos = parseInt(item.hembras_porcinos) || 0;

                tr.innerHTML = `
                    <td>${item.nombre || ''}</td>
                    <td>${item.cedula || ''}</td>
                    <td>${item.marca || ''}</td>
                    <td>${machosBovinos}</td>
                    <td>${hembrasBovinos}</td>
                    <td>${machosPorcinos}</td>
                    <td>${hembrasPorcinos}</td>
                `;

                registroTbody.appendChild(tr);

                totalBM += machosBovinos;
                totalBH += hembrasBovinos;
                totalPM += machosPorcinos;
                totalPH += hembrasPorcinos;
            });

            if (totalBobinosMacho) totalBobinosMacho.textContent = totalBM;
            if (totalBobinosHembra) totalBobinosHembra.textContent = totalBH;
            if (totalPorcinosMacho) totalPorcinosMacho.textContent = totalPM;
            if (totalPorcinosHembra) totalPorcinosHembra.textContent = totalPH;
        } catch (error) {
            console.error('Error al obtener datos:', error);
        }
    }

    if (btnAgregar) {
    // Cambiar para que al seleccionar fecha se cargue automáticamente sin necesidad de botón agregar
    fechaInput.addEventListener('change', () => {
        cargarMarcas(fechaInput.value);
        fetchData();
    });

    // Eliminar el listener del botón agregar para que no sea necesario presionarlo
    // btnAgregar.addEventListener('click', (e) => {
    //     e.preventDefault();
    //     fetchData();
    // });
    }

    if (fechaInput) {
        fechaInput.addEventListener('change', () => {
            cargarMarcas(fechaInput.value);
            fetchData();
        });
    }

    if (marcaSelect) {
        marcaSelect.addEventListener('change', () => {
            fetchData();
        });
    }

    // Cargar marcas inicialmente si hay fecha
    if (fechaInput && fechaInput.value) {
        cargarMarcas(fechaInput.value);
    }
});
