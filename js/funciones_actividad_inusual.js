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
        
            if ($("#fin_de").is(":checked"))
                param += "&fin_de=1";
            else
                param += "&fin_de=0";


            
		peticion("generar", "informacionActividadInusual", param, "").done(function(response){
			var codigo = response.resultado;
            var respuesta = response.datos["datos_general"];
            var datos_individual = response.datos["datos_individual"];
            var mensaje = response.datos["mensaje"];
           
            
            if(codigo == "Error"){
            	$("#mensaje_aviso").html("");
				$("#mensaje_aviso").append(mensaje);
				animacionAviso("mensaje_aviso");
            }
            else{
            	console.log(response)
            	var html = "<div id='title' class='titulo_principal'>Reporte de acción inusual</div>" +
            				"<table id='tabla_actividad_inusual'>" +
            					"<tr>" +
            						"<th>Placa</th>" +
            						"<th>Grupo</th>" +
            						"<th>Día/Hora</th>" +
            						"<th>Localización</th>" +
            						"<th>Velocidad<br>(KM/H)</th>" +
            						"<th>Kilometraje<br>(Km)</th>" +
            						"<th>RPM</th>" +
            						"<th>Dirección</th>" +
            						"<th>Coordenadas de Posición</th>" +
            					"</tr>";
            	
            	$.each(respuesta, function(){
            		var velocidad = datos_individual[this.car_id].velocidad;
            		var kilometraje = datos_individual[this.car_id].kilometraje;
            		var rpm = datos_individual[this.car_id].rpm;
            		var total = datos_individual[this.car_id].total;
            		if(kilometraje > 0 && rpm >= 0 && velocidad > 0 && total > 0){
            			html += "<tr>" +
	            					"<input type='hidden' class='car_id' value=" + this.car_id + ">" +
	            					"<td>" + this.placa + "</td>" +
	            					"<td>" + this.grupo + "</td>" +
	            					"<td>" + this.fecha + "</td>" +
	            					"<td>" + this.localizacion + "</td>" +
	            					"<td>" + roundToTwo(velocidad / total) + "</td>" +
	            					"<td>" + roundToTwo(kilometraje) + "</td>" +
	            					"<td>" + roundToTwo(rpm / total) + "</td>" +
	            					"<td>" + this.direccion + "</td>" +
	            					"<td>" + this.coordenadas + "</td>" +
	            				"</tr>";
            		}
            	});
            	
            	html += "</table>";
            	$("#content").css("display", "block");
            	$("#reporte_actividad_inusual").append(html);
            	$("#report").css("display", "block");
            }
		});
	});
	//FIN: Funciones de elementos
    $("#exportar_excel_inusual").click(function(){
		$.fancybox([{ 
                href : '#loading',
                modal: true,
                minWidth: 440,
                minHeight: 440,
                autoResize: true,
                scrollOutside: false,
                padding: 0
        }]);
        
		var html = $("#reporte_actividad_inusual").html() + "<br><br>";
		var uri = 'data:application/vnd.ms-excel;base64,' + $.base64.encode(html);
		
		var downloadLink = document.createElement("a");
		downloadLink.href = uri;
		downloadLink.download = "informacion.xls";
		
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
		
		setTimeout(function(){
			$.fancybox.close();
		}, 2000);
	});
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
function getDateTime() {
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1;//January is 0, so always add + 1
var yyyy = today.getFullYear();
if(dd<10){dd='0'+dd};
if(mm<10){mm='0'+mm};
today = dd+'/'+mm+'/'+yyyy+' 00:00';

//30 days ago

var beforedate = new Date();
var priordate = new Date();
priordate.setDate(beforedate.getDate()-30);
var dd2 = priordate.getDate();
var mm2 = priordate.getMonth()+1;//January is 0, so always add + 1
var yyyy2 = priordate.getFullYear();
if(dd2<10){dd2='0'+dd2};
if(mm2<10){mm2='0'+mm2};
var datefrommonthago = dd2+'/'+mm2+'/'+yyyy2+' 00:00';

    $('#start').val(datefrommonthago);
    $('#end').val(today);
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

$(document).ajaxStop(function() {
    $.fancybox.close();
});

    $().ready(function () {
    getDateTime();
    $("#datetime").click();
});//ready


//-------------------------------------