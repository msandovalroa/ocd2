<script>

	$(document).ready(function() {
        
        var reservaciones = peticion("salas","lista_reservaciones","","");
		$('#calendar').fullCalendar({
            lang:'es',    
            height: 'auto',
            defaultView: 'agendaWeek',
            allDaySlot: false,
            axisFormat: 'h(:mm)a',
            minTime: '07:00:00',
            maxTime: '23:00:00',
            columnFormat: 'dddd',
            header: false,
            scrollTime: '23:00:00',
            
			defaultDate: '2015-07-21',
			editable: true,
			eventLimit: true, // allow "more" link when too many events
            
            eventRender: function (event, element) {
                //Hidden
                element.attr('href', 'javascript:void(0);');
                element.click(function() {
                    $("#fecha_evento").html(moment(event.start).format('dddd DD [de] MMMM'));
                    $("#startTime").html(moment(event.start).format('MMM Do h:mm A'));
                    $("#endTime").html(moment(event.end).format('MMM Do h:mm A'));
                    $("#eventInfo").html(event.description);
                    $("#eventLink").attr('href', event.url);
                    $("#eventContent").css("display","block");
                });

            },
		});
        
        reservaciones.done(function(respuesta){
            $('#calendar').fullCalendar({
                events : respuesta
            });
        });
	});

</script>

<div id="contenido">
        <div id="titulo">
            RESERVACIÓN DE SALA DE JUNTAS
        </div>
        
        <div id="semana">
            <div id="semana_ant"><span>&lt;</span> Semana ant.</div>
            <div id="esta_semana">SEMANA Julio X-Julio X</div>
            <div id="semana_sig">sig. semana <span>&gt;</span></div>
        </div>

        <div id='calendar'></div>

        <div id="eventContent" title="Detalles de Evento">
            <form id="forma_evento">
                <div id="fecha_evento"></div>
                <div id="contenido_evento">
                    <div class="elemento_evento">
                        <span>Nombre de la Junta</span> 
                        <input type="text" name="firstname">
                    </div>
                    <div class="elemento_evento">
                        <span>Sala</span> 
                        <select name="salas">
                            <option value="sala1">Sala 1</option>
                            <option value="sala2">Sala 2</option>
                            <option value="sala3">Sala 3</option>
                            <option value="sala4">Sala 4</option>
                        </select>
                    </div>    
                    <div class="elemento_evento">
                        <span>Hora de inicio</span>
                        <select name="hora_inicio" id="hora_inicio">
                            <option value="8">8 am</option>
                            <option value="9">9 am</option>
                            <option value="10">10 am</option>
                            <option value="11">11 am</option>
                            <option value="12">12 pm</option>
                            <option value="13">1 pm</option>
                        </select>
                        <span>Hora de termino</span>
                        <select name="hora_fin" id="hora_fin">
                            <option value="8">8 am</option>
                            <option value="9">9 am</option>
                            <option value="10">10 am</option>
                            <option value="11">11 am</option>
                            <option value="12">12 pm</option>
                            <option value="13">1 pm</option>
                        </select>
                    </div>
                    <div class="elemento_evento">
                        <span>Descripción</span>
                        <textarea name="descripcion"></textarea>
                    </div>
                    <div class="elemento_evento">
                        <span>Extras</span>
                        <textarea name="extras" id="extras"></textarea>
                    </div>
                    <div class="elemento_evento">
                        <span>Otros</span>
                        <textarea name="otros" id="otros"></textarea>
                    </div>

                    <div class="elemento_evento">
                        <input type="button" onclick="myFunction()" value="RESERVAR" id="boton_reservar">
                    </div>
                    <!-- 
                    Start: <span id="startTime"></span><br>
                    End: <span id="endTime"></span><br><br>
                    <p id="eventInfo"></p>
                    <p><strong><a id="eventLink" href="" target="_blank">Read More</a></strong></p>-->
                </div>
            </form>
        </div>
    </div>