$(window).ready(function() {
    //Funciones iniciales
    $('#start').datetimepicker(
        $.datepicker.regional['es']
    );

    $('#end').datetimepicker(
        $.timepicker.regional['es']
    );

    //FIN: Funciones iniciales

    //Funciones de elementos
    $("#datetime").click(function() {
        var inicio = moment($("#start").val(), "DD/MM/YYYY HH:mm");
        var fin = moment($("#end").val(), "DD/MM/YYYY HH:mm");
        var RF = fin.diff(inicio, 'days') + 1;
        var car_ids = "";
        var car_ids_pasado = "";

        //Months are zero indexed.
        //Es decir que Moment piensa que es una buena idea que Enero sea el mes 0.
        var param =
            "&car_path=" + car_path +
            "&start_year=" + inicio.year() +
            "&start_month=" + (inicio.month() + 1) +
            "&start_day=" + inicio.date() +
            "&start_hour=" + inicio.hours() +
            "&start_minute=" + inicio.minutes() +
            "&start_second=" + inicio.seconds() +
            "&end_year=" + fin.year() +
            "&end_month=" + (fin.month() + 1) +
            "&end_day=" + fin.date() +
            "&end_hour=" + fin.hours() +
            "&end_minute=" + fin.minutes() +
            "&end_second=" + fin.seconds();
        var tama = document.getElementById("clust").value

        if (tama > 0) {
            param += "&tamano_cluster=" + tama;


            peticion("generar", "informacionDashboardRiesgos", param, "").done(function(responde) {
                var codigo = responde.resultado;
                var mensaje = responde.datos["mensaje"];

                if (codigo == "Error") {
                    $("#mensaje_aviso").html("");
                    $("#mensaje_aviso").append(mensaje);
                    animacionAviso("mensaje_aviso");
                } else {
                    var periodos = responde.datos["periodos"];
                    var tiempo_manejo_total = responde.datos["tiempo_manejo_total"];
                    var total_vehiculos = responde.datos["total_vehiculos"];
                    var total_viajes = responde.datos["total_viajes"];

                    var total_coordenadas = responde.datos["total_coordenadas"];
                    var total_viajes_con_coordenadas_fin = 0;
                    var total_viajes_en_cluster = 0;
                    $.each(total_coordenadas, function(key, value) {
                        total_viajes_con_coordenadas_fin += value.total;
                        total_viajes_en_cluster += value.en_cluster
                    });
                    var porcentaje_total_cluster = roundToTwo((total_viajes_en_cluster / total_viajes_con_coordenadas_fin) * 100);

                    var html = "<div id='title' class='titulo_principal'>Horario" +
                        "<div class='leyenda_horarios'>D = 0 a 6 hrs | B = 6 a 11 hrs | C = 11 a 14 hrs | A = 14 a 18 hrs | E = 18 a 0 hrs</div>" +
                        "</div>" +

                        "<table id='tabla_dashboard_riesgos'>" +
                        "<tr>" +
                        "<th>Tipo</th>" +
                        "<th>Número de Vehículos</th>" +
                        "<th>Porcentaje de Vehículos</th>" +
                        "<th>Tiempo de Manejo</th>" +
                        "<th>KM de Manejo</th>" +
                        "<th>Consumo</th>" +
                        "<th>Velocidad Promedio</th>" +
                        "<th>Eventos Agresivos por KM</th>" +
                        "<th>Cluster <br>" + porcentaje_total_cluster + " %</th>" +
                        "<th>Probabilidad de Accidente</th>" +
                        "</tr>";
                    $.each(periodos, function(key, value) {
                        var probabilidad_horario = probabilidadHorario(key);

                        var porcentaje_cluster = roundToTwo((total_coordenadas[key].en_cluster / total_coordenadas[key].total) * 100);
                        var probabilidad_cluster = probabilidadCluster(porcentaje_cluster);

                        var porcentaje_eventos_agresivos = roundToTwo((value.conteo_alarmas / value.km_manejo) * 100);
                        var probabilidad_aggressive = probabilidadAggressive(porcentaje_eventos_agresivos);

                        var total_probabilidad = probabilidad_horario + probabilidad_cluster + probabilidad_aggressive;
                        html += "<tr>" +
                            "<input type='hidden' class='car_id' value=''>" +
                            "<td>" + key + "</td>" +
                            "<td>" + roundToTwo(value.vehiculos) + "</td>" +
                            "<td>" + roundToTwo((value.vehiculos * 100) / total_vehiculos) + "%</td>" +
                            "<td>" + roundToTwo((value.tiempo_manejo * 100) / tiempo_manejo_total) + "%</td>" +
                            "<td>" + roundToTwo(value.km_manejo) + " km</td>" +
                            "<td>" + roundToTwo(value.km_manejo / value.consumo) + " km/lt</td>" +
                            //"<td>" + roundToTwo(value.velocidad_promedio / total_viajes[key]) + " km/hr</td>" +
                            "<td>" + roundToTwo(value.km_manejo / value.tiempo_manejo) + " km/hr</td>" +
                            "<td>" + porcentaje_eventos_agresivos + " %</td>" +
                            "<td>" + porcentaje_cluster + " %</td>" +
                            "<td>" + total_probabilidad + " %</td>" +
                            "</tr>";
                    });


                    html += "</table>";
                    $("#content").css("display", "show");
                    $("#reporte_dashboard_riesgos").append(html);
                    $("#report").css("display", "show");


                    var color = responde.datos["vehiculos_color"];
                    var periodo = responde.datos["periodos"]
                    var resp = responde.datos["datos_general"];
                    var total_coordenadas_vehiculos = responde.datos["total_coordenadas_vehiculos"];
                    var clustering_total = 0;
                    var clustering_en = 0;

                    if (total_coordenadas_vehiculos != null) {
                        $.each(total_coordenadas_vehiculos, function(key, value) {
                            clustering_en += value.total;
                            clustering_total += value.en_cluster
                        });
                    }

                    var html = "<div id='tittle_color' class='titulo_principal'>Listado por Unidad" +
                        "</div>" +
                        "<table id='tabla_por_color' class='tablesorter'>" +
                        "<thead>" +
                        "<tr>" +
                        "<th>Placa</th>" +
                        "<th>Consumo</th>" +
                        "<th>Horario</th>" +
                        "<th>Evento Agresivo</th>" +
                        "<th>Clustering</th>" +
                        "<th>Velocidad Promedio</th>" +
                        "<th>Probabilidad de Accidente</th>" +
                        "</tr>" +
                        "</thead>" +
                        "<tbody>";
                    var sumaVelocidad = 0;
                    $.each(color, function(key, value) {
                        sumaVelocidad += value.velocidad_promedio
                    });

                    //Promedios 
                    var velocidad_promedio_general = 0;
                    var consumo_promedio_general = 0;
                    var num_vehiculos = 0;
                    $.each(color, function(key, value) {
                        consumo_promedio_general += roundToTwo(value.kilometros / value.consumo);
                        velocidad_promedio_general += roundToTwo(value.velocidad_promedio / value.total);
                        num_vehiculos += 1;
                    });

                    if (velocidad_promedio_general > 0)
                        velocidad_promedio_general = velocidad_promedio_general / num_vehiculos;
                    if (consumo_promedio_general > 0)
                        consumo_promedio_general = consumo_promedio_general / num_vehiculos;
                    //FIN: Promedios

                    $.each(color, function(key, value) {
                        var consumo_por_litro = roundToTwo(value.kilometros / value.consumo);
                        var color_consumo = colorPromedio(consumo_por_litro, consumo_promedio_general);

                        var porcentaje_eventos = roundToTwo((value.total_alarmas / value.kilometros) * 100);

                        var velocidad_promedio_vehiculo = roundToTwo((value.velocidad_promedio / this.total));
                        var color_velocidad = colorPromedio(velocidad_promedio_vehiculo, velocidad_promedio_general);

                        var porcentaje_horario = roundToTwo(((value.A + value.B) / value.total) * 100);

                        if (total_coordenadas_vehiculos != null && typeof total_coordenadas_vehiculos[key] !== "undefined")
                            var porcentaje_clustering = roundToTwo((total_coordenadas_vehiculos[key].en_cluster / total_coordenadas_vehiculos[key].total) * 100);
                        else
                            var porcentaje_clustering = 0;

                        var color_horario = colorHorario(porcentaje_horario);
                        var color_eventos = colorEvento(porcentaje_eventos);
                        var color_cluster = colorClustering(porcentaje_clustering);

                        var porcentajes_periodo = {
                            "A": ((value.A / value.total) * 100),
                            "B": ((value.B / value.total) * 100),
                            "C": ((value.C / value.total) * 100),
                            "D": ((value.D / value.total) * 100),
                            "E": ((value.E / value.total) * 100)
                        };
                        var mayor_porcentaje = mayorPorcentajeHorario(porcentajes_periodo);

                        var probabilidad_horario = probabilidadHorario(mayor_porcentaje);
                        var probabilidad_cluster = probabilidadCluster(porcentaje_clustering);
                        var probabilidad_aggressive = probabilidadAggressive(porcentaje_eventos);
                        var total_probabilidad = probabilidad_horario + probabilidad_cluster + probabilidad_aggressive;
                        var color_riesgo = colorRiesgo(total_probabilidad);

                        html += "<tr>" +
                            "<input type='hidden' class='car_id' value=" + this.car_id + ">" +
                            "<td>" + this.placa + "</td>" +
                            "<td " + color_consumo + ">" + consumo_por_litro + " km/lt</td>" +
                            "<td " + color_horario + ">" + porcentaje_horario + " %</td>" +
                            "<td " + color_eventos + ">" + porcentaje_eventos + " %</td>" +
                            "<td " + color_cluster + ">" + porcentaje_clustering + " %</td>" +
                            "<td " + color_velocidad + ">" + velocidad_promedio_vehiculo + " km/hr</td>" +
                            "<td " + color_riesgo + "> " + total_probabilidad + " %</td>" +
                            "</tr>";
                    });


                    html += "</tbody></table>";
                    $("#content").css("display", "block");
                    $("#reporte_por_color").append(html);
                    $("#report").css("display", "block");
                    $("#tabla_por_color").tablesorter({ sortList: [
                            [6, 1]
                        ] });
                }


            });
        } //*tamaño cluster* 
        else {
            $("#mensaje_aviso").html("El Tamaño del Cluster debe ser mayor a 0");
            animacionAviso("mensaje_aviso");
        } //PETICION DE TAMAÑO CLUSTER
    });
    //FIN: Funciones de elementos

    $("#exportar_excel_riesgos").click(function() {
        var leyenda = $(".leyenda_horarios").text();
        $(".leyenda_horarios").text("");
        $.fancybox([{
            href: '#loading',
            modal: true,
            minWidth: 440,
            minHeight: 440,
            autoResize: true,
            scrollOutside: false,
            padding: 0
        }]);

        var html = $("#reporte_dashboard_riesgos").html() + "<br><br><br>" + $("#reporte_por_color").html();
        var uri = 'data:application/vnd.ms-excel;base64,' + $.base64.encode(html);

        var downloadLink = document.createElement("a");
        downloadLink.href = uri;
        downloadLink.download = "informacion.xls";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        $(".leyenda_horarios").text(leyenda);

        setTimeout(function() {
            $.fancybox.close();
        }, 2000);
    });


}); //FRF

