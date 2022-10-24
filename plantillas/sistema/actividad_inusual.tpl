<!-- Variables de Smarty -->
<script type="text/javascript" src="js/funciones_actividad_inusual.js"></script>
<link type="text/css" rel="stylesheet" href="css/estilo_actividad_inusual.css" />
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
    <div id="title">ACTIVIDAD INUSUAL</div>
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
                    <label for="fin_de"> Buscar solo en fin de semana</label>
                </td>
                <td>
                      <input type="checkbox" id="fin_de" name="fin_de" value="false">
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
	<div id="reporte_actividad_inusual">
    </div>
    <div> <input type="button" id="exportar_excel_inusual" value="Exportar tabla a excel"> </div>
</div>