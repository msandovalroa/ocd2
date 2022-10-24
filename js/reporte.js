
function roundToTwo(num) {
    if (!isFinite(num))
        return 0;
    return +(Math.round(num + "e+2") + "e-2");
}

function numberWithCommas(x) {
    x = roundToTwo(x);

    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function isOk(num) {
    if (!isFinite(num))
        return 0;
    return num;
}

jQuery(function($) {
    $('#start').datetimepicker(
        $.datepicker.regional['es']
    );
    $('#end').datetimepicker(
        $.timepicker.regional['es']
    );
    //Click on button
    $("#datetime").click(function() {
        var inicio = moment($("#start").val(), "DD/MM/YYYY HH:mm");
        var fin = moment($("#end").val(), "DD/MM/YYYY HH:mm");
        var RF = fin.diff(inicio, 'days') + 1;
        var car_ids = "";

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

        var reporte = peticion("generar", "generarReporte", param, "");

        reporte.done(function(response) {
            var codigo = response.resultado;
            var respuesta = response.datos["datos"];
            //console.log(response);
            //console.log(respuesta);
            if (codigo == "Error") {
                $("#mensaje_aviso").html("");
                $("#mensaje_aviso").append(respuesta);
                animacionAviso("mensaje_aviso");
            } else {
                //$("#content").css("display", "none");

                var total_data = respuesta.length;

                var total_car_driving_hours = 0;
                var total_car_driving_days = 0;
                var total_car_velocidad = 0;
                var total_car_no_trips = 0;
                var total_car_kilometraje = 0;
                var total_car_combustible = 0;
                var total_car_costototal = 0;
                var total_car_rendimiento = 0;
                var total_car_safety_score = 0;
                var total_car_eco_score = 0;
                var total_average_speed = 0;
                var total_average_kmperhour = 0;
                var total_average_kmpertrip = 0;
                var total_tripsperdayvsavg = 0;
                var total_car_dtc = 0;

                var chart_car_driving_days = new Array();
                var chart_car_velocidad = new Array();
                var chart_car_no_trips = new Array();
                var chart_car_kilometraje = new Array();
                var chart_car_combustible = new Array();
                var chart_car_costototal = new Array();
                var chart_car_driving_hours = new Array();

                var chart_safe_driving_habits = new Array();
                var chart_economical_driving_habits = new Array();

                //Totales
                $.each(respuesta, function(idx, elem) {
                    var temp_car_driving_days = [elem.car_license, roundToTwo(elem.car_driving_hours / 24)];
                    var temp_car_velocidad = [elem.car_license, roundToTwo(elem.car_kilometraje / elem.car_driving_hours)];
                    var temp_car_no_trips = [elem.car_license, elem.car_no_trips];
                    var temp_car_kilometraje = [elem.car_license, roundToTwo(elem.car_kilometraje)];
                    var temp_car_combustible = [elem.car_license, roundToTwo(elem.car_combustible)];
                    var temp_car_costototal = [elem.car_license, roundToTwo(elem.car_costototal)];
                    var temp_car_driving_hours = [elem.car_license, roundToTwo(elem.car_driving_hours)];

                    if (typeof elem.car_safety_score !== "undefined")
                        var temp_safe_driving_habits = [elem.car_license, roundToTwo(parseFloat(elem.car_safety_score))];
                    else var temp_safe_driving_habits = [elem.car_license, 0];

                    if (typeof elem.car_eco_score !== "undefined")
                        var temp_economical_driving_habits = [elem.car_license, roundToTwo(parseFloat(elem.car_eco_score))];
                    else var temp_economical_driving_habits = [elem.car_license, 0];

                    total_car_driving_days += (parseFloat(elem.car_driving_hours) / 24);
                    total_car_no_trips += elem.car_no_trips;
                    total_car_kilometraje += parseFloat(elem.car_kilometraje);
                    total_car_combustible += parseFloat(elem.car_combustible);
                    total_car_costototal += parseFloat(elem.car_costototal);
                    total_car_driving_hours += parseFloat(elem.car_driving_hours);
                    total_car_dtc += parseInt(elem.dtc);

                    if (typeof elem.car_safety_score !== "undefined") total_car_safety_score += parseFloat(elem.car_safety_score);
                    if (typeof elem.car_eco_score !== "undefined") total_car_eco_score += parseFloat(elem.car_eco_score);

                    if (elem.car_combustible != 0) {
                        total_car_rendimiento += (elem.car_kilometraje) / (elem.car_combustible);
                    }
                    if (elem.car_driving_hours != 0) {
                        total_average_speed += ((elem.car_kilometraje) / (elem.car_driving_hours));
                    }
                    if (elem.car_no_trips != 0) {
                        total_average_kmpertrip += (elem.car_kilometraje / elem.car_no_trips);

                        if ((elem.car_driving_hours / 24) != 0) {
                            total_tripsperdayvsavg += ((total_car_no_trips / total_car_driving_days) / (elem.car_no_trips / (elem.car_driving_hours / 24)));
                        }
                    }

                    chart_car_driving_days.push(temp_car_driving_days);
                    chart_car_velocidad.push(temp_car_velocidad);
                    chart_car_no_trips.push(temp_car_no_trips);
                    chart_car_kilometraje.push(temp_car_kilometraje);
                    chart_car_combustible.push(temp_car_combustible);
                    chart_car_costototal.push(temp_car_costototal);
                    chart_car_driving_hours.push(temp_car_driving_hours);
                    chart_safe_driving_habits.push(temp_safe_driving_habits);
                    chart_economical_driving_habits.push(temp_economical_driving_habits);
                });
                //AQUI YA TIENES TOTALES
                $('#details_table > table > tbody').append(
                    '<tr><td>' +
                    '</td><td>' + "Total" +
                    //'</td><td>'+ numberWithCommas(total_car_driving_days / total_data) + "" +
                    '</td><td>' + Math.round(total_car_driving_days / total_data) + "" +
                    '</td><td>' + numberWithCommas(total_car_no_trips) + "" +
                    '</td><td>' + numberWithCommas(total_car_kilometraje) + "" +
                    '</td><td>' + numberWithCommas(total_car_combustible) + "" +
                    '</td><td>' + "$" + numberWithCommas(total_car_costototal) +
                    '</td><td>' + numberWithCommas(total_car_driving_hours) + "" +
                    '</td></tr>'
                );

                $('#dashboard_table > table > tbody').append(
                    '<tr><td>' +
                    '</td><td>' + "Total" +
                    '</td><td>' + numberWithCommas(total_car_rendimiento / total_data) + "" +
                    '</td><td>' + numberWithCommas(total_car_safety_score / total_data) +
                    '</td><td>' + numberWithCommas(total_car_eco_score / total_data) +
                    '</td><td>' + numberWithCommas(total_average_speed / total_data) +
                    '</td><td>' + numberWithCommas(total_average_kmpertrip / total_data) +
                    '</td><td>' + numberWithCommas(total_tripsperdayvsavg / total_data) +
                    '</td><td>' + total_car_dtc +
                    '</td></tr>'
                );

                var elementos = [];
                var conteo = [];
                $.each(respuesta, function(idx, elem) {
                    car_ids += elem.car_id + ",";
                    //Comprobar si esta definido o no.
                    //if(elem.car_no_trips > 0 && elem.car_kilometraje > 0 && elem.car_combustible > 0 && elem.car_costototal > 0 && elem.car_driving_hours > 0){

                    var colorRendimiento, colorSafe, colorEco, colorVelProm, colorKilomProm, colorVVP, colorDTC;

                    var resultRendimiento = elem.car_kilometraje / elem.car_combustible;
                    var resultSafe = elem.car_safety_score;
                    var resultEco = elem.car_eco_score;
                    var resultVelProm = elem.car_kilometraje / (elem.car_driving_hours);
                    var resultKilomProm = elem.car_kilometraje / elem.car_no_trips;
                    var resultVVP = (total_car_no_trips / total_car_driving_days) / (elem.car_no_trips / (elem.car_driving_hours / 24));
                    var resultDTC = elem.dtc;

                    //Calcular colores de tabla

                    //Rendimiento
                    colorRendimiento = diffPercent(resultRendimiento, (total_car_rendimiento / total_data));

                    //Safe Score
                    //colorSafe = diffPercent(resultSafe, (total_car_safety_score / total_data));
                    colorSafe = 'bgcolor="white"';

                    //Eco Score
                    //colorEco = diffPercent(resultEco, (total_car_eco_score / total_data));
                    colorEco = 'bgcolor="white"';

                    //Velocidad Promedio
                    colorVelProm = diffPercent(resultVelProm, (total_average_speed / total_data));

                    //Kilometraje promedio por viaje
                    colorKilomProm = diffPercent(resultKilomProm, (total_average_kmpertrip / total_data));

                    //Viajes VS Promedio
                    colorVVP = diffPercent(resultVVP, (total_tripsperdayvsavg / total_data));
                    //detalles
                    $('#details_table > table > tbody').append(
                        '<tr><td>' + elem.car_license +
                        '</td><td>' + elem.car_group +
                        //'</td><td>'+ numberWithCommas(roundToTwo( (elem.car_driving_hours / 24) )) + "" +
                        '</td><td>' + Math.round(elem.car_driving_hours / 24) + "" +
                        '</td><td>' + elem.car_no_trips + "" +
                        '</td><td>' + numberWithCommas(roundToTwo(elem.car_kilometraje)) + "" +
                        '</td><td>' + numberWithCommas(roundToTwo(elem.car_combustible)) + "" +
                        '</td><td>' + "$" + numberWithCommas(roundToTwo(elem.car_costototal)) +
                        '</td><td>' + numberWithCommas(roundToTwo(elem.car_driving_hours)) + "" +
                        '</td></tr>'
                    );

                    //panel de actividad

                    $('#dashboard_table > table > tbody').append(
                        '<tr><td>' + elem.car_license +
                        '</td><td>' + elem.car_group +
                        '</td><td ' + colorRendimiento + '>' + numberWithCommas(resultRendimiento) + "" +
                        '</td><td ' + colorSafe + '>' + numberWithCommas(resultSafe) +
                        '</td><td ' + colorEco + '>' + numberWithCommas(resultEco) +
                        '</td><td ' + colorVelProm + '>' + numberWithCommas(resultVelProm) +
                        '</td><td ' + colorKilomProm + '>' + numberWithCommas(resultKilomProm) +
                        '</td><td ' + colorVVP + '>' + numberWithCommas(resultVVP) +
                        '</td><td>' + resultDTC +
                        '</td></tr>'
                    );

                    //_______________________________
                    var subgrupo_ = elem.car_group;
                    $.each(elem, function(key, value) {
                        if (typeof elementos[subgrupo_] === "undefined") {
                            elementos[subgrupo_] = [];
                        }
                        if (typeof conteo[subgrupo_] === "undefined") {
                            conteo[subgrupo_] = [];
                        }

                        if (typeof elementos[subgrupo_][key] === "undefined") {
                            elementos[subgrupo_][key] = 0;
                        }
                        if (typeof conteo[subgrupo_][key] === "undefined") {
                            conteo[subgrupo_][key] = 0;
                        }

                        if ($.isNumeric(value)) {
                            elementos[subgrupo_][key] += parseFloat(value);
                            conteo[subgrupo_][key] += 1;
                        }
                    });
                    //---------------------------------
                    //}

                });

                //------------------------------------------------
                var total_data_2 = 0;
                for (var item0 in elementos) {
                    total_data_2 += 1;
                }

                var total_car_driving_hours_2 = 0;
                var total_car_driving_days_2 = 0;
                var total_car_no_trips_2 = 0;
                var total_car_kilometraje_2 = 0;
                var total_car_combustible_2 = 0;
                var total_car_costototal_2 = 0;
                var total_car_rendimiento_2 = 0;
                var total_car_safety_score_2 = 0;
                var total_car_eco_score_2 = 0;
                var total_average_speed_2 = 0;
                var total_average_kmperhour_2 = 0;
                var total_average_kmpertrip_2 = 0;
                var total_tripsperdayvsavg_2 = 0;
                var total_car_dtc_2 = 0;
                if (total_data_2 > 0) {

                    //Totales elementos es donde guardaste los subgrupos
                    for (var item1 in elementos) {
                        total_car_driving_days_2 += (elementos[item1].car_driving_hours / 24);
                        total_car_no_trips_2 += elementos[item1].car_no_trips;
                        total_car_kilometraje_2 += elementos[item1].car_kilometraje;
                        total_car_combustible_2 += elementos[item1].car_combustible;
                        total_car_costototal_2 += elementos[item1].car_costototal;
                        total_car_driving_hours_2 += elementos[item1].car_driving_hours;
                        total_car_safety_score_2 += isOk(elementos[item1].car_safety_score / conteo[item1].car_safety_score);
                        total_car_eco_score_2 += isOk(elementos[item1].car_eco_score / conteo[item1].car_eco_score);
                        total_car_dtc_2 += parseInt(elementos[item1].dtc);

                        if (elementos[item1].car_combustible != 0) {
                            total_car_rendimiento_2 += (elementos[item1].car_kilometraje) / (elementos[item1].car_combustible);
                        }
                        if (elementos[item1].car_driving_hours != 0) {
                            total_average_speed_2 += ((elementos[item1].car_kilometraje) / (elementos[item1].car_driving_hours));
                        }
                        if (elementos[item1].car_no_trips != 0) {
                            total_average_kmpertrip_2 += (elementos[item1].car_kilometraje / elementos[item1].car_no_trips);

                            if ((elementos[item1].car_driving_hours / 24) != 0) {
                                total_tripsperdayvsavg_2 += ((total_car_no_trips_2 / total_car_driving_days_2) / (elementos[item1].car_no_trips / (elementos[item1].car_driving_hours / 24)));
                            }
                        }
                    }

                    $('#details_table_subgrupo > table > tbody').append(
                        '<tr><td>' +
                        '</td><td>' + "Total" +
                        '</td><td>' + numberWithCommas(total_car_driving_days_2 / total_data_2) + "" +
                        '</td><td>' + numberWithCommas(total_car_no_trips_2) + "" +
                        '</td><td>' + numberWithCommas(total_car_kilometraje_2) + "" +
                        '</td><td>' + numberWithCommas(total_car_combustible_2) + "" +
                        '</td><td>' + "$" + numberWithCommas(total_car_costototal_2) +
                        '</td><td>' + numberWithCommas(total_car_driving_hours_2) + "" +
                        '</td></tr>'
                    );

                    $('#dashboard_table_subgrupo > table > tbody').append(
                        '<tr><td>' +
                        '</td><td>' + "Total" +
                        '</td><td>' + numberWithCommas(total_car_rendimiento_2 / total_data_2) + "" +
                        '</td><td>' + numberWithCommas(total_car_safety_score_2 / total_data_2) +
                        '</td><td>' + numberWithCommas(total_car_eco_score_2 / total_data_2) +
                        '</td><td>' + numberWithCommas(total_average_speed_2 / total_data_2) +
                        '</td><td>' + numberWithCommas(total_average_kmpertrip_2 / total_data_2) +
                        '</td><td>' + numberWithCommas(total_tripsperdayvsavg_2 / total_data_2) +
                        '</td><td>' + total_car_dtc_2 +
                        '</td></tr>'
                    );

                    for (var item in elementos) {
                        var colorRendimiento_2, colorSafe_2, colorEco_2, colorVelProm_2, colorKilomProm_2, colorVVP_2, colorDTC_2;

                        var resultRendimiento_2 = elementos[item].car_kilometraje / elementos[item].car_combustible;
                        var resultSafe_2 = elementos[item].car_safety_score / conteo[item].car_safety_score;
                        var resultEco_2 = elementos[item].car_eco_score / conteo[item].car_eco_score;
                        var resultVelProm_2 = elementos[item].car_kilometraje / (elementos[item].car_driving_hours);
                        var resultKilomProm_2 = elementos[item].car_kilometraje / elementos[item].car_no_trips;
                        var resultVVP_2 = (total_car_no_trips_2 / total_car_driving_days_2) / (elementos[item].car_no_trips / (elementos[item].car_driving_hours / 24));
                        var resultDTC_2 = elementos[item].dtc;

                        //Calcular colores de tabla

                        //Rendimiento
                        colorRendimiento_2 = diffPercent(resultRendimiento_2, (total_car_rendimiento_2 / total_data_2));

                        //Safe Score
                        //colorSafe = diffPercent(resultSafe, (total_car_safety_score / total_data));
                        colorSafe_2 = 'bgcolor="white"';

                        //Eco Score
                        //colorEco = diffPercent(resultEco, (total_car_eco_score / total_data));
                        colorEco_2 = 'bgcolor="white"';

                        //Velocidad Promedio
                        colorVelProm_2 = diffPercent(resultVelProm_2, (total_average_speed_2 / total_data_2));

                        //Kilometraje promedio por viaje
                        colorKilomProm_2 = diffPercent(resultKilomProm_2, (total_average_kmpertrip_2 / total_data_2));

                        //Viajes VS Promedio
                        colorVVP_2 = diffPercent(resultVVP_2, (total_tripsperdayvsavg_2 / total_data_2));

                        $('#details_table_subgrupo > table > tbody').append(
                            '<tr><td>' +
                            '</td><td>' + item +
                            '</td><td>' + numberWithCommas(roundToTwo((elementos[item].car_driving_hours / 24))) + "" +
                            '</td><td>' + elementos[item].car_no_trips + "" +
                            '</td><td>' + numberWithCommas(roundToTwo(elementos[item].car_kilometraje)) + "" +
                            '</td><td>' + numberWithCommas(roundToTwo(elementos[item].car_combustible)) + "" +
                            '</td><td>' + "$" + numberWithCommas(roundToTwo(elementos[item].car_costototal)) +
                            '</td><td>' + numberWithCommas(roundToTwo(elementos[item].car_driving_hours)) + "" +
                            '</td></tr>'
                        );

                        $('#dashboard_table_subgrupo > table > tbody').append(
                            '<tr><td>' +
                            '</td><td>' + item +
                            '</td><td ' + colorRendimiento_2 + '>' + numberWithCommas(resultRendimiento_2) + "" +
                            '</td><td ' + colorSafe_2 + '>' + numberWithCommas(resultSafe_2) +
                            '</td><td ' + colorEco_2 + '>' + numberWithCommas(resultEco_2) +
                            '</td><td ' + colorVelProm_2 + '>' + numberWithCommas(resultVelProm_2) +
                            '</td><td ' + colorKilomProm_2 + '>' + numberWithCommas(resultKilomProm_2) +
                            '</td><td ' + colorVVP_2 + '>' + numberWithCommas(resultVVP_2) +
                            '</td><td>' + resultDTC_2 +
                            '</td></tr>'
                        );
                    }
                }

                //-------------------------------------------------

                //END LOAD JSON
               $("#report").css("display", "block");

                //Para mes pasado
                var params_p = "&mes_pasado=1&car_path=" + car_path;
                peticion("generar", "generarReporte", params_p, "").done(function(response) {
                    var codigo = response.resultado;
                    var respuesta = response.datos["datos"];
                    var rf_p = response.datos["r_f"];
                    var colorear = false;
                    if (codigo == "Error") {
                        $("#mensaje_aviso").html("");
                        $("#mensaje_aviso").append("No se encontraron datos del mes pasado");
                        animacionAviso("mensaje_aviso");
                    } else {
                        colorear = true;
                        var total_data_3 = respuesta.length;

                        var total_car_driving_hours_3 = 0;
                        var total_car_driving_days_3 = 0;
                        var total_car_no_trips_3 = 0;
                        var total_car_kilometraje_3 = 0;
                        var total_car_combustible_3 = 0;
                        var total_car_costototal_3 = 0;
                        var total_car_rendimiento_3 = 0;
                        var total_car_safety_score_3 = 0;
                        var total_car_eco_score_3 = 0;
                        var total_average_speed_3 = 0;
                        var total_average_kmperhour_3 = 0;
                        var total_average_kmpertrip_3 = 0;
                        var total_tripsperdayvsavg_3 = 0;

                        /*var chart_safe_driving_habits = new Array();
                        var chart_economical_driving_habits = new Array();
                        var chart_car_combustible_3 = new Array();*/

                        //Totales
                        $.each(respuesta, function(idx, elem) {
                            if (typeof elem.car_safety_score !== "undefined")
                                var temp_safe_driving_habits = [elem.car_license, roundToTwo(parseFloat(elem.car_safety_score))];
                            else var temp_safe_driving_habits = [elem.car_license, 0];

                            if (typeof elem.car_eco_score !== "undefined")
                                var temp_economical_driving_habits = [elem.car_license, roundToTwo(parseFloat(elem.car_eco_score))];
                            else var temp_economical_driving_habits = [elem.car_license, 0];

                            var temp_car_combustible_3 = [elem.car_license, roundToTwo(elem.car_combustible)];

                            total_car_driving_days_3 += (elem.car_driving_hours / 24);
                            total_car_no_trips_3 += elem.car_no_trips;
                            total_car_kilometraje_3 += parseFloat(elem.car_kilometraje);
                            total_car_combustible_3 += parseFloat(elem.car_combustible);
                            total_car_costototal_3 += parseFloat(elem.car_costototal);
                            total_car_driving_hours_3 += parseFloat(elem.car_driving_hours);

                            if (typeof elem.car_safety_score !== "undefined") total_car_safety_score_3 += parseFloat(elem.car_safety_score);
                            if (typeof elem.car_eco_score !== "undefined") total_car_eco_score_3 += parseFloat(elem.car_eco_score);

                            if (elem.car_combustible != 0) {
                                total_car_rendimiento_3 += (elem.car_kilometraje) / (elem.car_combustible);
                            }
                            if (elem.car_driving_hours != 0) {
                                total_average_speed_3 += ((elem.car_kilometraje) / (elem.car_driving_hours));
                            }
                            if (elem.car_no_trips != 0) {
                                total_average_kmpertrip_3 += (elem.car_kilometraje / elem.car_no_trips);

                                if ((elem.car_driving_hours / 24) != 0) {
                                    total_tripsperdayvsavg_3 += ((total_car_no_trips_3 / total_car_driving_days_3) / (elem.car_no_trips / (elem.car_driving_hours / 24)));
                                }
                            }

                            /*chart_safe_driving_habits.push(temp_safe_driving_habits);
			            	chart_economical_driving_habits.push(temp_economical_driving_habits);
			                chart_car_combustible_3.push(temp_car_combustible_3);*/
                        });
                    }
                    //Charts

                    //PLOT

                    for (var i = 0; i < 8; i++) {
                        $('#report > #graphs').append(
                            '<div class="chart" id="chart' + (i + 1) + '"></div>'
                        );
                    }

                    var seriesColors;
                    var purpleColor = ["#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be"];

                    //Numero de viajes promedio
                    /*
			            Numero de viajes promedio (NVP)
			            Es el promedio de viajes por dia por unidad
			            RF = Rango de fecha de la selección
			            NVT = Numero de viajes totales
			            NOT = Numero de unidades Totales
			            Entonces  el numero de viajes promedio es
			            NVP = (NVT / NOT / RF )
			            Color morado  o gris ya que es informativo  hasta que el cliente marque su propio rango
			
			            */

                    var NVP = (total_car_no_trips / total_data / RF);
                    var NVP_P = (total_car_no_trips_3 / total_data_3 / rf_p); //NVP de mes pasado
                    seriesColors = colorGraficas(NVP, NVP_P);

                    //chart("chart2", chart_car_no_trips, "Numero de Viajes Promedio", "Diario por unidad", NVP, seriesColors);
                    var numero_grafica = "chart2";
                    dona_nueva(numero_grafica, chart_car_no_trips, "Numero de Viajes Promedio", "Diario por unidad", parseFloat(Math.round(NVP * 100) / 100).toFixed(3), seriesColors);
                    //console.log(seriesColors);

                    //chart("chart2", chart_car_no_trips, "Numero de Viajes", total_car_no_trips, seriesColors);

                    //Tiempo de manejo
                    /*
			            Tiempo promedio de Manejo (TPM)
			            RF = Rango de fecha de la selección
			            TTM = Tiempo total de manejo 
			            NOT = Número de unidades totales
			            Formula
			            CPT = (TTM / NOT / RF )
			
			            Color morado ya que es informativo hasta que el cliente marque su propio rango.
			
			            */
                    var TPM = (total_car_driving_hours / total_data / RF);
                    var TPM_P = (total_car_driving_hours_3 / total_data_3 / rf_p);
                    seriesColors = colorGraficas(TPM, TPM_P);

                    var decimalTimeString = TPM;
                    var decimalTime = parseFloat(decimalTimeString);
                    decimalTime = decimalTime * 60 * 60;
                    var hours = Math.floor((decimalTime / (60 * 60)));
                    decimalTime = decimalTime - (hours * 60 * 60);
                    var minutes = Math.floor((decimalTime / 60));
                    decimalTime = decimalTime - (minutes * 60);
                    if (hours < 10)
                        hours = "0" + hours;
                    if (minutes < 10)
                        minutes = "0" + minutes;
                    var time_i = hours + " hrs <br>" + minutes + " min";

                    // chart("chart3", chart_car_driving_hours, "Tiempo Promedio de Manejo", "Diario por unidad (HR)", time_i, seriesColors);
                    var numero_grafica = "chart3";
                    dona_nueva(numero_grafica, chart_car_driving_hours, "Tiempo Promedio de Manejo", "Diario por unidad (HR)", time_i, seriesColors);
                    //dona_nueva(chart_car_no_trips);
                    //chart("chart3", chart_car_driving_hours, "Tiempo Promedio de Manejo (HR)", TPM, seriesColors);
                    //chart("chart6", chart_car_driving_hours, "Tiempo de manejo", total_car_driving_hours, seriesColors);

                    //Costo total            
                    /*
			            Costo promedio total por unidad (CPT)
			 
			            RF = Rango de fecha de la selección
			            CT = Costo total 
			            NOT = Número de unidades totales
			            Formula
			            CPT = (CT / NOT / RF )
			
			            Color morado ya que es informativo hasta que el cliente marque su propio rango.
			
			            */
                    var CPT = (total_car_costototal / total_data / RF);
                    var CPT_P = (total_car_costototal_3 / total_data_3 / rf_p);
                    seriesColors = colorGraficas(CPT, CPT_P);

                    //chart("chart4", chart_car_costototal, "Costo Promedio Total", "Diario por Unidad ($)", CPT, seriesColors);
                    var numero_grafica = "chart4";
                    dona_nueva(numero_grafica, chart_car_costototal, "Costo Promedio Total", "Diario por Unidad ($)", parseFloat(Math.round(CPT * 100) / 100).toFixed(3), seriesColors);

                    //dona_nueva(chart_car_no_trips);
                    //chart("chart5", chart_car_costototal, "Costo total ($)", total_car_costototal, seriesColors);

                    /* Safe driving Habits (SDH)
                     * Safety score / Total data
                     */
                    var SDH = total_car_safety_score / total_data;
                    var SDH_P = total_car_safety_score_3 / total_data_3;
                    seriesColors = colorGraficas(SDH, SDH_P);

                    //chart("chart5", chart_safe_driving_habits, "Safe Driving Habits", SDH, seriesColors);
                    //chart("chart5", chart_safe_driving_habits, "Hábitos de manejo seguro", "Promedio por unidad", SDH, seriesColors);
                    var numero_grafica = "chart5";
                    dona_nueva(numero_grafica, chart_safe_driving_habits, "Hábitos de manejo seguro", "Promedio por unidad", parseFloat(Math.round(SDH * 100) / 100).toFixed(3), seriesColors);
                    //dona_nueva(chart_car_no_trips);
                    /*Economical Driving Habits (EDH)
                     * eco score / total data
                     */
                    var EDH = total_car_eco_score / total_data;
                    var EDH_P = total_car_eco_score_3 / total_data_3;
                    seriesColors = colorGraficas(EDH, EDH_P);

                    //chart("chart6", chart_economical_driving_habits, "Economical Driving Habits", numberWithCommas(total_car_eco_score / total_data), seriesColors);
                    //chart("chart6", chart_economical_driving_habits, "Hábitos de manejo económico", "Promedio por Unidad", numberWithCommas(total_car_eco_score / total_data), seriesColors);
                    var numero_grafica = "chart6";
                    dona_nueva(numero_grafica, chart_economical_driving_habits, "Hábitos de manejo económico", "Promedio por Unidad", parseFloat(Math.round((total_car_eco_score / total_data) * 100) / 100).toFixed(3), seriesColors);

                    //dona_nueva(chart_car_no_trips);
                    //Rendimiento promedio por la flotilla
                    /*
			            KTR =  Kilometros totales recorridos
			            LTC = Litros totales consumidos
			
			            Km / lt =  KTR / LTC
			
			            Color morado ya que es informativo hasta que el cliente marque su propio rango.
			
			            */
                    var KmLt = total_car_kilometraje / total_car_combustible;
                    var KmLt_p = total_car_kilometraje_3 / total_car_combustible_3;
                    seriesColors = colorGraficas(KmLt, KmLt_p);

                    //chart("chart7", chart_car_combustible, "Consumo Medio", "(Litros / 100 KM)", KmLt, seriesColors);
                    var numero_grafica = "chart7";
                    dona_nueva(numero_grafica, chart_car_combustible, "Consumo Medio", "(Litros / 100 KM)", parseFloat(Math.round(KmLt * 100) / 100).toFixed(3), seriesColors);
                    //dona_nueva(chart_car_no_trips);
                    //chart("chart4", chart_car_combustible, "Consumo de Combustible (L)", total_car_combustible, seriesColors);

                    //Kilometraje
                    /*
			            Kilometros diarios promedio por unidad (KMP)
			            RF = Rango de fecha de la selección
			            KMT = Kilómetros recorridos totales
			            NOT = Numero de unidades totales
			            Formula
			            KMP = (NOT / KMT / RF )
						??? CRreo que es KMP = KMT / NOT / RF
			            Color morado ya que es informative hasta que el cliente marque su propio rango.
			
			            */
                    var KMP = (total_car_kilometraje / total_data / RF);
                    var KMP_P = (total_car_kilometraje_3 / total_data_3 / rf_p);
                    seriesColors = colorGraficas(KMP, KMP_P);

                    //chart("chart8", chart_car_kilometraje, "Kilómetros diarios promedio", "Por unidad", KMP, seriesColors);
                    var numero_grafica = "chart8";
                    dona_nueva(numero_grafica, chart_car_kilometraje, "Kilómetros diarios promedio", "Por unidad", parseFloat(Math.round(KMP * 100) / 100).toFixed(3), seriesColors);
                    //dona_nueva(chart_car_no_trips);
                    //chart("chart3", chart_car_kilometraje, "Kilometraje", total_car_kilometraje, seriesColors);

                    //Dias Operativos << YA NO, ahora es velocidad promedio (kilometraje / horas)
                    /*var DO = total_car_driving_days / total_data;
                    var DOP = (DO / RF) * 100;
                    if(DOP >= 90){
                        seriesColors = greenColor;
                    }
                    if(DOP < 90 && DOP >= 60){
                        seriesColors = yellowColor;
                    }
                    if(DOP < 60){
                        seriesColors = redColor;
                    }
                    chart("chart1", chart_car_driving_days, "Días Operativos Promedio", DOP, seriesColors); //Se muestra DOP que es el promedio*/
                    var velocidad_promedio = KMP / TPM;
                    var velocidad_promedio_p = KMP_P / TPM_P;
                    seriesColors = colorGraficas(velocidad_promedio, velocidad_promedio_p);

                    //chart("chart1", chart_car_velocidad, "Velocidad Promedio Diario", "Por Unidad (Km/H)", roundToTwo(velocidad_promedio), seriesColors);
                    var numero_grafica = "chart1";
                    dona_nueva(numero_grafica, chart_car_velocidad, "Velocidad Promedio Diario", "Por Unidad (Km/H)", roundToTwo(velocidad_promedio), seriesColors);
                    //dona_nueva(chart_car_no_trips);
                });
                //FIN: Para mes pasado  

                //Dashboard de seguridad
                /*car_ids = car_ids.substring(0, car_ids.length -1);
		        var params_volumen = param + "&id_carros=" + car_ids ;
		        
		        peticion("generar", "informacionParaDashboardSeguridad", params_volumen, "").done(function(response){
		        	console.log(response)
		        	if(response["resultado"] == "OK"){
		        		//Gráfica por kilometros y horas de manejo
		        		var sumatorias = response["datos"].sumatorias;
			        	var data_horas = [  ["6 am a 12 am", roundToTwo(parseFloat(sumatorias[1].horas))], 
			        						["12 am a 6 pm", roundToTwo(parseFloat(sumatorias[2].horas))],
			        						["6 pm a 11 pm", roundToTwo(parseFloat(sumatorias[3].horas))],
			        						["11 pm a 5 am", roundToTwo(parseFloat(sumatorias[4].horas))]
			        					 ];
			        	var data_kilometros = [  ["6 am a 12 am", roundToTwo(parseFloat(sumatorias[1].kilometros))], 
			        							 ["12 am a 6 pm", roundToTwo(parseFloat(sumatorias[2].kilometros))],
			        							 ["6 pm a 11 pm", roundToTwo(parseFloat(sumatorias[3].kilometros))],
			        							 ["11 pm a 5 am", roundToTwo(parseFloat(sumatorias[4].kilometros))]
			        						  ];
			        	
			        	var seriesColors = ["#FFFF00", "#FFBF00", "#848484", "#151515"];
			        	var result = $.jqplot("chart_manejo_horas", [data_horas], {
					   					seriesDefaults: {
					            			renderer:$.jqplot.DonutRenderer,
					            			rendererOptions:{
					                			sliceMargin: 3,
					                			startAngle: -90,
					                			showDataLabels: false,
					                			dataLabels: 'label',
					                			thickness: 22,
					                			diameter: 168,
					                			shadow: false
					            			}
					        			},
					        			seriesColors: seriesColors,
					        			grid: {
					            			background: '#ffffff',      // CSS color spec for background color of grid.
					            			shadow: false,               // draw a shadow for grid.
					            			borderWidth: 0,
					    				},
					    			});
					    $('<div class="chart_total">Manejo en<br>Horas</div>').insertAfter('#chart_manejo_horas > .jqplot-grid-canvas');
	    				$("#chart_manejo_horas > .chart_total" ).addClass("titulo_enmedio");
	    				
	    				var result = $.jqplot("chart_manejo_kilometros", [data_kilometros], {
					   					seriesDefaults: {
					            			renderer:$.jqplot.DonutRenderer,
					            			rendererOptions:{
					                			sliceMargin: 3,
					                			startAngle: -90,
					                			showDataLabels: false,
					                			dataLabels: 'label',
					                			thickness: 22,
					                			diameter: 168,
					                			shadow: false
					            			}
					        			},
					        			seriesColors: seriesColors,
					        			grid: {
					            			background: '#ffffff',      // CSS color spec for background color of grid.
					            			shadow: false,               // draw a shadow for grid.
					            			borderWidth: 0,
					    				},
					    			});
					    $('<div class="chart_total">Manejo en<br>Kilometros</div>').insertAfter('#chart_manejo_kilometros > .jqplot-grid-canvas');
	    				$("#chart_manejo_kilometros > .chart_total" ).addClass("titulo_enmedio");
	    				
	    				//Velocidades por rango
	    				$.each(sumatorias, function(index, value){
	    					if(index > 0){
	    						var velocidad_rango = roundToTwo(this.kilometros / this.horas);
	    						$("#box_velocidad_rango_" + index).text(velocidad_rango + " km/hr");
	    					}
	    				});
	    				//FIN: Gráfica por kilometros y horas de manejo
	    				
	    				//Gráfica alarmas
	    				var alarmas = response["datos"].alarmas;
	    				console.log(alarmas);
	    				var data_alarmas = [
	    									["Velocidad", parseInt(alarmas["speeding"])],
	    									["Aceleración", parseInt(alarmas["acceleration"])],
	    									["Frenado", parseInt(alarmas["braking"])],
	    									["RPM", parseInt(alarmas["rpm"])]
	    								   ];
	    				console.log(data_alarmas);
	    				var seriesColors = ["#2E64FE", "#FE642E", "#64FE2E", "#D358F7"];
	    				
	    				var result = $.jqplot("chart_alarmas", [data_alarmas], {
					   					seriesDefaults: {
					            			renderer:$.jqplot.DonutRenderer,
					            			rendererOptions:{
					                			sliceMargin: 0,
					                			startAngle: -90,
					                			showDataLabels: false,
					                			dataLabels: 'label',
					                			thickness: 22,
					                			diameter: 168,
					                			shadow: false
					            			}
					        			},
					        			seriesColors: seriesColors,
					        			grid: {
					            			background: '#ffffff',      // CSS color spec for background color of grid.
					            			shadow: false,               // draw a shadow for grid.
					            			borderWidth: 0,
					    				},
					    				legend:{
								            show:true, 
								            placement: 'outside', 
								            rendererOptions: {
								                numberRows: 1
								            }, 
								            location:'s',
								            marginTop: '30px'
								        }
					    			});
					    $('<div class="chart_total">Alarmas</div>').insertAfter('#chart_alarmas > .jqplot-grid-canvas');
	    				$("#chart_alarmas > .chart_total" ).addClass("titulo_enmedio");
	    				//FIN: Gráfica alarmas
		        	}
		        	else{
		        		$("#mensaje_aviso").html("");
						$("#mensaje_aviso").append(response["datos"].mensaje);
						animacionAviso("mensaje_aviso");
		        	}
		        });*/
                //FIN: Dashboard de seguridad
            }
        });


    });

    $("#exportar_excel").click(function() {
        $.fancybox([{
            href: '#loading',
            modal: true,
            minWidth: 440,
            minHeight: 440,
            autoResize: true,
            scrollOutside: false,
            padding: 0
        }]);

        var html = $("#details_table_subgrupo").html() + "<br><br>" +
            $("#details_table").html() + "<br><br>" +
            $("#dashboard_table_subgrupo").html() + "<br><br>" +
            $("#dashboard_table").html();
        var uri = 'data:application/vnd.ms-excel;base64,' + $.base64.encode(html);

        var downloadLink = document.createElement("a");
        downloadLink.href = uri;
        downloadLink.download = "informacion.xls";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        setTimeout(function() {
            $.fancybox.close();
        }, 2000);
    });
});

function chart(div, data, title, total, colors) {
    var donutChartSeriesColors = new Array();

    //Prepare a new array which would be passe to the chart..
    //This will handle even if there are more value than the seriesColors array..
    var j = 0;
    for (var i = 0; i < data.length; i++) {
        if (j == colors.length) {
            j = 0;
        }
        donutChartSeriesColors[i] = colors[j];
        j++;
    }

    var result = $.jqplot(div, [data], {
        title: title,
        seriesDefaults: {
            // make this a donut chart.
            renderer: $.jqplot.DonutRenderer,
            rendererOptions: {
                // Donut's can be cut into slices like pies.
                sliceMargin: 0,
                // Pies and donuts can start at any arbitrary angle.
                startAngle: -90,
                showDataLabels: false,
                // By default, data labels show the percentage of the donut/pie.
                // You can show the data 'value' or data 'label' instead.
                dataLabels: 'label',
                thickness: 22,
                diameter: 168,
            }
        },
        seriesColors: donutChartSeriesColors,
        grid: {
            background: '#ffffff', // CSS color spec for background color of grid.
            shadow: false, // draw a shadow for grid.
            borderWidth: 0,
        },
    });

    if (div == "chart3") {
        var chart_total = total;
        //var chart_total = numberWithCommas(roundToTwo(total));
    } else {
        var chart_total = numberWithCommas(roundToTwo(total));
    }

    var chart_total_class = "";

    switch (chart_total.length) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
            chart_total_class = "chart_total_1"; //32px top 106px
            break;
        case 7:
        case 8:
            chart_total_class = "chart_total_2"; //27 top 111
            break;
        case 9:
            chart_total_class = "chart_total_3"; //24 top 113
            break;
        case 10:
            chart_total_class = "chart_total_4"; //21 top 116
            break;
        case 11:
        case 12:
            chart_total_class = "chart_total_5"; //18 top 119
            break;
        case 13:
        case 14:
            chart_total_class = "chart_total_6"; //17 top 119
            break;
        case 15:
            chart_total_class = "chart_total_7"; //15 top 121 
            break;
        default:
            chart_total_class = "chart_total_8"; //12 top 121 
            break;

    }

    if (div == "chart3") {
        chart_total_class = "chart_total_7"; //15 top 121 
    }

    $('<div class="chart_total">' + chart_total + '</div>').insertAfter('#' + div + ' > .jqplot-grid-canvas');
    $("#" + div + " > .chart_total").addClass(chart_total_class);


    return result;
}