function animacionAviso(div) {
    $("#" + div).show("bounce", { "direction": "down" }, 2000);
    setTimeout(function() { $("#" + div).hide("drop", { "direction": "down" }, 1000); }, 2000);
}

function roundToTwo(num) {
    if (!isFinite(num))
        return 0;
    return +(Math.round(num + "e+2") + "e-2");
}

function probabilidadHorario(horario) {
    var probabilidad = 0;
    switch (horario) {
        case "A":
            probabilidad = 9;
            break;

        case "B":
            probabilidad = 8;
            break;

        case "C":
            probabilidad = 6;
            break;

        case "D":
            probabilidad = 4;
            break;

        case "E":
            probabilidad = 3;
            break;

        default:
            probabilidad = 100;
            break;
    }

    return probabilidad;
}

function probabilidadCluster(cluster) {
    var probabilidad = 0;
    if (cluster == 0)
        probabilidad = 40;
    else if (cluster > 0 && cluster < 10)
        probabilidad = 12;
    else if (cluster >= 10 && cluster < 25)
        probabilidad = 9;
    else if (cluster >= 25 && cluster < 50)
        probabilidad = 6;
    else if (cluster >= 50 && cluster < 75)
        probabilidad = 3;
    else if (cluster >= 75)
        probabilidad = 1;
    else
        probabilidad = 100;

    return probabilidad;
}

