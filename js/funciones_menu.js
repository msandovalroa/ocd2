$(window).ready(function () {
	var ruta = window.location.href;
	var ruta_pza = ruta.split("?op=");
	if(typeof(ruta_pza[1]) != "undefined" && ruta_pza[1] !== null){
		var op_pza = ruta_pza[1].replace("#", "").split("&");
		var op = op_pza[0];
		
		if(op == "dashboard_seguridad"){
			$("#dashboard_seguridad").css("font-weight", "bold");
			$("#titulo_principal").text("DASHBOARD DE RIESGO");
		}
		else if(op == "actividad_inusual"){
			$("#actividad_inusual").css("font-weight", "bold");
			$("#titulo_principal").text("ACTIVIDAD INUSUAL");
		}
		else if(op == "dashboard_riesgos"){
			$("#dashboard_riesgos").css("font-weight", "bold");
			$("#titulo_principal").text("DASHBOARD DE RIESGOS");
		}
		else{
			$("#home").css("font-weight", "bold");
		}
	}
	else{
		$("#home").css("font-weight", "bold");
	}
});

function escondeMenu(){
	$("#menu_principal_abierto").hide('slide', {direction: 'left'}, 500);
	$("#menu_principal_cerrado").show('slide', {direction: 'left'}, 500);
}

function muestraMenu(){
	$("#menu_principal_abierto").show('slide', {direction: 'left'}, 500);
	$("#menu_principal_cerrado").hide();
}