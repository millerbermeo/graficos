const url = 'http://172.16.1.27/dashboard/mensajes.php';

document.getElementById('filtrar').addEventListener('click', () => {
    const mes = document.getElementById('mes').value;
    const anio = document.getElementById('anio').value;
    const tipoGrafico = document.getElementById('tipoGrafico').value;

    const data = new FormData();
    data.append('fecha', `${anio}-${mes}`);

    fetch(url, {
        method: 'POST',
        body: data,
    })
    .then(response => response.json())
    .then(jsonResponse => {
        console.log(jsonResponse);

        const graficoContainer = document.getElementById('grafico-container');
        graficoContainer.style.display = 'grid';
        graficoContainer.style.gridTemplateColumns = `repeat(auto-fill, minmax(400px,1fr))`;
        graficoContainer.style.placeItems = 'center';
        graficoContainer.innerHTML = '';

        const uniqueIds = Array.from(new Set(jsonResponse.map(item => item.campaign_id)));

        // Se define una función para crear y mostrar un gráfico
        function createAndShowChart(campaign_id, dataForId) {
            const conjuntoGraficoDatos = document.createElement('div');
            conjuntoGraficoDatos.classList.add('conjunto-grafico-datos');
            conjuntoGraficoDatos.style.height = '500px';
            conjuntoGraficoDatos.style.position = 'relative';
            

            const label = document.createElement('label');
            label.textContent = campaign_id;
            label.style.position = 'absolute';
            label.style.top = '0';
            label.style.left = '0';
            label.style.backgroundColor = '#ccc';
            label.style.width = '40px';
            label.style.height = '40px';
            label.style.borderRadius = '50%';
            label.style.display = 'flex';
            label.style.justifyContent = 'center';
            label.style.alignItems = 'center';

            conjuntoGraficoDatos.appendChild(label);
            graficoContainer.appendChild(conjuntoGraficoDatos);

            const data = dataForId.reduce((acc, item) => {
                if (!acc[item.status]) {
                    acc[item.status] = 0;
                }
                acc[item.status] += parseInt(item.cantidad, 10);
                return acc;
            }, {});

            const canvas = document.createElement('canvas');
            canvas.classList.add('grafico');
            canvas.style.marginTop = "25px";
            canvas.width = 300;
            canvas.height = 200;

            conjuntoGraficoDatos.appendChild(canvas);
            const ctx = canvas.getContext('2d');

            const datosCantidadContainer = document.createElement('div');
            datosCantidadContainer.classList.add('datos-cantidad');
            conjuntoGraficoDatos.appendChild(datosCantidadContainer);

            const totalEnviados = dataForId.reduce((acc, item) => (item.status === 'Enviado' ? acc + parseInt(item.cantidad, 10) : acc), 0);
            const totalNoEnviados = dataForId.reduce((acc, item) => (item.status === 'No enviado' ? acc + parseInt(item.cantidad, 10) : acc), 0);
            const total = totalEnviados + totalNoEnviados;

            datosCantidadContainer.innerHTML = `
                <p>Enviados: ${totalEnviados}</p>
                <p>No Enviados: ${totalNoEnviados}</p>
                <p>Total: ${total}</p>
            `;

            const detallesContainer = document.createElement('div');
            detallesContainer.classList.add('detalles');
            conjuntoGraficoDatos.appendChild(detallesContainer);

            const detallesParaCampaña = dataForId.map(item => {
                return `
                    <h3>Nombre: ${item.name}</h3>
                    <h3>${item.usuario}</h3>
                    <span class="btn-1">Ver Mensaje</span>
                    <p class="mensaje">${item.mensaje}</p>
                `;
            });

            detallesContainer.innerHTML = detallesParaCampaña.join('');

            const btns = conjuntoGraficoDatos.querySelectorAll('.btn-1');

            btns.forEach(btn => {
                btn.addEventListener("click", () => {
                    const mensaje = btn.parentElement.querySelector('.mensaje');
                    mensaje.classList.toggle("active");
                });
            });

            const labels = Object.keys(data);

            const backgroundColors = labels.map(label => (label === "Enviado" ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)'));
            
            let chartType = tipoGrafico || 'bar'; // Si no se selecciona un tipo, se usa el tipo de gráfico de pastel por defecto

            const chartData = {
                labels: labels,
                datasets: [
                    {
                        label: 'Resultado',
                        data: labels.map(label => data[label]),
                        backgroundColor: backgroundColors,
                        borderColor: backgroundColors,
                        borderWidth: 1,
                    },
                ],
            };

            new Chart(ctx, {
                type: chartType,
                data: chartData,
            });
        }

        // Se define una función para verificar si el usuario ha llegado al final de la página
        function isBottom() {
            return window.innerHeight + window.scrollY >= document.body.offsetHeight;
        }

        let loadedCharts = 0;

        // Se añade un evento scroll para cargar más gráficos cuando el usuario hace scroll
        function scrollHandler() {
            if (isBottom() && loadedCharts < uniqueIds.length) {
                const campaign_id = uniqueIds[loadedCharts];
                const dataForId = jsonResponse.filter(item => item.campaign_id === campaign_id);
                createAndShowChart(campaign_id, dataForId);
                loadedCharts++;
                window.requestAnimationFrame(scrollHandler);
            }
        }

        window.addEventListener('scroll', () => {
            window.requestAnimationFrame(scrollHandler);
        });

        // Se carga el primer conjunto de gráficos
        const initialChartsToLoad = 3; // Puedes ajustar la cantidad inicial de gráficos a cargar
        for (let i = 0; i < Math.min(uniqueIds.length, initialChartsToLoad); i++) {
            const campaign_id = uniqueIds[i];
            const dataForId = jsonResponse.filter(item => item.campaign_id === campaign_id);
            createAndShowChart(campaign_id, dataForId);
            loadedCharts++;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