function probabilidadAggressive(eventos) {
    var probabilidad = 0;
    if (eventos >= 0 && eventos <= 5)
        probabilidad = 2;
    else if (eventos > 5 && eventos <= 10)
        probabilidad = 4;
    else if (eventos > 10 && eventos <= 25)
        probabilidad = 6;
    else if (eventos > 25 && eventos <= 50)
        probabilidad = 8;
    else if (eventos > 50)
        probabilidad = 10;
    else
        probabilidad = 100;

    return probabilidad;
}

function colorHorario(dato) {
    //Var
    var colRojo = 'bgcolor="#c45141"';
    var colAmarillo = 'bgcolor="#ffe600"';
    var colVerde = 'bgcolor="#8cc63f"';
    var resultado = 'bgcolor="#666"';

    if (dato <= 40)
        resultado = colVerde;
    else if (dato > 40 && dato < 60)
        resultado = colAmarillo;
    else if (dato >= 60)
        resultado = colRojo;

    return resultado;
}

function colorEvento(dato) {
    //Var
    var colRojo = 'bgcolor="#c45141"';
    var colAmarillo = 'bgcolor="#ffe600"';
    var colVerde = 'bgcolor="#8cc63f"';
    var resultado = 'bgcolor="#666"';

    if (dato <= 3)
        resultado = colVerde;
    else if (dato > 3 && dato < 9)
        resultado = colAmarillo;
    else if (dato >= 9)
        resultado = colRojo;

    return resultado;
}

