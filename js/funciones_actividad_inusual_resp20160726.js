$(window).ready(function () {
	//Funciones iniciales
	$('#start').datetimepicker(
        $.datepicker.regional['es']
    );
    
    $('#end').datetimepicker(
        $.timepicker.regional['es']
    );
    //FIN: Funciones iniciales
    
	//Funciones de elementos
	$("#datetime").click(function(){        
        var inicio = moment($("#start").val(),"DD/MM/YYYY HH:mm");
        var fin = moment($("#end").val(),"DD/MM/YYYY HH:mm");
        var RF = fin.diff(inicio, 'days') + 1;
        var car_ids = "";
        var car_ids_pasado = "";
    
        //Months are zero indexed.
        //Es decir que Moment piensa que es una buena idea que Enero sea el mes 0.
        var param = 
            "&car_path=" + car_path +
            "&start_year="+inicio.year()+
            "&start_month="+ (inicio.month()+1) +
            "&start_day="+inicio.date()+
            "&start_hour="+inicio.hours()+
            "&start_minute="+inicio.minutes()+
            "&start_second="+inicio.seconds()+
            "&end_year="+fin.year()+
            "&end_month="+ (fin.month()+1) +
            "&end_day="+fin.date()+
            "&end_hour="+fin.hours()+
            "&end_minute="+fin.minutes()+
            "&end_second="+fin.seconds();
            
		peticion("generar", "informacionActividadInusual", param, "").done(function(response){
			var codigo = response.resultado;
            var respuesta = response.datos["datos_general"];
            var mensaje = response.datos["mensaje"];
            
            if(codigo == "Error"){
            	$("#mensaje_aviso").html("");
				$("#mensaje_aviso").append(mensaje);
				animacionAviso("mensaje_aviso");
            }
            else{
            	var html = "<div id='title' class='titulo_principal'>Reporte de acción inusual</div>" +
            				"<table id='tabla_actividad_inusual'>" +
            					"<tr>" +
            						"<th>Placa</th>" +
            						"<th>Día/Hora</th>" +
            						"<th>Localización</th>" +
            						"<th>Velocidad<br>(KM/H)</th>" +
            						"<th>Kilometraje<br>(Km)</th>" +
            						"<th>RPM</th>" +
            						"<th>Dirección</th>" +
            						"<th>Coordenadas de Posición</th>" +
            					"</tr>";
            	
            	$.each(respuesta, function(){
            		if(this.kilometraje > 0 && this.rpm > 0 && this.velocidad > 0){
            			html += "<tr>" +
	            					"<input type='hidden' class='car_id' value=" + this.car_id + ">" +
	            					"<td>" + this.placa + "</td>" +
	            					"<td>" + this.fecha + "</td>" +
	            					"<td>" + this.localizacion + "</td>" +
	            					"<td>" + roundToTwo(this.velocidad) + "</td>" +
	            					"<td>" + roundToTwo(this.kilometraje) + "</td>" +
	            					"<td>" + this.rpm + "</td>" +
	            					"<td>" + this.direccion + "</td>" +
	            					"<td>" + this.coordenadas + "</td>" +
	            				"</tr>";
            		}
            	});
            	
            	html += "</table>";
            	$("#content").css("display", "none");
            	$("#reporte_actividad_inusual").append(html);
            	$("#report").css("display", "block");
            }
		});
	});
	//FIN: Funciones de elementos
});

function animacionAviso(div){
	$("#"+div).show("bounce", {"direction": "down"}, 2000);
	setTimeout(function(){$("#"+div).hide("drop", {"direction": "down"}, 1000);}, 2000);
}

function roundToTwo(num) {
    if(!isFinite(num))
        return 0;
    return +(Math.round(num + "e+2")  + "e-2");
}

//Mensajes de carga
$( document ).ajaxStart(function() {
	$.fancybox([{ 
    	href : '#loading',
        modal: true,
        minWidth: 440,
        minHeight: 440,
        autoResize: true,
        scrollOutside: false,
        padding: 0
    }]);
});

$( document ).ajaxStop(function() {
	$.fancybox.close();
});
//-------------------------------------