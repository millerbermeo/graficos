<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="./views/mensajes.css">
</head>
<body>

<div class="content-select">
    <div>
        <label for="tipoGrafico">Tipo de Gráfico:</label>
        <br>
        <select id="tipoGrafico" class="select-grafico">
            <option value="pie">Pastel</option>
            <option value="bar">Barra</option>
            <option value="line">Línea</option>
        </select>
    </div>
    <div class="select-container">
        <div>
            <label for="mes" class="">Selecciona el Mes:</label>
        <select id="mes" class="select-style">
            <option value="01">Enero</option>
            <option value="02">Febrero</option>
            <option value="03">Marzo</option>
            <option value="04">Abril</option>
            <option value="05">Mayo</option>
            <option value="06">Junio</option>
            <option value="07">Julio</option>
            <option value="08">Agosto</option>
            <option value="09">Setiembre</option>
            <option selected value="10">Octubre</option>
            <option value="11">Noviembre</option>
            <option value="12">Diciembre</option>
        </select>
        </div>
        
        <div>
            <label for="anio" class="">Selecciona el Año:</label>
        <select id="anio" class="select-style">
            <option value="2023">2023</option>
            <option value="2022">2022</option>
        </select>
        </div>

        <button id="filtrar" class="filtrar-button">Filtrar</button>
    </div>

    
</div>



    <div class="render-full">
        <div class="chart-container">
            <div class="grafico" id="grafico-container">

            </div>
        </div>
    </div>

    <script src="./views/mensajes.js"></script>
    
</body>
</html>