function colorRiesgo(dato) {
    //Var
    var colRojo = 'bgcolor="#c45141"';
    var colAmarillo = 'bgcolor="#ffe600"';
    var colVerde = 'bgcolor="#8cc63f"';
    var resultado = 'bgcolor="#666"';

    if (dato <= 8)
        resultado = colVerde;
    else if (dato > 8 && dato <= 15)
        resultado = colAmarillo;
    else if (dato > 15)
        resultado = colRojo;

    return resultado;
}

function colorClustering(dato) {
    //Var
    var colRojo = 'bgcolor="#c45141"';
    var colAmarillo = 'bgcolor="#ffe600"';
    var colVerde = 'bgcolor="#8cc63f"';
    var resultado = 'bgcolor="#666"';

    if (dato >= 70)
        resultado = colVerde;
    else if (dato > 50 && dato < 70)
        resultado = colAmarillo;
    else if (dato <= 50)
        resultado = colRojo;

    return resultado;
}

function colorPromedio(dato, promedio) {
    var MS = promedio * 0.03; //Margen Superior
    var MI = promedio * 0.03; //Margen Inferior

    //Var
    var colRojo = 'bgcolor="#c45141"';
    var colAmarillo = 'bgcolor="#ffe600"';
    var colVerde = 'bgcolor="#8cc63f"';

    var resultado = 'bgcolor="#666"';

    if (dato > (promedio + MS)) resultado = colVerde;
    if (dato <= (promedio + MS) && dato >= (promedio - MI)) resultado = colAmarillo;
    if (dato < (promedio - MI)) resultado = colRojo;

    return resultado;
}

function mayorPorcentajeHorario(porcentajes_periodo) {
    var max = "Z";
    var to_beat = 0;
    $.each(porcentajes_periodo, function(key, value) {
        if (value > to_beat) {
            to_beat = value;
            max = key;
        }
    });

    return max;
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
$(document).ajaxStart(function() {
    $.fancybox([{
        href: '#loading',
        modal: true,
        minWidth: 440,
        minHeight: 440,
        autoResize: true,
        scrollOutside: false,
        padding: 0
    }]);
});

$(document).ajaxStop(function() {
    $.fancybox.close();
});

$().ready(function () {
    getDateTime();
    $("#datetime").click();
});//ready


//-------------------------------------