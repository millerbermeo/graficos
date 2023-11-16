const url = 'http://172.16.1.27/dashboard/correos2.php';
let uniqueIds = [];
let jsonResponse = [];
let tipoGrafico;
let loadedCharts = 0;
let loading = false;

document.getElementById('filtrar').addEventListener('click', () => {
    const mes = document.getElementById('mes').value;
    const anio = document.getElementById('anio').value;
    tipoGrafico = document.getElementById('tipoGrafico').value;

    const data = new FormData();
    data.append('fecha', `${anio}-${mes}`);

    fetch(url, {
        method: 'POST',
        body: data,
    })
    .then(response => response.json())
    .then(data => {
        jsonResponse = data;
        console.log(jsonResponse);

        const graficoContainer = document.getElementById('grafico-container');
        graficoContainer.style.display = 'grid';
        graficoContainer.style.gridTemplateColumns = "1fr 1fr";
        graficoContainer.style.placeItems = "center";


        graficoContainer.innerHTML = '';

        uniqueIds = Array.from(new Set(jsonResponse.map(item => item.id)));

        if (uniqueIds.length === 0) {
            return;
        }

        uniqueIds.forEach(id => {
            const dataForId = jsonResponse.filter(item => item.id === id);
            createAndShowChart(id, dataForId, tipoGrafico);
        });

        loadMoreCharts();
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

function loadMoreCharts() {
    const initialChartsToLoad = 3;
    for (let i = 0; i < Math.min(uniqueIds.length, initialChartsToLoad); i++) {
        const id = uniqueIds[i];
        const dataForId = jsonResponse.filter(item => item.id === id);
        createAndShowChart(id, dataForId, tipoGrafico);
        loadedCharts++;
    }
}

function isBottom() {
    return window.innerHeight + window.scrollY >= document.body.offsetHeight;
}

function scrollHandler() {
    if (isBottom() && loadedCharts < uniqueIds.length && !loading) {
        loading = true;
        const id = uniqueIds[loadedCharts];
        const dataForId = jsonResponse.filter(item => item.id === id);
        createAndShowChart(id, dataForId, tipoGrafico);
        loadedCharts++;
        loading = false;
    }
}

window.addEventListener('scroll', () => {
    if (isBottom() && loadedCharts < uniqueIds.length && !loading) {
        window.requestAnimationFrame(scrollHandler);
    }
});

document.body.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('btn-1')) {
        const mensaje = target.parentElement.querySelector('.mensaje');
        mensaje.classList.toggle("active");
    }
});

function createAndShowChart(id, dataForId, tipoGrafico) {
    const conjuntoGraficoDatos = document.createElement('div');
    conjuntoGraficoDatos.classList.add('conjunto-grafico-datos');
    conjuntoGraficoDatos.style.position = 'relative';



    const label = document.createElement('label');
    label.textContent = id;
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

    document.getElementById('grafico-container').appendChild(conjuntoGraficoDatos);

    const data = dataForId.reduce((acc, item) => {
        if (!acc[item.resultado]) {
            acc[item.resultado] = 0;
        }
        acc[item.resultado] += parseInt(item.cantidad, 10);
        return acc;
    }, {});

    const canvas = document.createElement('canvas');
    canvas.classList.add('grafico');
    canvas.width = 300;
    canvas.height = 300;
    canvas.style.marginTop = "25px";

    conjuntoGraficoDatos.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const datosCantidadContainer = document.createElement('div');
    datosCantidadContainer.classList.add('datos-cantidad');
    conjuntoGraficoDatos.appendChild(datosCantidadContainer);
    datosCantidadContainer.style.marginLeft = "40px";

    const totalEnviados = dataForId.reduce((acc, item) => (item.resultado === 'Enviado' ? acc + parseInt(item.cantidad, 10) : acc), 0);
    const totalNoEnviados = dataForId.reduce((acc, item) => (item.resultado === 'Error' ? acc + parseInt(item.cantidad, 10) : acc), 0);
    const total = totalEnviados + totalNoEnviados;

    datosCantidadContainer.innerHTML = `
        <p>Enviados: ${totalEnviados}</p>
        <p>No Enviados: ${totalNoEnviados}</p>
        <p>Total: ${total}</p>
    `;

    const detallesContainer = document.createElement('div');
    detallesContainer.classList.add('detalles');
    conjuntoGraficoDatos.appendChild(detallesContainer);
    detallesContainer.style.height= "80px"
    detallesContainer.style.overflow= "hidden"

    const detallesParaCampaña = dataForId.map(item => {
        return `
        <h3>Nombre: ${item.name}</h3>
        <h3>${item.usuario}</h3>
        `;
    });

    detallesContainer.innerHTML = detallesParaCampaña.join('');

    const labels = Object.keys(data);

    const backgroundColors = labels.map(label => (label === "Enviado" ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)'));

    let chartType = tipoGrafico || 'bar';

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