function dona_nueva(div, data, titulo, descripcion, total, colors) {
    var codigo_colores = colors;
    console.log(codigo_colores);
    var source = new Array();
    var colorsArray = new Array();
    console.log(colorsArray);
    console.log("arriba");
    $.each(data, function() {
        // console.log(this)
        source.push({ "Grupo_Autos": this[0], "Total": this[1] })
    });
    var dataAdapter = new $.jqx.dataAdapter(source, {
        async: false,
        autoBind: true,
        beforeLoadComplete: function(records) {
            if (jQuery.inArray("#8C0600", codigo_colores) !== -1) {
                colorsArray = ["#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99"];
                console.log("es rojo");
            } else if (jQuery.inArray("#2d8838", codigo_colores) !== -1) {
                console.log("es verde");
                colorsArray = ["#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67", "#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67"];
            } else if (jQuery.inArray("#c69600", codigo_colores) !== -1) {
                console.log("es amarillo");
                colorsArray = ["#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25", "#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25"];
            } else if (jQuery.inArray("#6e3a8a", codigo_colores) !== -1) {
                console.log("es morado");
                colorsArray = ["#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be", "#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be"];
            }
            console.log(colorsArray);
            $.jqx._jqxChart.prototype.colorSchemes.push({ name: 'myScheme', colors: colorsArray });
        },
        loadError: function(xhr, status, error) { alert('Error loading "' + source.url + '" : ' + error); }
    });
    // prepare jqxChart settings
    var settings = {
        title: titulo,
        description: descripcion,
        enableAnimations: true,
        showLegend: false,
        showBorderLine: false,
        legendPosition: { left: 520, top: 140, width: 100, height: 100 },
        padding: { left: 5, top: 5, right: 5, bottom: 5 },
        titlePadding: { left: 0, top: 0, right: 0, bottom: 5 },
        source: dataAdapter,
        colorScheme: 'myScheme',
        seriesGroups: [{
            type: 'donut',
            showLabels: false,
            series: [{
                dataField: 'Total',
                displayText: 'Grupo_Autos',
                labelRadius: 120,
                initialAngle: 15,
                radius: 80,
                innerRadius: 60,
                centerOffset: 0,
                formatSettings: { sufix: '%', decimalPlaces: 1 }
            }]
        }]
    };
    var selector = "#" + div + "".toString();
    var valueText = total;
    settings.drawBefore = function(renderer, rect) {
            sz = renderer.measureText(valueText, 0, { 'class': 'chart-inner-text' });
            renderer.text(
                valueText,
                rect.x + (rect.width - sz.width) / 2,
                rect.y + rect.height / 2,
                0,
                0,
                0, { 'class': 'chart-inner-text' }
            );
        }
        // setup the chart
    $("#" + div + "").jqxChart(settings);
    colorsArray.length = 0;

} 

