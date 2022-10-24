/*
*Aqui se haran las petiiones para los los procesos de inicio. 
*utilizado el parámetro iniciar evitamos iniciar sesión.
*cualquier otra petricion requiere que el usuario tenga iniciada sesión.
*Los paramentros para la peticion son:
*clase=Nombre de la clase a invocar
*Metodo=Nombre del método a invocar 
*Parametros= Informacion adicionales en formato par:valor, separados por comas y como cadena"
*  siempre se deberá indicar si una instancia de clase es primaria o secundaria.
*Modo= Indica si se utilizará la validación de sesión o no (unicamente para metodos de inicio)
*Destino= el div donde se presentará la respuesta)"
*
*Nota importante: si se esta utilizando un metodo comobo, se invocará el metodo combo cascada, con base al nombre de clase.
*/

function peticion(clase,metodo,parametros,destino){
    //alert(parametros);
	datos="&clase="+clase+"&metodo="+metodo+parametros;
	//alert(datos);
    var salida=$.ajax({
        type: "POST",
        url: "broker.php",
        data: datos,
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		dataType: "json",
        cache: false,
		success: function(respuesta){
			$(destino).empty().html(respuesta["codigo"]);
        },
		error: function(XMLHttpRequest, textStatus, errorThrown){
        $(destino).text(textStatus+" Ocurrio un error "+errorThrown);
        }
	});//ajax	   
    return salida;
}//