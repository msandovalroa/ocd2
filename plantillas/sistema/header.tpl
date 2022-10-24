<!DOCTYPE html>
<!--
    __     __ __  __            _____   _    _   ____   _    _   _____  ______ __   
   / /    / /|  \/  |    /\    |  __ \ | |  | | / __ \ | |  | | / ____||  ____|\ \  
  / /    / / | \  / |   /  \   | |  | || |__| || |  | || |  | || (___  | |__    \ \ 
 < <    / /  | |\/| |  / /\ \  | |  | ||  __  || |  | || |  | | \___ \ |  __|    > >
  \ \  / /   | |  | | / ____ \ | |__| || |  | || |__| || |__| | ____) || |____  / / 
   \_\/_/    |_|  |_|/_/    \_\|_____/ |_|  |_| \____/  \____/ |_____/ |______|/_/  
-->
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
        <title>OCD - Activity Dashboard</title>
        <!--Tags basicos para SEO-->
        <meta name="description" content="OCD System Activity Dashboard">
        <meta name="keywords" content="OCD, OCD2, ACTIVITY, DASHBOARD, ACTIVIDAD, REPORTE">
        <meta name="author" content="Daniel Garnier París, Samuel Morales Bender, Mario Sandoval Roa, Samuel Clemente Montes">
        <meta name="copyright" CONTENT="OCD">
        
        <!--control de cache-->
        <meta name-equiv="CACHE-CONTROL" CONTENT="NO-CACHE">
        <meta name-equiv="PRAGMA" CONTENT="NO-CACHE">
    
        <!--Robots-->
        <meta name="ROBOTS" CONTENT="NONE">
        <meta name="GOOGLEBOT" CONTENT="NOARCHIVE">
        
        <!-- CSS -->
        <link rel="stylesheet" type="text/css" media="screen" href="css/fancybox/jquery.fancybox.css"/>
        <link rel="stylesheet" type="text/css" href="css/jquery.jqplot.css" />
        <link rel="stylesheet" media="all" type="text/css" href="http://code.jquery.com/ui/1.11.0/themes/smoothness/jquery-ui.css" />
        <link rel="stylesheet" media="all" type="text/css" href="css/jquery-ui-timepicker-addon.css" />
        <link type="text/css" rel="stylesheet" href="css/style.css" />
        <link type="text/css" rel="stylesheet" href="css/estilos_menu.css" />        
        
        <!-- JS -->
        
            <!-- jQuery -->

            <script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"></script>
            <script language="javascript" type="text/javascript" src="js/jqplot/jquery.jqplot.min.js?v=1.0"></script>
            <script type="text/javascript" src="http://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>

            <!-- Plugins -->
            <script type="text/javascript" src="js/jquery-ui-timepicker-addon.js?v=1.0"></script>
            <script type="text/javascript" src="js/jquery-ui-timepicker-es.js?v=1.0"></script>
            <script type="text/javascript" src="js/jquery-ui-sliderAccess.js?v=1.0"></script>
            <script type="text/javascript" src="js/jquery.base64.min.js?v=1.0"></script>
            <script type="text/javascript" src="https://sellfy.com/js/api_buttons.js"></script>
            <!--[if lt IE 9]>
                <script language="javascript" type="text/javascript" src="js/excanvas.js?v=1.0"></script>
            <![endif]-->
            <script type="text/javascript" src="js/fancybox/jquery.fancybox.pack.js?v=1.0"></script>
            <!-- jqPlot -->

            <script language="javascript" type="text/javascript" src="js/jqplot/jqplot.pieRenderer.min.js?v=1.0"></script>
            <script language="javascript" type="text/javascript" src="js/jqplot/jqplot.donutRenderer.min.js?v=1.0"></script>
            <script type="text/javascript" src="js/jqplot/plugins/jqplot.canvasTextRenderer.min.js?v=1.0"></script>
			<script type="text/javascript" src="js/jqplot/plugins/jqplot.canvasAxisLabelRenderer.min.js?v=1.0"></script>
			<script type="text/javascript" src="js/jqplot/plugins/jqplot.highlighter.min.js?v=1.0"></script>

            <!-- Custom JS -->
            <script type="text/javascript" src='js/funciones_menu.js?v=1.0'></script>
            <script type="text/javascript" src='js/moment/moment.js?v=1.0'></script>
            <script type="text/javascript" src='js/peticion.js?v=1.0'></script>
            <script>
			    var time_offset = '{$time_offset}';
			</script>

            <!-- jqwidgets -->
    <script type="text/javascript" src="js/jqwidgets/jqxcore.js"></script>
    <script type="text/javascript" src="js/jqwidgets/jqxdraw.js"></script>
    <script type="text/javascript" src="js/jqwidgets/jqxchart.core.js"></script>
    <script type="text/javascript" src="js/jqwidgets/jqxdata.js"></script>

    </head>
    <body>
        <div id="header">
            <img src="img/assets/logo_ocd_header.png">
            <a href="logout.php">
                <div style="background-image:url(img/assets/i_logout.png); background-repeat:no-repeat; background-position:right; padding-right:18px; float: right; width: 190px;">
                    SALIR DEL SISTEMA
                </div>
            </a>
        </div>
        <div id="mensaje_aviso"></div>
        
{if $loggedin }
    {include file="menu.tpl"}
{/if}
