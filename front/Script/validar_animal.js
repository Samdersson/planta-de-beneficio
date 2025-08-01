document.addEventListener('DOMContentLoaded', () => {
    const cantidadInput = document.getElementById('cantidad-animales');
    const guardarBtn = document.querySelector('.btn-guardar');
    const editarBtn = document.querySelector('.btn-editar');
    const guardarListaBtn = document.querySelector('.btn-cargar-lista');
    const tbody = document.getElementById('bovinos-tbody');
    const guiaInput = document.getElementById('guia-registrada');
    const fechaIcaInput = document.getElementById('fecha-guia-ica');

    let editIndex = -1; 
    let guiaMovilizacion = guiaInput ? guiaInput.value : '';

    // Detectar si es formulario porcinos o bovinos según el título
    const titulo = document.querySelector('h2').textContent.toLowerCase();
    let especieValor = '0'; // Por defecto porcino
    if (titulo.includes('BOVINOS')) {
        especieValor = '1';
    }

    // Inicializar estado del botón guardar
    guardarBtn.disabled = false;

    if (guardarBtn) {
        guardarBtn.addEventListener('click', () => {
            // Obtener el valor ACTUAL de la guía
            const guiaActual = guiaInput.value;
            
            const cantidadMax = parseInt(cantidadInput.value);
            const filasActuales = tbody.rows.length;

            if (isNaN(cantidadMax) || cantidadMax <= 0) {
                alert('Por favor, ingresa una cantidad válida de animales en guía.');
                return;
            }

            if (editIndex === -1 && filasActuales >= cantidadMax) {
                alert('No se pueden agregar más animales que la cantidad indicada en la guía.');
                return;
            }

            // Obtener valores de los campos
            const destino = document.querySelector('.small-select').value;
            const noAnimal = document.querySelectorAll('.small-input')[1].value;
            const sexo = document.querySelectorAll('.small-select')[1].value;
            const kilos = document.querySelectorAll('.small-input')[2].value;
            const noTiquete = document.querySelectorAll('.small-input')[3].value;
            const fechaIngreso = document.querySelectorAll('.small-input')[4].value;
            const fechaGuiaIca = fechaIcaInput.value; // Usamos el valor actual del campo
            const noCorral = document.querySelectorAll('.small-input')[6].value;

            // Validar campos obligatorios y que noAnimal no sea solo espacios
            if (!destino || !noAnimal || !noAnimal.trim() || !sexo || !kilos || !noTiquete || !fechaIngreso || !noCorral) {
                alert('Por favor, completa todos los campos antes de guardar.');
                return;
            }

            if (editIndex === -1) {
                // Crear nueva fila
                const nuevaFila = document.createElement('tr');
                const numeroFila = filasActuales + 1;

                nuevaFila.innerHTML = `
                    <td>${numeroFila}</td>
                    <td>${destino}</td>
                    <td>${noAnimal}</td>
                    <td>${sexo}</td>
                    <td>${kilos}</td>
                    <td>${noTiquete}</td>
                    <td>${fechaIngreso}</td>
                    <td>${guiaActual}</td>
                    <td>${fechaGuiaIca}</td>
                    <td>${noCorral}</td>
                    <td>${new Date().toLocaleTimeString()}</td>
                `;

                tbody.appendChild(nuevaFila);
            } else {
                // Actualizar fila existente
                const fila = tbody.rows[editIndex];
                fila.cells[1].textContent = destino;
                fila.cells[2].textContent = noAnimal;
                fila.cells[3].textContent = sexo;
                fila.cells[4].textContent = kilos;
                fila.cells[5].textContent = noTiquete;
                fila.cells[6].textContent = fechaIngreso;
                fila.cells[7].textContent = guiaActual;
                fila.cells[8].textContent = fechaGuiaIca;
                fila.cells[9].textContent = noCorral;
                fila.cells[10].textContent = new Date().toLocaleTimeString();

                editIndex = -1;
                guardarBtn.textContent = 'GUARDAR';
            }

            // Limpiar campos excepto cantidad, guía y fecha ICA
            document.querySelectorAll('.small-input').forEach((input, index) => {
                if (index !== 0 && input.id !== 'guia-registrada' && input.id !== 'fecha-guia-ica') {
                    input.value = '';
                }
            });
            document.querySelectorAll('.small-select').forEach(select => select.value = '');
        });
    }

    editarBtn.addEventListener('click', () => {
        const numeroEditar = prompt('Ingrese el número del animal a editar:');
        const index = parseInt(numeroEditar) - 1;
        if (isNaN(index) || index < 0 || index >= tbody.rows.length) {
            alert('Número de animal inválido.');
            return;
        }

        const fila = tbody.rows[index];
        editIndex = index;
        guardarBtn.textContent = 'ACTUALIZAR';

        // Llenar campos con datos
        document.querySelector('.small-select').value = fila.cells[1].textContent;
        document.querySelectorAll('.small-input')[1].value = fila.cells[2].textContent;
        document.querySelectorAll('.small-select')[1].value = fila.cells[3].textContent;
        document.querySelectorAll('.small-input')[2].value = fila.cells[4].textContent;
        document.querySelectorAll('.small-input')[3].value = fila.cells[5].textContent;
        document.querySelectorAll('.small-input')[4].value = fila.cells[6].textContent;
        document.querySelectorAll('.small-input')[5].value = fila.cells[8].textContent;
        document.querySelectorAll('.small-input')[6].value = fila.cells[9].textContent;
    });

    // Nueva funcionalidad para enviar la lista completa al backend
    guardarListaBtn.addEventListener('click', () => {
        const filas = tbody.rows;
        if (filas.length === 0) {
            alert('No hay datos para guardar.');
            return;
        }

        let errores = 0;
        let guardados = 0;

        // Función para enviar datos de una fila
        const enviarFila = (fila) => {
            return new Promise((resolve, reject) => {
                const data = new URLSearchParams();
                const guiaId = parseInt(fila.cells[7].textContent) || 0;
                if (guiaId === 0) {
                    alert('Error: guia_id inválido en la fila ' + (i + 1));
                    reject('guia_id inválido');
                    return;
                }
                data.append('guia_id', guiaId);
                data.append('guia', fila.cells[7].textContent);
                data.append('destino', fila.cells[1].textContent);
                data.append('sexo', fila.cells[3].textContent);
                data.append('peso', parseFloat(fila.cells[4].textContent) || 0);
                data.append('numero_tiquete', fila.cells[5].textContent);
                data.append('fecha_ingreso', fila.cells[6].textContent);
                data.append('corral', fila.cells[9].textContent);
                data.append('no_animal', fila.cells[2].textContent);
                data.append('especie', especieValor);
                fetch('../back/guardar_entrada.php', {
                    method: 'POST',
                    body: data,
                })
                .then(response => response.text())
                .then(text => {
                    if (text.includes('correctamente')) {
                        guardados++;
                        resolve();
                    } else {
                        errores++;
                        reject(text);
                    }
                })
                .catch(err => {
                    errores++;
                    reject(err);
                });
            });
        };

        (async () => {
            for (let i = 0; i < filas.length; i++) {
                try {
                    await enviarFila(filas[i]);
                } catch (error) {
                    console.error('Error al guardar fila:', error);
                }
            }
            alert(`¡Datos Guardados con Exito!`);
            document.querySelectorAll('.small-input').forEach(input => input.value = '');
            document.querySelectorAll('.small-select').forEach(select => select.value = '');
            const guiaInput = document.getElementById('guia-registrada');
            const fechaIcaInput = document.getElementById('fecha-guia-ica');
            if (guiaInput) guiaInput.value = '';
            if (fechaIcaInput) fechaIcaInput.value = '';
            const tbody = document.getElementById('bovinos-tbody');
            if (tbody) tbody.innerHTML = '';
        })();
    });
});
