document.addEventListener('DOMContentLoaded', () => {
    const fechaInput = document.getElementById('fecha');
    const btnAgregar = document.getElementById('btn-agregar');
    const registroTbody = document.getElementById('registro-tbody');
    const totalBobinosMacho = document.getElementById('total-bobinos-macho');
    const totalBobinosHembra = document.getElementById('total-bobinos-hembra');
    const totalPorcinosMacho = document.getElementById('total-porcinos-macho');
    const totalPorcinosHembra = document.getElementById('total-porcinos-hembra');

    async function fetchData() {
        try {
            if (!fechaInput || !registroTbody) {
                console.error('Elementos esenciales del DOM no encontrados');
                return;
            }

            const params = new URLSearchParams();
            if (fechaInput.value) params.append('fecha', fechaInput.value);

            const response = await fetch('../back/listar_registro_diario.php?' + params.toString());
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            if (!Array.isArray(data)) {
                console.error('La respuesta no es un array válido:', data);
                return;
            }

            registroTbody.innerHTML = '';

            if (data.length === 0) {
                registroTbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No hay datos para la fecha seleccionada</td></tr>';
                if (totalBobinosMacho) totalBobinosMacho.textContent = 0;
                if (totalBobinosHembra) totalBobinosHembra.textContent = 0;
                if (totalPorcinosMacho) totalPorcinosMacho.textContent = 0;
                if (totalPorcinosHembra) totalPorcinosHembra.textContent = 0;
                return;
            }

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
        btnAgregar.addEventListener('click', (e) => {
            e.preventDefault();
            fetchData();
        });
    }
});
