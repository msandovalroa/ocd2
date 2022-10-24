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

        var reporte = peticion("generar", "generarReporte", param, "");

        reporte.done(function(response) {
            var codigo = response.resultado;
            var respuesta = response.datos["datos"];

            if (codigo == "Error") {
                $("#mensaje_aviso").html("");
                $("#mensaje_aviso").append(respuesta);
                animacionAviso("mensaje_aviso");
            } else {
                $("#content").css("display", "none");

                var total_data = respuesta.length;

                var total_car_driving_hours = 0;
                var total_car_kilometraje = 0;

                var chart_car_driving_hours = new Array();
                var chart_car_kilometraje = new Array();

                $.each(respuesta, function(idx, elem) {
                    var temp_car_driving_hours = [elem.car_license, roundToTwo(elem.car_driving_hours)];
                    var temp_car_kilometraje = [elem.car_license, roundToTwo(elem.car_kilometraje)];

                    total_car_driving_hours += elem.car_driving_hours;
                    total_car_kilometraje += elem.car_kilometraje;

                    chart_car_driving_hours.push(temp_car_driving_hours);
                    chart_car_kilometraje.push(temp_car_kilometraje);
                });

                $.each(respuesta, function(idx, elem) {
                    car_ids += elem.car_id + ",";
                });

                //END LOAD JSON
                $("#report").css("display", "block");


                //Datos del mes pasado
                var params_p = "&mes_pasado=1&car_path=" + car_path;
                peticion("generar", "generarReporte", params_p, "").done(function(response_pasado) {
                    var codigo_pasado = response_pasado.resultado;
                    var respuesta_pasado = response_pasado.datos["datos"];
                    var rf_pasado = response_pasado.datos["r_f"];
                    var total_data_pasado = 0;

                    var total_car_driving_hours_pasado = 0;
                    var total_car_kilometraje_pasado = 0;

                    if (codigo_pasado == "Error") {
                        $("#mensaje_aviso").html("");
                        $("#mensaje_aviso").append("No se encontraron datos del mes pasado");
                        animacionAviso("mensaje_aviso");
                    } else {
                        total_data_pasado = respuesta_pasado.length;

                        $.each(respuesta_pasado, function(idx, elem) {
                            total_car_driving_hours_pasado += elem.car_driving_hours;
                            total_car_kilometraje_pasado += elem.car_kilometraje;
                        });

                        $.each(respuesta_pasado, function(idx, elem) {
                            car_ids_pasado += elem.car_id + ",";
                        });
                    }

                    //Charts
                    var seriesColors;
                    var purpleColor = ["#6e3a8a"];

                    var TPM = (total_car_driving_hours / total_data / RF);
                    var TPM_P = (total_car_driving_hours_pasado / total_data_pasado / rf_pasado);
                    seriesColors = colorGraficas(TPM, TPM_P);
                    chart("chart_horas", chart_car_driving_hours, "Horas de manejo por día promedio", TPM, seriesColors);
                    console.log(chart_car_driving_hours);
                    console.log(TPM);
                    var numero_grafica = "chart_horas";
                    dona_nueva(numero_grafica, chart_car_driving_hours, "Horas de manejo por día", "Promedio", parseFloat(Math.round(TPM * 100) / 100).toFixed(3), seriesColors);


                    var KMP = (total_car_kilometraje / total_data / RF);
                    var KMP_P = (total_car_kilometraje_pasado / total_data_pasado / rf_pasado);
                    seriesColors = colorGraficas(KMP, KMP_P);
                    chart("chart_kilometraje", chart_car_kilometraje, "Kms de manejo por día promedio", KMP, seriesColors);
                    console.log(chart_car_kilometraje);
                    var numero_grafica = "chart_kilometraje";
                    console.log(KMP);
                    dona_nueva(numero_grafica, chart_car_kilometraje, "Kms de manejo por día", "Promedio", parseFloat(Math.round(KMP * 100) / 100).toFixed(3), seriesColors);
                    //FIN: Charts

                    //Dashboard de seguridad
                    car_ids = car_ids.substring(0, car_ids.length - 1);
                    var params_volumen = param + "&id_carros=" + car_ids;

                    peticion("generar", "informacionParaDashboardSeguridad", params_volumen, "").done(function(response) {
                        if (response["resultado"] == "OK") {
                            //Gráfica por kilometros y horas de manejo
                            var sumatorias = response["datos"].sumatorias;
                            var data_horas = [
                                ["0 am a 6 am", roundToTwo(parseFloat(sumatorias[1].horas))],
                                ["6 am a 11 am", roundToTwo(parseFloat(sumatorias[2].horas))],
                                ["11 am a 2 pm", roundToTwo(parseFloat(sumatorias[3].horas))],
                                ["2 pm a 6 pm", roundToTwo(parseFloat(sumatorias[4].horas))],
                                ["6 pm a 0 am", roundToTwo(parseFloat(sumatorias[5].horas))]
                            ];
                            var data_kilometros = [
                                ["0 am a 6 am", roundToTwo(parseFloat(sumatorias[1].kilometros))],
                                ["6 am a 11 am", roundToTwo(parseFloat(sumatorias[2].kilometros))],
                                ["11 am a 2 pm", roundToTwo(parseFloat(sumatorias[3].kilometros))],
                                ["2 pm a 6 pm", roundToTwo(parseFloat(sumatorias[4].kilometros))],
                                ["6 pm a 0 am", roundToTwo(parseFloat(sumatorias[5].kilometros))]
                            ];

                            var seriesColors = ["#FFFF00", "#FFBF00", "#848484", "#151515", "#993399"];
                            var result = $.jqplot("chart_manejo_horas", [data_horas], {
                                seriesDefaults: {
                                    renderer: $.jqplot.DonutRenderer,
                                    rendererOptions: {
                                        sliceMargin: 3,
                                        startAngle: -90,
                                        showDataLabels: true,
                                        dataLabels: 'percent',
                                        dataLabelNudge: 25,
                                        thickness: 22,
                                        diameter: 168,
                                        shadow: false
                                    }
                                },
                                seriesColors: seriesColors,
                                grid: {
                                    background: '#ffffff', // CSS color spec for background color of grid.
                                    shadow: false, // draw a shadow for grid.
                                    borderWidth: 0,
                                },
                            });
                            $('<div class="chart_total">Manejo en<br>Horas</div>').insertAfter('#chart_manejo_horas > .jqplot-grid-canvas');
                            $("#chart_manejo_horas > .chart_total").addClass("titulo_enmedio");

                            var result = $.jqplot("chart_manejo_kilometros", [data_kilometros], {
                                seriesDefaults: {
                                    renderer: $.jqplot.DonutRenderer,
                                    rendererOptions: {
                                        sliceMargin: 3,
                                        startAngle: -90,
                                        showDataLabels: true,
                                        dataLabels: 'percent',
                                        dataLabelNudge: 25,
                                        thickness: 22,
                                        diameter: 168,
                                        shadow: false
                                    }
                                },
                                seriesColors: seriesColors,
                                grid: {
                                    background: '#ffffff', // CSS color spec for background color of grid.
                                    shadow: false, // draw a shadow for grid.
                                    borderWidth: 0,
                                },
                            });
                            $('<div class="chart_total">Manejo en<br>Kilometros</div>').insertAfter('#chart_manejo_kilometros > .jqplot-grid-canvas');
                            $("#chart_manejo_kilometros > .chart_total").addClass("titulo_enmedio");

                            //Velocidades por rango
                            $.each(sumatorias, function(index, value) {
                                if (index > 0) {
                                    var velocidad_rango = roundToTwo(this.kilometros / this.horas);
                                    $("#box_velocidad_rango_" + index).text(velocidad_rango + " km/hr");
                                }
                            });
                            //FIN: Gráfica por kilometros y horas de manejo

                            //Gráfica alarmas
                            var alarmas = response["datos"].alarmas;
                            var total_alarmas = parseInt(alarmas["conteo"]);
                            var data_alarmas = [
                                ["Velocidad", parseInt(alarmas["speeding"])],
                                ["Aceleración", parseInt(alarmas["acceleration"])],
                                ["Frenado", parseInt(alarmas["braking"])],
                                ["RPM", parseInt(alarmas["rpm"])]
                            ];

                            var seriesColors = ["#848484", "#FFFF00", "#D66B66", "#993399"];

                            var result = $.jqplot("chart_alarmas", [data_alarmas], {
                                seriesDefaults: {
                                    renderer: $.jqplot.DonutRenderer,
                                    rendererOptions: {
                                        sliceMargin: 0,
                                        startAngle: -90,
                                        showDataLabels: true,
                                        dataLabels: 'percent',
                                        thickness: 22,
                                        diameter: 168,
                                        shadow: false,
                                        dataLabelNudge: 30
                                    }
                                },
                                seriesColors: seriesColors,
                                grid: {
                                    background: '#ffffff', // CSS color spec for background color of grid.
                                    shadow: false, // draw a shadow for grid.
                                    borderWidth: 0,
                                },
                                legend: {
                                    show: true,
                                    placement: 'outside',
                                    rendererOptions: {
                                        numberRows: 1
                                    },
                                    location: 's',
                                    marginTop: '30px'
                                }
                            });
                            $('<div class="chart_total">Alarmas</div>').insertAfter('#chart_alarmas > .jqplot-grid-canvas');
                            $("#chart_alarmas > .chart_total").addClass("titulo_enmedio");
                            //FIN: Gráfica alarmas
                        } else {
                            $("#mensaje_aviso").html("");
                            $("#mensaje_aviso").append(response["datos"].mensaje);
                            animacionAviso("mensaje_aviso");
                        }

                        //Grafica eventos agresivos, alarmas mes pasado
                        peticion("generar", "informacionParaDashboardSeguridad", params_volumen + "&mes_pasado=1", "").done(function(response_pasado) {
                            var total_alarmas_pasado = 0;
                            if (response_pasado["resultado"] == "OK") {
                                var alarmas = response_pasado["datos"].alarmas;
                                total_alarmas_pasado = parseInt(alarmas["conteo"]);
                            }

                            var eventos_agresivos = total_alarmas / total_car_kilometraje;
                            var eventos_agresivos_pasado = total_alarmas_pasado / total_car_kilometraje_pasado

                            seriesColors = colorGraficas(eventos_agresivos, eventos_agresivos_pasado);
                            chart("chart_agresivos", data_alarmas, "Eventos agresivos por km recorrido", eventos_agresivos, seriesColors);
                            console.log(data_alarmas);
                            var numero_grafica = "chart_agresivos";
                            console.log(eventos_agresivos);
                            dona_nueva(numero_grafica, data_alarmas, "Eventos agresivos por", "Km recorrido", parseFloat(Math.round(eventos_agresivos * 100) / 100).toFixed(3), seriesColors);

                        });
                        //FIN: Grafica eventos agresivos


                        //Para datos de cluster
                        var redColor = ["#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99"];
                        var greenColor = ["#2d8838", "#84cd8d", "#32ab41", "#addeb3", "#5bbd67"];
                        var yellowColor = ["#c69600", "#ffd75b", "#ecb300", "#ffe491", "#ffca25"];
                        var purpleColor = ["#6e3a8a", "#b68bce", "#8346a5", "#cfb2df", "#9e64be"];
                        var seriesColors = purpleColor;
                        peticion("generar", "informacionDashboardRiesgos", param, "").done(function(response) {
                            //Grafica cluster
                            var total_coordenadas = response.datos["total_coordenadas"];
                            var total_viajes_con_coordenadas_fin = 0;
                            var total_viajes_en_cluster = 0;
                            $.each(total_coordenadas, function(key, value) {
                                total_viajes_con_coordenadas_fin += value.total;
                                total_viajes_en_cluster += value.en_cluster
                            });
                            var porcentaje_total_cluster = roundToTwo((total_viajes_en_cluster / total_viajes_con_coordenadas_fin) * 100);

                            var data_cluster = [];
                            $.each(total_coordenadas, function(key, value) {
                                var porcentaje_cluster = roundToTwo((value.en_cluster / value.total) * 100);
                                data_cluster.push([key, porcentaje_cluster]);
                            });

                            if (porcentaje_total_cluster > 70)
                                seriesColors = greenColor;
                            else if (porcentaje_total_cluster >= 50 && porcentaje_total_cluster <= 70)
                                seriesColors = yellowColor;
                            else if (porcentaje_total_cluster < 50)
                                seriesColors = redColor;

                            chart("chart_cluster", data_cluster, "Porcentaje de Cluster", porcentaje_total_cluster, seriesColors);
                            console.log(data_cluster);
                            var numero_grafica = "chart_cluster";
                            console.log(seriesColors);
                            dona_nueva(numero_grafica, data_cluster, "Porcentaje de Cluster", "", parseFloat(Math.round(porcentaje_total_cluster * 100) / 100).toFixed(3), seriesColors);

                            //FIN: Grafica cluster  

                            //Grafica riesgo
                            var periodos = response.datos["periodos"];
                            var probabilidad_sumada = 0;
                            var data_riesgo = [];
                            $.each(periodos, function(key, value) {
                                var probabilidad_horario = probabilidadHorario(key);

                                var porcentaje_cluster = roundToTwo((total_coordenadas[key].en_cluster / total_coordenadas[key].total) * 100);
                                var probabilidad_cluster = probabilidadCluster(porcentaje_cluster);

                                var porcentaje_eventos_agresivos = roundToTwo((value.conteo_alarmas / value.km_manejo) * 100);
                                var probabilidad_aggressive = probabilidadAggressive(porcentaje_eventos_agresivos);

                                var total_probabilidad = probabilidad_horario + probabilidad_cluster + probabilidad_aggressive;
                                probabilidad_sumada += total_probabilidad;
                                data_riesgo.push([key, total_probabilidad]);
                            });

                            var promedio_probabilidad = roundToTwo(probabilidad_sumada / 5);
                            if (promedio_probabilidad > 15)
                                seriesColors = redColor;
                            else if (promedio_probabilidad >= 8 && promedio_probabilidad <= 15)
                                seriesColors = yellowColor;
                            else if (promedio_probabilidad < 8)
                                seriesColors = greenColor;

                            chart("chart_riesgos", data_riesgo, "Porcentaje Promedio de Riesgo", promedio_probabilidad, seriesColors);
                            console.log(data_riesgo);
                            var numero_grafica = "chart_riesgos";
                            console.log(seriesColors);
                            dona_nueva(numero_grafica, data_riesgo, "Porcentaje Promedio de", "Riesgo", parseFloat(Math.round(promedio_probabilidad * 100) / 100).toFixed(3), seriesColors);

                            //FIN: Grafica riesgo
                        });
                    });
                    //FIN: Dashboard de seguridad
                });
                //FIN: Datos del mes pasado
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

    var chart_total = numberWithCommas(roundToTwo(total));
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

} // dona_nueva

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

function colorGraficas(dato, promedio) {
    var MS = promedio * 0.03; //Margen Superior
    var MI = promedio * 0.03; //Margen Inferior

    //Var
    //Define the seriesColors array...
    var redColor = ["#8C0600", "#D66B66", "#BB0800", "#C93933", "#E49C99"];
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
    if (eventos > 0 && eventos <= 5)
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
//-------------------------------------