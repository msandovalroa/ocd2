<!-- Variables de Smarty -->
<script type="text/javascript" src="js/reporte.js"></script>
<script>
    //El path de la organización para saber qué coches traer
    var car_path = '{$car_path}';
</script>

<!-- END Vars -->

<div id="loading">
    <img src="img/loading.gif"><br>
    <span>Espere por favor, la operación puede tardar algunos minutos.</span>
</div>

<div id="content">
    <div id="title">DASHBOARD PRINCIPAL</div>
    <div id="fechas">
        <table id="calendario" style="margin-left: 38%; margin-bottom: 2%; margin-top: 2%">
            <tr>
                <td>
                    Fecha inicio
                </td>
                <td>
                    <input type="text" name="start" id="start">
                </td>
            </tr>
            <tr>
                <td>
                    Fecha fin
                </td>
                <td>
                     <input type="text" name="end" id="end">
                </td>
            </tr>
            <tr>
                <td>
                </td>
                <td>
                     <input type="button" id="datetime" value="Ver resultados">
                </td>
            </tr>
        </table>
    </div>
</div>

<div id="report">
    <!--<div id="title">Visión general</div>-->
    <div id="graphs"></div>
    <div id="details_table_subgrupo">
        <h1>Detalles por Sub Grupo</h1>
        <table cellspacing=0>
            <thead>
                <tr>
                    <th></th>
                    <th>Sub Grupo</th>
                    <th>Días operativos</th>
                    <th>Número de viajes</th>
                    <th>Kilometraje (km)</th>
                    <th>Consumo de Combustible (L)</th>
                    <th>Costo total (MXN)</th>
                    <th>Tiempo de Manejo (Hrs)</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
    <div id="details_table">
        <h1>Detalles</h1>
        <table cellspacing=0>
            <thead>
                <tr>
                    <th>Licencia</th>
                    <th>Sub Grupo</th>
                    <th>Días operativos</th>
                    <th>Número de viajes</th>
                    <th>Kilometraje (km)</th>
                    <th>Consumo de Combustible (L)</th>
                    <th>Costo total (MXN)</th>
                    <th>Tiempo de Manejo (Hrs)</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
    <div id="dashboard_table_subgrupo">
        <h1>Panel de Actividad por Sub Grupo</h1>
        <table cellspacing=0>
            <thead>
                <tr>
                    <th></th>
                    <th>Sub Grupo</th>
                    <th>Rendimiento Promedio (km/L)</th>
                    <th>Hábitos de Manejo Seguro</th>
                    <th>Hábitos de Manejo Economico</th>
                    <th>Velocidad Promedio</th>
                    <th>Kilometraje promedio por viaje</th>
                    <th>Viajes VS Promedio</th>
                    <th>DTC's</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
    <div id="dashboard_table">
        <h1>Panel de Actividad</h1>
        <table cellspacing=0>
            <thead>
                <tr>
                    <th>Licencia</th>
                    <th>Sub Grupo</th>
                    <th>Rendimiento Promedio (km/L)</th>
                    <th>Hábitos de Manejo Seguro</th>
                    <th>Hábitos de Manejo Economico</th>
                    <th>Velocidad Promedio</th>
                    <th>Kilometraje promedio por viaje</th>
                    <th>Viajes VS Promedio</th>
                    <th>DTC's</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
    <input type="button" id="exportar_excel" value="Exportar tablas a excel"><br>
</div>