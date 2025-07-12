
    document.addEventListener('DOMContentLoaded', () => {
        const cantidadInput = document.querySelector('.small-input[type="number"]');
        const guardarBtn = document.querySelector('.btn-guardar');
        const editarBtn = document.querySelector('.btn-editar');
        const tbody = document.getElementById('bovinos-tbody');

        let editIndex = -1; // -1 means no edit mode

        guardarBtn.addEventListener('click', () => {
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
            const fechaGuiaIca = document.querySelectorAll('.small-input')[5].value;
            const noCorral = document.querySelectorAll('.small-input')[6].value;

            // Validar campos obligatorios (puedes agregar más validaciones)
            if (!destino || !noAnimal || !sexo || !kilos || !noTiquete || !fechaIngreso || !fechaGuiaIca || !noCorral) {
                alert('Por favor, completa todos los campos antes de guardar.');
                return;
            }

            if (editIndex === -1) {
                // Crear nueva fila
                const nuevaFila = document.createElement('tr');

                // Número de fila
                const numeroFila = filasActuales + 1;

                nuevaFila.innerHTML = `
                    <td>${numeroFila}</td>
                    <td>${destino}</td>
                    <td>${noAnimal}</td>
                    <td>${sexo}</td>
                    <td>${kilos}</td>
                    <td>${noTiquete}</td>
                    <td>${fechaIngreso}</td>
                    <td>GUIA MOVILIZACION REGISTRADA</td>
                    <td>${fechaGuiaIca}</td>
                    <td>${noCorral}</td>
                    <td></td>
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
                fila.cells[7].textContent = 'GUIA MOVILIZACION REGISTRADA';
                fila.cells[8].textContent = fechaGuiaIca;
                fila.cells[9].textContent = noCorral;
                // La celda 10 (HORA CAÍDA) queda igual

                editIndex = -1;
                guardarBtn.textContent = 'GUARDAR';
            }

            // Limpiar campos excepto cantidad de animales
            document.querySelectorAll('.small-input').forEach((input, index) => {
                if (index !== 0) input.value = '';
            });
            document.querySelectorAll('.small-select').forEach(select => select.value = '');
        });

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

            // Cargar datos en los campos
            document.querySelector('.small-select').value = fila.cells[1].textContent;
            document.querySelectorAll('.small-input')[1].value = fila.cells[2].textContent;
            document.querySelectorAll('.small-select')[1].value = fila.cells[3].textContent;
            document.querySelectorAll('.small-input')[2].value = fila.cells[4].textContent;
            document.querySelectorAll('.small-input')[3].value = fila.cells[5].textContent;
            document.querySelectorAll('.small-input')[4].value = fila.cells[6].textContent;
            document.querySelectorAll('.small-input')[5].value = fila.cells[8].textContent;
            document.querySelectorAll('.small-input')[6].value = fila.cells[9].textContent;
        });
    });
