<!-- Variables de Smarty -->
<script type="text/javascript" src="js/funciones_seguridad.js?v=1.0"></script>
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
    <div id="title">Selecciona un rango de fechas</div>
    <div id="fechas">
    <form>
        <input type="text" name="start" id="start">
        <input type="text" name="end" id="end">
        <input type="button" id="datetime" value="Enviar">
    </form>
    </div>
</div>

<div id="report">
	<div id="riesgo">
    	<div id="chart_manejo_horas" class="chart_2"></div>
    	<div id="chart_manejo_kilometros" class="chart_2"></div>
    	<div id="chart_manejo_velocidad" class="chart_2 chart_top_max">
    		<div id="velocidad_rango_1" class="velocidad_por_rango">
    			<div id="circulo_rango_1" class="circulo_velocidad"></div>
    			<div id="box_velocidad_rango_1" class="box_dato_velocidad"></div>	
    		</div>
    		<div id="velocidad_rango_2" class="velocidad_por_rango">
    			<div id="circulo_rango_2" class="circulo_velocidad"></div>
    			<div id="box_velocidad_rango_2" class="box_dato_velocidad"></div>	
    		</div>
    		<div id="velocidad_rango_3" class="velocidad_por_rango">
    			<div id="circulo_rango_3" class="circulo_velocidad"></div>
    			<div id="box_velocidad_rango_3" class="box_dato_velocidad"></div>	
    		</div>
    		<div id="velocidad_rango_4" class="velocidad_por_rango">
    			<div id="circulo_rango_4" class="circulo_velocidad"></div>
    			<div id="box_velocidad_rango_4" class="box_dato_velocidad"></div>	
    		</div>
    		<div id="velocidad_rango_5" class="velocidad_por_rango">
    			<div id="circulo_rango_5" class="circulo_velocidad"></div>
    			<div id="box_velocidad_rango_5" class="box_dato_velocidad"></div>	
    		</div>
    	</div>
    	<div id="chart_alarmas" class="chart_2"></div>
    	<div class="leyenda_rangos">
    		<div id="cuadro_rango_1" class="cuadro_rango"></div>
    		<div id="box_rango_1" class="box_rango">D 0 a 6 hrs</div>
    		<div id="cuadro_rango_2" class="cuadro_rango"></div>
    		<div id="box_rango_2" class="box_rango">B 6 a 11 hrs</div>
    		<div id="cuadro_rango_3" class="cuadro_rango"></div>
    		<div id="box_rango_3" class="box_rango">C 11 a 14 hrs</div>
    		<div id="cuadro_rango_4" class="cuadro_rango"></div>
    		<div id="box_rango_4" class="box_rango">A 14 a 18 hrs</div>
    		<div id="cuadro_rango_5" class="cuadro_rango"></div>
    		<div id="box_rango_5" class="box_rango">E 18 a 0 hrs</div>
    	</div>
    	<div id="chart_horas" class="chart_2"></div>
    	<div id="chart_kilometraje" class="chart_2"></div>
    	<div id="chart_agresivos" class="chart_2"></div>
    	<div id="chart_divi" class="chart_2"></div>
    	<div id="chart_cluster" class="chart_2"></div>
    	<div id="chart_riesgos" class="chart_2"></div>
    </div>
</div>