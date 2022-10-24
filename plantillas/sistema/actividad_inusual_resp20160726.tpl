<!-- Variables de Smarty -->
<script type="text/javascript" src="js/funciones_actividad_inusual.js?v=1.0"></script>
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
    <div id="title">Selecciona un rango de fechas<br> que contenga Sabados o Domingos</div>
    <div id="fechas">
    <form>
        <input type="text" name="start" id="start">
        <input type="text" name="end" id="end">
        <input type="button" id="datetime" value="Enviar">
    </form>
    </div>
</div>

<div id="report">
	<div id="reporte_actividad_inusual">
    </div>
</div>