function diffPercent(dato, promedio) {
    var MS = promedio * 0.05; //Margen Superior
    var MI = promedio * 0.05; //Margen Inferior

    //Var
    var colRojo = 'bgcolor="#D66B66"';
    var colAmarillo = 'bgcolor="#ffd75b"';
    var colVerde = 'bgcolor="#84cd8d"';

    var resultado = 'bgcolor="#666"';

    if (dato > (promedio + MS)) resultado = colVerde;
    if (dato <= (promedio + MS) && dato >= (promedio - MI)) resultado = colAmarillo;
    if (dato < (promedio - MI)) resultado = colRojo;

    return resultado;
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

function colorGraficas(dato, promedio) {
    var MS = promedio * 0.03; //Margen Superior
    var MI = promedio * 0.03; //Margen Inferior
    //Var
    //Define the seriesColors array...quitar aqui el color extra
    var redColor = ["#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99", "#8C0600"];
    var greenColor = ["#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67"];
    var yellowColor = ["#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25"];
    var purpleColor = ["#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be"];

    var resultado = purpleColor;
    if (dato > (promedio + MS)) resultado = greenColor;
    if (dato <= (promedio + MS) && dato >= (promedio - MI)) resultado = yellowColor;
    if (dato < (promedio - MI)) resultado = redColor;

    return resultado;
}

function animacionAviso(div) {
    $("#" + div).show("bounce", { "direction": "down" }, 2000);
    setTimeout(function() { $("#" + div).hide("drop", { "direction": "down" }, 1000); }, 2000);
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