<?php

/**
* Clase reporte
* Clase para generación de reportes OCD
*
* @version 1.0
*/
set_time_limit(0);
error_reporting(0);

class reporte {
    
    //Variables
    private $credenciales = 'user:password';
    private $sitio = 'http://ip:port/api/';
    //private $group_id = 1256;
    private $group_name = '';
    public $cars = array();
/**
* Constructor de la clase
*
* @version 1.0
*/
    function __construct($credenciales, $sitio) {
        //$this->credenciales = base64_encode($credenciales);
        $this->credenciales = $credenciales;
        $this->sitio = $sitio;
        $this->set_group_id();
        $this->set_cars();
    } //function __construct

/**
* Destructor de la clase
*
* @version 1.0
*/
    function __destruct() {
        //parent::__destruct();
    } //function __destruct

    public function APIPetition($URL){        
        $headers = array("Authorization: Basic " . $this->credenciales);
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,$URL);
        curl_setopt($ch, CURLOPT_TIMEOUT, 60); //timeout after 30 seconds
        curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
        $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);   //get status code
        $result=curl_exec ($ch);
        curl_close ($ch);
        
        return $result;
    } //function APIPetition
    
    function multiAPIPetition($URLArray, &$res, $custom_options = null) {
        
        // make sure the rolling window isn't greater than the # of urls
        $rolling_window = 5;
        $rolling_window = (sizeof($URLArray) < $rolling_window) ? sizeof($URLArray) : $rolling_window;

        $master = curl_multi_init();
        $curl_arr = array();
        
        $headers = array("Authorization: Basic " . $this->credenciales);

        // add additional curl options here
        $std_options = array(CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_MAXREDIRS => 5);
        $options = ($custom_options) ? ($std_options + $custom_options) : $std_options;

        // start the first batch of requests
        for ($i = 0; $i < $rolling_window; $i++) {
            $ch = curl_init();
            $options[CURLOPT_URL] = $URLArray[$i];
            curl_setopt_array($ch,$options);
            curl_multi_add_handle($master, $ch);
        }

        do {
            while(($execrun = curl_multi_exec($master, $running)) == CURLM_CALL_MULTI_PERFORM);
            if($execrun != CURLM_OK){
                //echo "CURLM_OK?";
                break;
            }
            // a request was just completed -- find out which one
            while($done = curl_multi_info_read($master)) {
                $info = curl_getinfo($done['handle']);
                if ($info['http_code'] == 200)  {
                    $output = curl_multi_getcontent($done['handle']);
                    // request successful.  process output using the callback function.
                    $res1 = array();
                    
                    $this->multi_decode_JSON($output, $res1);
                    array_push($res, $res1);

                    // start a new request (it's important to do this before removing the old one)
                    $ch = curl_init();
                    $options[CURLOPT_URL] = $URLArray[$i++];  // increment i
                    curl_setopt_array($ch,$options);
                    curl_multi_add_handle($master, $ch);

                    // remove the curl handle that just completed
                    curl_multi_remove_handle($master, $done['handle']);
                } else {
                    //echo $info['http_code'];
                    // request failed.  add error handling.
                }
            }
        } while ($running);

        curl_multi_close($master);
        return true;
    }
    
    public function decode_JSON($URL){
        //Strip this "new Date()" function from JSON.
        $json = strtr($this->APIPetition($URL), array('new Date(' => '', ')' => ''));
        return json_decode($json, true);
    }//function decode_JSON
    
    public function multi_decode_JSON($json, &$res){
        //Strip this "new Date()" function from JSON.        
        $json = strtr($json, array('new Date(' => '', ')' => ''));
        $res = json_decode($json, true);
        return true;
    }//function decode_JSON
    
    private function set_group_id(){
        $URL = $this->sitio.'login.json';
        $array = $this->decode_JSON($URL);
        
        if (array_key_exists("group_id", $array)) {
            $this->group_id = $array["group_id"];
        }
        //CHINA
        if (array_key_exists("group_name", $array)) {
            $this->group_name = $array["group_name"];
        } 
    }//function set_group_id()
    
    public function get_group_id(){
        return $this->group_id;
    }
    
    private function set_cars(){
        $URL = $this->sitio.'cars/'.$this->group_id.'.json';
        $array = $this->decode_JSON($URL);
        
        foreach ( $array as $key => $avalue ) {
            $car = array();
            
            //TODO: Checar si el rendimiento es correcto
            foreach ( $avalue as $key => $value ) {
                if($key == "car_id"){
                    $car[$key] = $value;
                }
                if($key == "vehicle_no"){
                    $car[$key] = $value;
                }
                //CHINA
                if($key == "group_id"){
                    $car[$key] = $value;
                }
                else{
                    $car['group_id'] = $this->group_id;
                }
                
                //echo "key: ".$key . " value:". $value."<br>";
            }  
            
            array_push($this->cars,$car);
        }
        
    }//function set_cars()
    
    public function set_trips($params){
        
            $start_year = $params["start_year"];
            $start_month = $params["start_month"];
            $start_day = $params["start_day"];
            $start_hour = $params["start_hour"];
            $start_minute = $params["start_minute"];
            $start_second = $params["start_second"];
            $end_year = $params["end_year"];
            $end_month = $params["end_month"];
            $end_day = $params["end_day"];
            $end_hour = $params["end_hour"];
            $end_minute = $params["end_minute"];
            $end_second = $params["end_second"];
        
        $URLArray = array();
        foreach ( $this->cars as $key => $avalue ) {
            
            $URL = $this->sitio.'trips/'.$start_year.'/'.$start_month.'/'.$start_day.'/'.$start_hour.'/'.$start_minute.'/'.$start_second;
            $URL .= '/'.$end_year.'/'.$end_month.'/'.$end_day.'/'.$end_hour.'/'.$end_minute.'/'.$end_second.'/'.$avalue['car_id'].'.json';
            
            
            array_push($URLArray, $URL);
            //$URLArray[$avalue['car_id']] = $URL;
        }    
        
        $res = array();
        $this->multiAPIPetition($URLArray, $res);
        foreach($res as $carkey => $cartrips){
            $fuel_consumption = 0;
            $fuel_cost = 0;
            $mileage = 0;
            $driving_time = 0;

            foreach($cartrips as $tripkey => $trip){
                if (array_key_exists("fuel_consumption", $trip)) {
                    $fuel_consumption += $trip['fuel_consumption'];
                } 
                if (array_key_exists("fuel_cost", $trip)) {
                    $fuel_cost += $trip['fuel_cost'];
                }
                if (array_key_exists("mileage", $trip)) {
                    $mileage += $trip['mileage'];
                }
                if (array_key_exists("start_time", $trip)) {
                    $driving_time += $trip['end_time'] - $trip['start_time'];
                }
            }

            $this->cars[$carkey]['no_trips'] = count($cartrips);
            $this->cars[$carkey]['fuel_consumption'] = $fuel_consumption;
            $this->cars[$carkey]['fuel_cost'] = $fuel_cost;
            $this->cars[$carkey]['mileage'] = $mileage;
            $this->cars[$carkey]['driving_time'] = ($driving_time / 3600000);
        }       
    } //function set_trips()
    
    public function set_eco($params){
        
            $start_year = $params["start_year"];
            $start_month = $params["start_month"];
            $start_day = $params["start_day"];
            $start_hour = $params["start_hour"];
            $start_minute = $params["start_minute"];
            $start_second = $params["start_second"];
            $end_year = $params["end_year"];
            $end_month = $params["end_month"];
            $end_day = $params["end_day"];
            $end_hour = $params["end_hour"];
            $end_minute = $params["end_minute"];
            $end_second = $params["end_second"];
        
        $URLArray = array();
        foreach ( $this->cars as $key => $avalue ) {
            
            $URL = $this->sitio.'economydriving/'.$start_year.'/'.$start_month.'/'.$start_day.'/'.$start_hour.'/'.$start_minute.'/'.$start_second;
            $URL .= '/'.$end_year.'/'.$end_month.'/'.$end_day.'/'.$end_hour.'/'.$end_minute.'/'.$end_second.'/'.$avalue['car_id'].'.json';
            
            array_push($URLArray, $URL);
            //$URLArray[$avalue['car_id']] = $URL;
        }    
        
        $res = array();
        $this->multiAPIPetition($URLArray, $res);
        
        foreach($res as $carkey => $careco){
            $score = 0;

            foreach($careco as $ecokey => $eco){
                if (array_key_exists("score", $eco)) {
                    $score += $eco['score'];
                }                   
            }

            $this->cars[$carkey]['operating_days'] = count($careco);
            if(count($careco) != 0){
                $this->cars[$carkey]['eco_score'] = $score / count($careco);
            }
            
        }       
    }//set_eco
    
        public function set_safety($params){
            
            $start_year = $params["start_year"];
            $start_month = $params["start_month"];
            $start_day = $params["start_day"];
            $start_hour = $params["start_hour"];
            $start_minute = $params["start_minute"];
            $start_second = $params["start_second"];
            $end_year = $params["end_year"];
            $end_month = $params["end_month"];
            $end_day = $params["end_day"];
            $end_hour = $params["end_hour"];
            $end_minute = $params["end_minute"];
            $end_second = $params["end_second"];
        
        $URLArray = array();
        foreach ( $this->cars as $key => $avalue ) {
            
            $URL = $this->sitio.'safedriving/'.$start_year.'/'.$start_month.'/'.$start_day.'/'.$start_hour.'/'.$start_minute.'/'.$start_second;
            $URL .= '/'.$end_year.'/'.$end_month.'/'.$end_day.'/'.$end_hour.'/'.$end_minute.'/'.$end_second.'/'.$avalue['car_id'].'.json';
            
            array_push($URLArray, $URL);
        }    
        
        $res = array();
        $this->multiAPIPetition($URLArray, $res);
        
        foreach($res as $carkey => $carsafety){
            $score = 0;

            foreach($carsafety as $safetykey => $safety){
                if (array_key_exists("score", $safety)) {
                    $score += $safety['score'];
                }                   
            }

            $this->cars[$carkey]['operating_days'] = count($carsafety);
            if(count($carsafety) != 0){
                $this->cars[$carkey]['safety_score'] = $score / count($carsafety);
            }
        }       
    }//set_safety
    
}// fin de clase reporte
?>