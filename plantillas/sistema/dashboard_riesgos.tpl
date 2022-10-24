<!-- Variables de Smarty -->
<script type="text/javascript" src="js/funciones_dashboard_riesgos.js"></script>
<link type="text/css" rel="stylesheet" href="css/estilo_dashboard_riesgos.css" />
<script type="text/javascript" src="js/tablesorter/jquery.tablesorter.js"></script>
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
    <div id="title">Dashboard de riesgos</div>
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
                   <label for="clust"> Tamaño del Cluster</label> 
                </td>
                <td>
                    <input type="number" id="clust" name="clust" value="4">
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
	<div id="reporte_dashboard_riesgos"> </div>
    </br>
    <div id="reporte_por_color"> </div>
    <div> <input type="button" id="exportar_excel_riesgos" value="Exportar tablas a excel"> </div>
</div>
