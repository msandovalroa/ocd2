<link rel="stylesheet" href="js/jqwidgets/styles/jqx.base.css" type="text/css" />
<script type="text/javascript" src="js/jqwidgets/jqxdraw.js"></script>
<script type="text/javascript" src="js/jqwidgets/jqxbuttons.js"></script>
<script type="text/javascript" src="js/jqwidgets/jqxscrollbar.js"></script>
<script type="text/javascript" src="js/jqwidgets/jqxlistbox.js"></script>
<script type="text/javascript" src="js/jqwidgets/jqxdropdownlist.js"></script>
<script type="text/javascript" src="js/jqwidgets/jqxmenu.js"></script>
<script type="text/javascript" src="js/jqwidgets/jqxgrid.js"></script>
<script type="text/javascript" src="js/jqwidgets/jqxgrid.grouping.js"></script>
<script type="text/javascript" src="js/jqwidgets/jqxgrid.selection.js"></script>  
<script type="text/javascript" src="js/jqwidgets/jqxgrid.pager.js"></script> 
<script type="text/javascript" src="js/jqwidgets/jqxgrid.filter.js"></script>
<script type="text/javascript" src="js/jqwidgets/jqxgrid.sort.js"></script>
<script type="text/javascript" src="js/jqwidgets/jqxgrid.edit.js"></script> 
<script type="text/javascript" src="js/jqwidgets/jqxwindow.js"></script>
<script type="text/javascript" src="js/jqwidgets/jqxcheckbox.js"></script>
<script type="text/javascript" src="js/jqwidgets/jqxinput.js"></script>
<script type="text/javascript" src="js/jqwidgets/jqxtextarea.js"></script>
<script type="text/javascript" src="js/jqwidgets/jqxcalendar.js"></script>
<script type="text/javascript" src="js/jqwidgets/jqxgrid.columnsresize.js"></script> 
<script type="text/javascript" src="js/jqwidgets/jqxpanel.js"></script>
<script type="text/javascript" src="js/jqwidgets/jqxcalendar.js"></script>
<script type="text/javascript" src="js/jqwidgets/jqxdatetimeinput.js"></script>
<script type="text/javascript" src="js/jqwidgets/jqxfileupload.js"></script>
<script type="text/javascript" src="js/jqwidgets/jqxchart.core.js"></script>
<script type="text/javascript" src="js/jqwidgets/jqxcombobox.js"></script>

    <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD5As_I0X49H6RbHss-R2fg_nIiqMq0_Io&callback=initMap">
    </script>
   
    <script src="js/jquery/jquery-ui.custom.js" type="text/javascript"></script>
    <script src="js/jquery/jquery.cookie.js" type="text/javascript"></script>

    <link href="css/ui.dynatree.css" rel="stylesheet" type="text/css">
    <script src="js/jquery/jquery.dynatree.js" type="text/javascript"></script>

    <script type="text/javascript" src="js/rastreo.js"></script>

    <script type="text/javascript" src="js/jqwidgets/jqxtabs.js"></script>
    <script type="text/javascript">
        $(document).ready(function () {
            // create jqxtabs.
            $('#jqxtabs').jqxTabs({ width: "100%", height: "40%" });
        });
       
    </script>


    


<!-- END Vars -->

<div id="loading">
    <img src="img/loading.gif"><br>
    <span>Espere por favor, la operación puede tardar algunos minutos.</span>
</div>  
  <div id="content">
    <div id="title">RASTREO</div>
</div>
<input type="hidden" id="car_path" name="car_path" value='{$car_path}' />
<input type="hidden" id="id_usuario" name="id_usuario" value='{$id_usuario}' />
<input type="hidden" id="time_offset" name="time_offset" value='{$time_offset}' />

<!--<div id="combo_grupo"></div>-->


<div id="map"></div>
  <div id='tree' style="width: 300px;height: 480px;overflow: auto;position: relative;"'></div>
   <div id="echoSelection3"></div>


    <div id='jqxtabs'>
        <ul>
            <li>Listas</li>
            <li>Alertas</li>
            <li>TCS</li>
        </ul>
        <div>
           <div id='jqxWidget'>
        <div id="jqxWidget"></div>
    </div>
        </div>
        <div id='jqxWidget_alerta'>
        <div id="jqxWidget_alerta"></div>
    </div>
        <div>
            Content 3
        </div>
    </div>

   

  



