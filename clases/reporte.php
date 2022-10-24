<html>
<body>
    <?php
    $URL = "http://www.onclouddiagnostics.com:80/api/login.json";
    $credenciales = "mauro:masterl33t";


    $headers = array("Authorization: Basic " . base64_encode($credenciales));
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $URL);
    curl_setopt($ch, CURLOPT_TIMEOUT, 60); //timeout after 30 seconds
    curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
    $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);   //get status code
    $result=curl_exec ($ch);
    curl_close ($ch);
    
    error_reporting(E_ERROR | E_WARNING | E_PARSE);

    include_once("class_reporte.php");
    
    
    
    //$credenciales = "bWF1cm86bWFzdGVybDMzdA==";

    /*

    $reporte = new reporte($credenciales, $sitio);

    $params = array();

    $params["start_year"] = 2015;
    $params["start_month"] = 01;
    $params["start_day"] = 01;
    $params["start_hour"] = 12;
    $params["start_minute"] = 00;
    $params["start_second"] = 00;
    $params["end_year"] = 2015;
    $params["end_month"] = 8;
    $params["end_day"] = 01;
    $params["end_hour"] = 12;
    $params["end_minute"] = 00;
    $params["end_second"] = 00;

    $reporte -> set_trips($params);
    $reporte -> set_safety($params);
    $reporte -> set_eco($params);

    */

    //$reporte -> APIPetition($URL)
    

    echo "<pre>";
    print_r($result);
    echo "</pre>";
    ?>
    </body>
</html>