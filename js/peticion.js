/*
*Aqui se haran las petiiones para los los procesos de inicio. 
*utilizado el par�metro iniciar evitamos iniciar sesi�n.
*cualquier otra petricion requiere que el usuario tenga iniciada sesi�n.
*Los paramentros para la peticion son:
*clase=Nombre de la clase a invocar
*Metodo=Nombre del m�todo a invocar 
*Parametros= Informacion adicionales en formato par:valor, separados por comas y como cadena"
*  siempre se deber� indicar si una instancia de clase es primaria o secundaria.
*Modo= Indica si se utilizar� la validaci�n de sesi�n o no (unicamente para metodos de inicio)
*Destino= el div donde se presentar� la respuesta)"
*
*Nota importante: si se esta utilizando un metodo comobo, se invocar� el metodo combo cascada, con base al nombre de clase.
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