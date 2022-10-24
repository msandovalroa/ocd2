<?php

/**
* Clase reporte
* Clase para generación de reportes OCD
*
* @version 1.0
* @copyright Madhouse
*/
set_time_limit(0);

/*
include_once("class_reporte.php");
*/

include_once("ocdsession.php");
include_once("config.inc.php");
include_once(common.'database.php');

class generar extends database {
    
    
/**
* Constructor de la clase
*
* @version 1.0
*/
    function __construct() {
        parent::__construct();
    } //function __construct

/**
* Destructor de la clase; asegura el cierre de las conexiones de base de datos utilizadas
*
* @version 1.0
*/
    function __destruct() {
        parent::__destruct();
    } //function __destruct
    
// GENERAR REPORTE
    
    function generarReporte($params){
        //Para mes pasado
        if(isset($params["mes_pasado"]) && $params["mes_pasado"] == 1){
        	/*$start_year = date("Y", strtotime("first day of last month"));
			$start_month = date("m", strtotime("first day of last month"));
	        $start_day = date("d", strtotime("first day of last month"));
	        $start_hour = "00";
	        $start_minute = "00";
	        $start_second = "00";
	        $end_year = date("Y", strtotime("last day of last month"));;
	        $end_month = date("m", strtotime("last day of last month"));
	        $end_day = date("d", strtotime("last day of last month"));
	        $end_hour = "23";
	        $end_minute = "59";
	        $end_second = "59";*/

	        $start_year = "2015";
			$start_month = "11";
	        $start_day = "01";
	        $start_hour = "00";
	        $start_minute = "00";
	        $start_second = "00";
	        $end_year = "2015";
	        $end_month = "11";
	        $end_day = "30";
	        $end_hour = "23";
	        $end_minute = "59";
	        $end_second = "59";
	        $rf = cal_days_in_month(CAL_GREGORIAN, $start_month, $start_year);
        }
		else{
			$start_year = $this->cleanQuery($params["start_year"]);
	        $start_month = $this->cleanQuery($params["start_month"]);
	        $start_day = $this->cleanQuery($params["start_day"]);
	        $start_hour = $this->cleanQuery($params["start_hour"]);
	        $start_minute = $this->cleanQuery($params["start_minute"]);
	        $start_second = $this->cleanQuery($params["start_second"]);
	        $end_year = $this->cleanQuery($params["end_year"]);
	        $end_month = $this->cleanQuery($params["end_month"]);
	        $end_day = $this->cleanQuery($params["end_day"]);
	        $end_hour = $this->cleanQuery($params["end_hour"]);
	        $end_minute = $this->cleanQuery($params["end_minute"]);
	        $end_second = $this->cleanQuery($params["end_second"]);
			$rf = 0;
		}
		//FIN: Para mes pasado
        $car_path = $params["car_path"];
        $proceder = false;
        
        $conexion = new OCDsession();

        if(!$conexion->LoggedIn) {
            error_log("Logged in");
            header('Location: login.php');
            exit();
        } //if
        $minute_offset = $conexion->time_offset;
        
        $start_date = date("Y-m-d H:i:s", strtotime($start_year."-".$start_month."-".$start_day." ".$start_hour.":".$start_minute.":".$start_second));
		$end_date = date("Y-m-d H:i:s", strtotime($end_year."-".$end_month."-".$end_day." ".$end_hour.":".$end_minute.":".$end_second));
        
        if($start_date < $end_date){
        	$query = "SELECT c_id AS 'car_id', 
	                    obd_config.TCars.u_id AS 'car_obd', 
	                    o_name AS 'car_group', 
	                    c_vehicleNO AS 'car_license', 
	                    SUM(fuel_consumption) AS 'car_combustible', 
	                    SUM(mileage) / 1000 AS 'car_kilometraje', 
	                    SUM(fuel_consumption) + SUM(fuel_cost) AS 'car_costototal',
	                    ((SUM(mileage) / 1000) / SUM(fuel_consumption)) AS 'car_rendimiento',
	                    SUM(TIMESTAMPDIFF(SECOND, start_time, end_time)) / 3600 AS 'car_driving_hours',
	                    COUNT(car_id) AS 'car_no_trips',
	                    (SUM(mileage) / 1000) / (SUM(TIMESTAMPDIFF(SECOND, start_time, end_time)) / 3600) AS 'car_kmperhour'
	
	                FROM obd_config.TCars 
	
	                    INNER JOIN obd_config.TOrganization
	                        ON obd_config.TCars.o_path = obd_config.TOrganization.o_path 
	                    INNER JOIN obd_data_1.trip_data
	                        ON obd_config.TCars.c_id = obd_data_1.trip_data.car_id
	
	                WHERE obd_config.TCars.o_path LIKE '". $car_path ."%' AND 
	                      TIMESTAMP(DATE_SUB(obd_data_1.trip_data.start_time, INTERVAL $minute_offset MINUTE)) >= '" . 
	                      $start_year . "-" . $start_month . "-" . $start_day . " " . 
	                      $start_hour . ":" . $start_minute . ":" . $start_second . "' AND 
	                      TIMESTAMP(DATE_SUB(obd_data_1.trip_data.end_time, INTERVAL $minute_offset MINUTE)) <= '" . 
	                      $end_year . "-" . $end_month . "-" . $end_day . " " . 
	                      $end_hour . ":" . $end_minute . ":" . $end_second . "'
	
					GROUP BY car_id;";
					error_log($query);

	        
	        //Evitar que inyecten codigo malo
	        if(stripos($query, "insert") !== FALSE || stripos($query, "alter") !== FALSE || stripos($query, "drop") !== FALSE || stripos($query, "delete") !== FALSE){
	        	return array("resultado" => "Error", "datos" => "Ocurrio un error");
	        }
	        
	        //El formato de la base de datos es utf8
	        mysqli_set_charset($this->conexMySQL, "utf8" );
	        
	        $res = $this->query($query);
	
	        if($res){
	            while ($array = $res->fetch_array(MYSQLI_BOTH)){ 
	                $resultado = "Ok.";
	                $proceder = true;
	                
	                $codigo[] = array(
	                    'car_id'    => $array["car_id"],
	                    'car_obd' => $array["car_obd"],
	                    'car_group' => $array["car_group"], //GROUP_ID
	                    'car_license' => $array["car_license"],
	                    'car_combustible' => $array["car_combustible"],
	                    'car_kilometraje' => $array["car_kilometraje"],
	                    'car_costototal' => $array["car_costototal"],
	                    'car_rendimiento' => (int) $array["car_rendimiento"],
	                    'car_driving_hours' => $array["car_driving_hours"],
	                    'car_no_trips' => (int) $array["car_no_trips"],
	                    'car_kmperhour' => (int) $array["car_kmperhour"],
					); 
					$datos_dona[] = array (
						"etiqueta" => $array["car_group"], //GROUP_ID
						"dato"     => $array["car_driving_hours"]
					);                       
	            }
	            if(!$proceder){
	                $resultado = "Error";
	                $codigo = "No se encontraron datos.";
	            }
	        } 
	        else {
	            $resultado = "Error";
	            $proceder = false;
	            
	            $codigo[] = array(
	                'id'    => 0,
	                'nombre' => "Error leyendo el Query (".$query.") ->".$this->error(),
	            );
	        }
	        
	        if($proceder){
	            $query = "SELECT u_id AS 'car_obd', scoreType, AVG(score) AS 'score'
	                      FROM obd_user_data.TObdScoreAnalysis 
	                      WHERE TIMESTAMP(DATE_SUB(scoreDate, INTERVAL $minute_offset MINUTE)) BETWEEN '" . 
	                      $start_year . "-" . $start_month . "-" . $start_day . " " . 
	                      $start_hour . ":" . $start_minute . ":" . $start_second . "' AND '" . 
	                      $end_year . "-" . $end_month . "-" . $end_day . " " . 
	                      $end_hour . ":" . $end_minute . ":" . $end_second . "'
	                      GROUP BY u_id, scoreType;";
						  error_log($query);
	            
	            mysqli_set_charset($this->conexMySQL, "utf8" );
	        
	            $res = $this->query($query);
	
	            if($res){
	                while ($array = $res->fetch_array(MYSQLI_BOTH)){
	                    $resultado = "Ok.";
	                    
	                    foreach ( $codigo as $key => $avalue ) {
	                        if($avalue["car_obd"] == $array["car_obd"]){
	                            if($array["scoreType"] == 0){
	                                $codigo[$key]["car_safety_score"] = $array["score"];
	                            }
	                            
	                            if($array["scoreType"] == 1){
	                                $codigo[$key]["car_eco_score"] = $array["score"];
	                            }
	                        } 
	                    }                            
	                }
	            } 
	            else {
	                $resultado = "Error";
	                //$resultado = $query;
	                $codigo[] = array(
	                    'id'    => 0,
	                    'nombre' => "Error leyendo el Query (".$query.") ->".$this->error(),
	                );
	            }
				
				//DTC
				foreach ($codigo as $key => $value) {
					$query_dtc = "SELECT IFNULL(SUM(mal_num),0) AS dtc FROM obd_config.TStatisticMalTypeDay
		                      		WHERE car_id = " . $value["car_id"] . "
		                      		AND d_time BETWEEN
		                      			'$start_year-$start_month-$start_day $start_hour:$start_minute:$start_second'
		                      				AND 
		                      			'$end_year-$end_month-$end_day $end_hour:$end_minute:$end_second' ;";
		            
		            mysqli_set_charset($this->conexMySQL, "utf8" );
					error_log($query);
		
		            try{
		            	$res = $this->query($query_dtc);
						if($res->num_rows > 0){
							while ($array = $res->fetch_array(MYSQLI_BOTH)){
			                    foreach ( $codigo as $key => $avalue ) {
			                    	if($codigo[$key]["car_id"] == $value["car_id"]){
			                    		$codigo[$key]["dtc"] = $array["dtc"];
			                    	}
			                    }                            
			                }
						}
		            }
		            catch(Exception $e){}
				}
				//FIN:DTC
	        }
        }
		else{
			$resultado = "Error";
			$codigo = "Fecha de inicio debe ser menor a la de fin.";
		}
        
        $salida = json_encode(
            $feed = array("resultado"=>$resultado,"datos"=>array("datos" => $codigo, "r_f" => $rf), "datos_dona" => $datos_dona )
		);

        return $salida;
    }
    
    /*
	 * informacionParaDashboardSeguridad - Obtener la información de viajes de los autos en el rango de fechas y con hora de inicio y fin   
	*/
    function informacionParaDashboardSeguridad($params){
    	ini_set("memory_limit","1000M");
		set_time_limit(0);
		
    	//Para mes pasado
        if(isset($params["mes_pasado"]) && $params["mes_pasado"] == 1){
        	/*$start_year = date("Y", strtotime("first day of last month"));
			$start_month = date("m", strtotime("first day of last month"));
	        $start_day = date("d", strtotime("first day of last month"));
	        $start_hour = "00";
	        $start_minute = "00";
	        $start_second = "00";
	        $end_year = date("Y", strtotime("last day of last month"));;
	        $end_month = date("m", strtotime("last day of last month"));
	        $end_day = date("d", strtotime("last day of last month"));
	        $end_hour = "23";
	        $end_minute = "59";
	        $end_second = "59";*/

	        $start_year = "2015";
			$start_month = "10";
	        $start_day = "01";
	        $start_hour = "00";
	        $start_minute = "00";
	        $start_second = "00";
	        $end_year = "2015";
	        $end_month = "10";
	        $end_day = "31";
	        $end_hour = "23";
	        $end_minute = "59";
	        $end_second = "59";
	        $rf = cal_days_in_month(CAL_GREGORIAN, $start_month, $start_year);
        }
		else{
			$start_year = $this->cleanQuery($params["start_year"]);
	        $start_month = $this->cleanQuery($params["start_month"]);
	        $start_day = $this->cleanQuery($params["start_day"]);
	        $start_hour = $this->cleanQuery($params["start_hour"]);
	        $start_minute = $this->cleanQuery($params["start_minute"]);
	        $start_second = $this->cleanQuery($params["start_second"]);
	        $end_year = $this->cleanQuery($params["end_year"]);
	        $end_month = $this->cleanQuery($params["end_month"]);
	        $end_day = $this->cleanQuery($params["end_day"]);
	        $end_hour = $this->cleanQuery($params["end_hour"]);
	        $end_minute = $this->cleanQuery($params["end_minute"]);
	        $end_second = $this->cleanQuery($params["end_second"]);
			$rf = 0;
		}
		//FIN: Para mes pasado
		
	    $datos = NULL;
		$resultado = "OK";
		$sumatorias[0] = $sumatorias[1] = $sumatorias[2] = $sumatorias[3] = $sumatorias[4] = $sumatorias[5] = array("kilometros" => 0, "horas" => 0);
		$mensaje = ""; 
		$alarmas = NULL;
	    
		$conexion = new OCDsession();

        if(!$conexion->LoggedIn) {
            error_log("Logged in");
            header('Location: login.php');
            exit();
        } //if
        $minute_offset = $conexion->time_offset;
        
        $start_date = date("Y-m-d H:i:s", strtotime($start_year."-".$start_month."-".$start_day." ".$start_hour.":".$start_minute.":".$start_second));
		$end_date = date("Y-m-d H:i:s", strtotime($end_year."-".$end_month."-".$end_day." ".$end_hour.":".$end_minute.":".$end_second));
	    
		$id_carros = "";
		if(isset($params["id_carros"]) && $params["id_carros"] != "") $id_carros = $conexion->cleanQuery($params["id_carros"]);
		
		if($id_carros != "" && $start_date < $end_date){
			$query = "SELECT trip_id, car_id, (mileage / 1000) AS kilometraje, start_time, end_time,
								TIME_TO_SEC(TIMEDIFF(end_time, start_time)) / 3600 AS horas_manejo,
								IF(TIME(TIMESTAMP(DATE_SUB(td.end_time, INTERVAL $minute_offset MINUTE))) >= TIME('00:00:00') 
									AND 
									TIME(TIMESTAMP(DATE_SUB(td.end_time, INTERVAL $minute_offset MINUTE))) <= TIME('06:00:00'), '1', 
										IF(TIME(TIMESTAMP(DATE_SUB(td.end_time, INTERVAL $minute_offset MINUTE))) > TIME('06:00:00') 
											AND 
											TIME(TIMESTAMP(DATE_SUB(td.end_time, INTERVAL $minute_offset MINUTE))) <= TIME('11:00:00'), '2',
												IF(TIME(TIMESTAMP(DATE_SUB(td.end_time, INTERVAL $minute_offset MINUTE))) > TIME('11:00:00') 
													AND 
													TIME(TIMESTAMP(DATE_SUB(td.end_time, INTERVAL $minute_offset MINUTE))) <= TIME('14:00:00'), '3',
														IF(TIME(TIMESTAMP(DATE_SUB(td.end_time, INTERVAL $minute_offset MINUTE))) > TIME('14:00:00') 
															AND 
															TIME(TIMESTAMP(DATE_SUB(td.end_time, INTERVAL $minute_offset MINUTE))) <= TIME('18:00:00'), '4',
																IF(TIME(TIMESTAMP(DATE_SUB(td.end_time, INTERVAL $minute_offset MINUTE))) > TIME('18:00:00') 
																	AND 
																	TIME(TIMESTAMP(DATE_SUB(td.end_time, INTERVAL $minute_offset MINUTE))) <= TIME('23:59:59'), '5', '0')
                                						)
                                    			)
                                		)
                              	) AS rango
						FROM obd_data_1.trip_data AS td
	                	WHERE TIMESTAMP(DATE_SUB(td.start_time, INTERVAL $minute_offset MINUTE)) 
	                			>= '" . $start_year . "-" . $start_month . "-" . $start_day . " " . $start_hour . ":" . $start_minute . ":" . $start_second . "' 
	                		AND TIMESTAMP(DATE_SUB(td.end_time, INTERVAL $minute_offset MINUTE)) 
	                				<= '" . $end_year . "-" . $end_month . "-" . $end_day . " " . $end_hour . ":" . $end_minute . ":" . $end_second . "'
	                		AND td.car_id IN ( $id_carros ) ;";
	        
	        //Evitar que inyecten codigo malo
	        if(stripos($query, "insert") !== FALSE || stripos($query, "alter") !== FALSE || stripos($query, "drop") !== FALSE || stripos($query, "delete") !== FALSE){
	        	return array("resultado" => "Error", "datos" => "Ocurrio un error");
	        }
	        
	        //El formato de la base de datos es utf8
	        mysqli_set_charset($this->conexMySQL, "utf8" );
	        
	        try{
	        	$res = $this->query($query);
				if($res->num_rows > 0){
					while($row = $res->fetch_assoc()){
						$rango = 0;
						$kilometros = 0;
						$horas = 0;
						$datos[] = array(
											"trip_id" => $row["trip_id"],
											"car_id" => $row["car_id"],
											"kilometraje" => $row["kilometraje"],
											"start_time" => $row["start_time"],
											"end_time" => $row["end_time"],
											"horas_manejo" => $row["horas_manejo"]
						);
						
						//Acomodo por rango de horas
						$start_time = date("H:i:s", strtotime($row["start_time"]));
						$end_time = date("H:i:s", strtotime($row["end_time"]));
						$rango = $row["rango"];
						
						/*if($start_time >= date("H:i:s", strtotime("00:00:00")) && $start_time < date("H:i:s", strtotime("06:00:00"))){ //Rango 1
							if($end_time < date("H:i:s", strtotime("06:00:00"))){
								$rango = 1;
								$kilometros = $row["kilometraje"];
								$horas = $row["horas_manejo"];
							}
							else{
								$horas_para_este_rango = (strtotime("06:00:00") - strtotime($start_time)) / 3600;//Horas entre start time y el limite
								$horas_para_siguiente_rango = $row["horas_manejo"] - $horas_para_este_rango;//Horas totales menos horas del rango actual
								$kilometros_para_siguiente_rango = 0;
								//Obtener kilometraje del rango de horas
								if($row["kilometraje"] > 0){//Si hay kilometraje si hace la sumatoria
									$kilometros_para_este_rango = ($horas_para_este_rango * $row["kilometraje"]) / $row["horas_manejo"];
									$kilometros_para_siguiente_rango = $row["kilometraje"] - $kilometros_para_este_rango;
									$sumatorias[1]["kilometros"] += $kilometros_para_este_rango;
									$sumatorias[1]["horas"] += $horas_para_este_rango;
								} 
								
								if($end_time < date("H:i:s", strtotime("11:00:00"))){//rango inmediato posterior
									$rango = 2;//Siguiente rango
									$kilometros = $kilometros_para_siguiente_rango;
									$horas = $horas_para_siguiente_rango;
								}
								else{
									$horas_para_este_rango = (strtotime("11:00:00") - strtotime("06:00:01")) / 3600;//Horas entre limite anterior y el limite actual
									$horas_para_siguiente_rango = $horas_para_siguiente_rango - $horas_para_este_rango;//Horas totales menos horas del rango actual
									//Obtener kilometraje del rango de horas
									if($kilometros_para_siguiente_rango > 0){//Si hay kilometraje si hace la sumatoria
										$kilometros_para_este_rango = ($horas_para_este_rango * $kilometros_para_siguiente_rango) / $horas_para_siguiente_rango;
										$kilometros_para_siguiente_rango = $kilometros_para_siguiente_rango - $kilometros_para_este_rango;
										$sumatorias[2]["kilometros"] += $kilometros_para_este_rango;
										$sumatorias[2]["horas"] += $horas_para_este_rango;
									}
									
									if($end_time < date("H:i:s", strtotime("14:00:00"))){//rango inmediato posterior
										$rango = 3;//Siguiente rango
										$kilometros = $kilometros_para_siguiente_rango;
										$horas = $horas_para_siguiente_rango;
									}
									else{
										$rango = 1;
									}
								}
							}
						}
						elseif($start_time >= date("H:i:s", strtotime("06:00:00")) && $start_time < date("H:i:s", strtotime("11:00:00"))){ //Rango 2
							if($end_time < date("H:i:s", strtotime("11:00:00"))){
								$rango = 2;
								$kilometros = $row["kilometraje"];
								$horas = $row["horas_manejo"];
							}
							else{
								$horas_para_este_rango = (strtotime("11:00:00") - strtotime($start_time)) / 3600;//Horas entre start time y el limite
								$horas_para_siguiente_rango = $row["horas_manejo"] - $horas_para_este_rango;//Horas totales menos horas del rango actual
								$kilometros_para_siguiente_rango = 0;
								//Obtener kilometraje del rango de horas
								if($row["kilometraje"] > 0){//Si hay kilometraje si hace la sumatoria
									$kilometros_para_este_rango = ($horas_para_este_rango * $row["kilometraje"]) / $row["horas_manejo"];
									$kilometros_para_siguiente_rango = $row["kilometraje"] - $kilometros_para_este_rango;
									$sumatorias[2]["kilometros"] += $kilometros_para_este_rango;
									$sumatorias[2]["horas"] += $horas_para_este_rango;
								} 
								
								if($end_time < date("H:i:s", strtotime("14:00:00"))){//rango inmediato posterior
									$rango = 3;//Siguiente rango
									$kilometros = $kilometros_para_siguiente_rango;
									$horas = $horas_para_siguiente_rango;
								}
								else{
									$horas_para_este_rango = (strtotime("14:00:00") - strtotime("11:00:01")) / 3600;//Horas entre limite anterior y el limite actual
									$horas_para_siguiente_rango = $horas_para_siguiente_rango - $horas_para_este_rango;//Horas totales menos horas del rango actual
									//Obtener kilometraje del rango de horas
									if($kilometros_para_siguiente_rango > 0){//Si hay kilometraje si hace la sumatoria
										$kilometros_para_este_rango = ($horas_para_este_rango * $kilometros_para_siguiente_rango) / $horas_para_siguiente_rango;
										$kilometros_para_siguiente_rango = $kilometros_para_siguiente_rango - $kilometros_para_este_rango;
										$sumatorias[3]["kilometros"] += $kilometros_para_este_rango;
										$sumatorias[3]["horas"] += $horas_para_este_rango;
									}
									
									if($end_time > date("H:i:s", strtotime("14:00:00")) && $end_time < date("H:i:s", strtotime("18:00:00"))){//rango inmediato posterior
										$rango = 4;//Siguiente rango
										$kilometros = $kilometros_para_siguiente_rango;
										$horas = $horas_para_siguiente_rango;
									}
									else{
										$rango = 2;
									}
								}
							}
						}
						elseif($start_time >= date("H:i:s", strtotime("11:00:00")) && $start_time < date("H:i:s", strtotime("14:00:00"))){ //Rango 3
							if($end_time < date("H:i:s", strtotime("14:00:00"))){
								$rango = 3;
								$kilometros = $row["kilometraje"];
								$horas = $row["horas_manejo"];
							}
							else{
								$horas_para_este_rango = (strtotime("14:00:00") - strtotime($start_time)) / 3600;//Horas entre start time y el limite
								$horas_para_siguiente_rango = $row["horas_manejo"] - $horas_para_este_rango;//Horas totales menos horas del rango actual
								$kilometros_para_siguiente_rango = 0;
								//Obtener kilometraje del rango de horas
								if($row["kilometraje"] > 0){//Si hay kilometraje si hace la sumatoria
									$kilometros_para_este_rango = ($horas_para_este_rango * $row["kilometraje"]) / $row["horas_manejo"];
									$kilometros_para_siguiente_rango = $row["kilometraje"] - $kilometros_para_este_rango;
									$sumatorias[3]["kilometros"] += $kilometros_para_este_rango;
									$sumatorias[3]["horas"] += $horas_para_este_rango;
								} 
								
								if($end_time < date("H:i:s", strtotime("18:00:00"))){//rango inmediato posterior
									$rango = 4;//Siguiente rango
									$kilometros = $kilometros_para_siguiente_rango;
									$horas = $horas_para_siguiente_rango;
								}
								else{
									$horas_para_este_rango = (strtotime("18:00:00") - strtotime("14:00:01")) / 3600;//Horas entre limite anterior y el limite actual
									$horas_para_siguiente_rango = $horas_para_siguiente_rango - $horas_para_este_rango;//Horas totales menos horas del rango actual
									//Obtener kilometraje del rango de horas
									if($kilometros_para_siguiente_rango > 0){//Si hay kilometraje si hace la sumatoria
										$kilometros_para_este_rango = ($horas_para_este_rango * $kilometros_para_siguiente_rango) / $horas_para_siguiente_rango;
										$kilometros_para_siguiente_rango = $kilometros_para_siguiente_rango - $kilometros_para_este_rango;
										$sumatorias[4]["kilometros"] += $kilometros_para_este_rango;
										$sumatorias[4]["horas"] += $horas_para_este_rango;
									}
									
									if($end_time > date("H:i:s", strtotime("18:00:00")) && $end_time <= date("H:i:s", strtotime("23:59:59"))){//rango inmediato posterior
										$rango = 5;//Siguiente rango
										$kilometros = $kilometros_para_siguiente_rango;
										$horas = $horas_para_siguiente_rango;
									}
									else{
										$rango = 3;
									}
								}
							}
						}
						elseif($start_time >= date("H:i:s", strtotime("14:00:00")) && $start_time <= date("H:i:s", strtotime("18:00:00"))){ //Rango 4
							if($end_time < date("H:i:s", strtotime("18:00:00"))){
								$rango = 4;
								$kilometros = $row["kilometraje"];
								$horas = $row["horas_manejo"];
							}
							else{
								$horas_para_este_rango = (strtotime("18:00:00") - strtotime($start_time)) / 3600;//Horas entre start time y el limite
								$horas_para_siguiente_rango = $row["horas_manejo"] - $horas_para_este_rango;//Horas totales menos horas del rango actual
								$kilometros_para_siguiente_rango = 0;
								//Obtener kilometraje del rango de horas
								if($row["kilometraje"] > 0){//Si hay kilometraje si hace la sumatoria
									$kilometros_para_este_rango = ($horas_para_este_rango * $row["kilometraje"]) / $row["horas_manejo"];
									$kilometros_para_siguiente_rango = $row["kilometraje"] - $kilometros_para_este_rango;
									$sumatorias[4]["kilometros"] += $kilometros_para_este_rango;
									$sumatorias[4]["horas"] += $horas_para_este_rango;
								} 
								
								if($end_time <= date("H:i:s", strtotime("23:59:59"))){//rango inmediato posterior
									$rango = 5;//Siguiente rango
									$kilometros = $kilometros_para_siguiente_rango;
									$horas = $horas_para_siguiente_rango;
								}
								else{
									$horas_para_este_rango = (strtotime("23:59:59") - strtotime("18:00:01")) / 3600;//Horas entre limite anterior y el limite actual
									$horas_para_siguiente_rango = $horas_para_siguiente_rango - $horas_para_este_rango;//Horas totales menos horas del rango actual
									//Obtener kilometraje del rango de horas
									if($kilometros_para_siguiente_rango > 0){//Si hay kilometraje si hace la sumatoria
										$kilometros_para_este_rango = ($horas_para_este_rango * $kilometros_para_siguiente_rango) / $horas_para_siguiente_rango;
										$kilometros_para_siguiente_rango = $kilometros_para_siguiente_rango - $kilometros_para_este_rango;
										$sumatorias[5]["kilometros"] += $kilometros_para_este_rango;
										$sumatorias[5]["horas"] += $horas_para_este_rango;
									}
									
									if($end_time >= date("H:i:s", strtotime("00:00:00")) && $end_time < date("H:i:s", strtotime("06:00:00"))){//rango inmediato posterior
										$rango = 1;//Siguiente rango
										$kilometros = $kilometros_para_siguiente_rango;
										$horas = $horas_para_siguiente_rango;
									}
									else{
										$rango = 4;
									}
								}
							}
						}
						elseif($start_time > date("H:i:s", strtotime("18:00:00")) && $start_time <= date("H:i:s", strtotime("23:59:59"))){ //Rango 5
							$rango = 5;
							$kilometros = $row["kilometraje"];
							$horas = $row["horas_manejo"];
						}*/
						
						
						/*if($end_time >= date("H:i:s", strtotime("00:00:00")) && $end_time < date("H:i:s", strtotime("06:00:00"))){ //Rango 1
							$rango = 1;
						}
						elseif($end_time >= date("H:i:s", strtotime("06:00:00")) && $end_time < date("H:i:s", strtotime("11:00:00"))){ //Rango 2
							$rango = 2;
						}
						elseif($end_time >= date("H:i:s", strtotime("11:00:00")) && $end_time < date("H:i:s", strtotime("14:00:00"))){ //Rango 3
							$rango = 3;
						}
						elseif($end_time >= date("H:i:s", strtotime("14:00:00")) && $end_time <= date("H:i:s", strtotime("18:00:00"))){ //Rango 4
							$rango = 4;
						}
						elseif($end_time > date("H:i:s", strtotime("18:00:00")) && $end_time <= date("H:i:s", strtotime("23:59:59"))){ //Rango 5
							$rango = 5;
						}*/
						
						$kilometros = $row["kilometraje"];
						$horas = $row["horas_manejo"];
											
						$sumatorias[$rango]["kilometros"] += $kilometros;
						$sumatorias[$rango]["horas"] += $horas;
						//FIN: Acomodo por rango de horas
					}
				}
				else{
					$resultado = "Error";
		            $mensaje = "No hay datos de Seguridad en el periodo seleccionado";
				}
	        }
			catch(Exception $e){
	        	$resultado = "Error";
	            $mensaje = "Error con consulta: $e";
	        }
			
			//Conteo de alarmas
			$query_alarmas = "SELECT IFNULL(SUM(IF(type = 2 OR type = 4 OR type = 5 OR type = 8,  1, 0)), 0) AS conteo,
										IFNULL(SUM(IF(type = 2, 1, 0)), 0) AS speeding, IFNULL(SUM(IF(type = 4, 1, 0)) , 0)AS acceleration, 
										IFNULL(SUM(IF(type = 5, 1, 0)), 0) AS braking, IFNULL(SUM(IF(type = 8, 1, 0)), 0) AS rpm
								FROM obd_data_1.alarm_data 
								WHERE car_id IN ( $id_carros )
								AND TIMESTAMP(DATE_SUB(d_time, INTERVAL $minute_offset MINUTE)) 
										BETWEEN '" . $start_year . "-" . $start_month . "-" . $start_day . " " . $start_hour . ":" . $start_minute . ":" . $start_second . "' 
	                						AND '" . $end_year . "-" . $end_month . "-" . $end_day . " " . $end_hour . ":" . $end_minute . ":" . $end_second . "' ;";
			$result_alarmas = $this->query($query_alarmas);
			if($result_alarmas->num_rows == 1){
				$alarmas = $result_alarmas->fetch_assoc();
			}
			//FIN: Conteo de alarmas
		}
		else{
			$resultado = "Error";
	        $mensaje = "Ocurrió un error";
		}
		
		$salida = json_encode(array("resultado" => $resultado, "datos" => array("datos" => $datos, "sumatorias" => $sumatorias, "mensaje" => $mensaje, "alarmas" => $alarmas)));

        return $salida;
    }
	/*informacionParaDashboardSeguridad*/
	
	/*
	 * informacionActividadInusual - Obtiene información de actividad en fin de semana   
	*/
    function informacionActividadInusual($params){
    	ini_set("memory_limit","500M");
		set_time_limit(0);
		
    	//Para mes pasado
        if(isset($params["mes_pasado"]) && $params["mes_pasado"] == 1){
        	$start_year = date("Y", strtotime("first day of last month"));
			$start_month = date("m", strtotime("first day of last month"));
	        $start_day = date("d", strtotime("first day of last month"));
	        $start_hour = "00";
	        $start_minute = "00";
	        $start_second = "00";
	        $end_year = date("Y", strtotime("last day of last month"));;
	        $end_month = date("m", strtotime("last day of last month"));
	        $end_day = date("d", strtotime("last day of last month"));
	        $end_hour = "23";
	        $end_minute = "59";
	        $end_second = "59";

	        /*$start_year = "2015";
			$start_month = "10";
	        $start_day = "01";
	        $start_hour = "00";
	        $start_minute = "00";
	        $start_second = "00";
	        $end_year = "2015";
	        $end_month = "10";
	        $end_day = "31";
	        $end_hour = "23";
	        $end_minute = "59";
	        $end_second = "59";*/
	        $rf = cal_days_in_month(CAL_GREGORIAN, $start_month, $start_year);
        }
		else{
			$start_year = $this->cleanQuery($params["start_year"]);
	        $start_month = $this->cleanQuery($params["start_month"]);
	        $start_day = $this->cleanQuery($params["start_day"]);
	        $start_hour = $this->cleanQuery($params["start_hour"]);
	        $start_minute = $this->cleanQuery($params["start_minute"]);
	        $start_second = $this->cleanQuery($params["start_second"]);
	        $end_year = $this->cleanQuery($params["end_year"]);
	        $end_month = $this->cleanQuery($params["end_month"]);
	        $end_day = $this->cleanQuery($params["end_day"]);
	        $end_hour = $this->cleanQuery($params["end_hour"]);
	        $end_minute = $this->cleanQuery($params["end_minute"]);
	        $end_second = $this->cleanQuery($params["end_second"]);
			$rf = 0;
		}
		//FIN: Para mes pasado
		
	    $datos_general = NULL;
		$datos_individual = NULL;
		$resultado = "OK";
		$car_path = $params["car_path"];
		$mensaje = "";
		
		$fin_de = 0;
		if(isset($params["fin_de"]) && $params["fin_de"] > 0)
			$fin_de = 1;
	    
		$conexion = new OCDsession();

        if(!$conexion->LoggedIn) {
            error_log("Logged in");
            header('Location: login.php');
            exit();
        } //if
        
        $minute_offset = $conexion->time_offset; 
        
        $start_date = date("Y-m-d H:i:s", strtotime($start_year."-".$start_month."-".$start_day." ".$start_hour.":".$start_minute.":".$start_second));
		$end_date = date("Y-m-d H:i:s", strtotime($end_year."-".$end_month."-".$end_day." ".$end_hour.":".$end_minute.":".$end_second));
	    
		
		if($start_date < $end_date){
			$query_general = "SELECT c.c_id AS car_id, c.c_vehicleNO AS placa, MAX(TIMESTAMP(DATE_SUB(td.end_time, INTERVAL $minute_offset MINUTE))) AS fecha, 
										torg.o_name AS grupo
								FROM obd_config.TCars AS c
								LEFT JOIN obd_data_1.trip_data AS td ON c.c_id = td.car_id
								LEFT JOIN obd_config.TOrganization AS torg ON c.o_path = torg.o_path 
								WHERE c.o_path LIKE '". $car_path ."%'
								AND (TIMESTAMP(DATE_SUB(td.start_time, INTERVAL $minute_offset MINUTE)) >= '" . 
	                      				$start_year . "-" . $start_month . "-" . $start_day . " " . 
	                      				$start_hour . ":" . $start_minute . ":" . $start_second . "' AND 
	                      			(TIMESTAMP(DATE_SUB(td.end_time, INTERVAL $minute_offset MINUTE))) <= '" . 
	                      				$end_year . "-" . $end_month . "-" . $end_day . " " . 
	                      				$end_hour . ":" . $end_minute . ":" . $end_second . "') ";
			if($fin_de == 0){
				$complemento_query =  "AND(	
										(
											(	
												(
													DAYOFWEEK(TIMESTAMP(DATE_SUB(td.start_time, INTERVAL $minute_offset MINUTE))) = 2 OR 
											 		DAYOFWEEK(TIMESTAMP(DATE_SUB(td.start_time, INTERVAL $minute_offset MINUTE))) = 3 OR 
											 		DAYOFWEEK(TIMESTAMP(DATE_SUB(td.start_time, INTERVAL $minute_offset MINUTE))) = 4 OR 
											 		DAYOFWEEK(TIMESTAMP(DATE_SUB(td.start_time, INTERVAL $minute_offset MINUTE))) = 5
											 	) 
											 	AND 
												(
													TIME(TIMESTAMP(DATE_SUB(td.start_time, INTERVAL $minute_offset MINUTE))) >= TIME('21:00:00') AND 
											 		TIME(TIMESTAMP(DATE_SUB(td.start_time, INTERVAL $minute_offset MINUTE))) <= TIME('06:00:00')
												)
											)
											
											OR
											
											(
												DAYOFWEEK(TIMESTAMP(DATE_SUB(td.start_time, INTERVAL $minute_offset MINUTE))) = 6 
										 		AND TIME(TIMESTAMP(DATE_SUB(td.start_time, INTERVAL $minute_offset MINUTE))) <= TIME('06:00:00')
											)
										)  
									)";
				$query_general .= $complemento_query;
			}
			else{
				$complemento_query = "	AND (
									(DAYOFWEEK(TIMESTAMP(DATE_SUB(td.start_time, INTERVAL $minute_offset MINUTE))) = 6 
										AND TIME(TIMESTAMP(DATE_SUB(td.start_time, INTERVAL $minute_offset MINUTE))) >= TIME('21:00:00'))
									OR
									(DAYOFWEEK(TIMESTAMP(DATE_SUB(td.start_time, INTERVAL $minute_offset MINUTE)) = 7))
									OR
									(DAYOFWEEK(TIMESTAMP(DATE_SUB(td.start_time, INTERVAL $minute_offset MINUTE)) = 1))
									OR
									(DAYOFWEEK(TIMESTAMP(DATE_SUB(td.start_time, INTERVAL $minute_offset MINUTE))) = 2 
										AND TIME(TIMESTAMP(DATE_SUB(td.start_time, INTERVAL $minute_offset MINUTE))) <= TIME('07:00:00'))
								  )";
				
				$query_general .= $complemento_query;
			}					
			
			$query_general .= " GROUP BY c.c_id";					
			//Evitar que inyecten codigo malo
	        if(stripos($query_general, "insert") !== FALSE || stripos($query_general, "alter") !== FALSE 
	        			|| stripos($query_general, "drop") !== FALSE || stripos($query_general, "delete") !== FALSE){
	        	return array("resultado" => "Error", "datos" => "Ocurrio un error");
	        }
	        
	        //El formato de la base de datos es utf8
	        mysqli_set_charset($this->conexMySQL, "utf8" );
	        
	        try{
	        	$resultado_general = $this->query($query_general);
	        	if($resultado_general->num_rows > 0){
	        		while($row_general = $resultado_general->fetch_assoc()){
	        			//Obtener datos generales
	        			$query_espec = "SELECT IFNULL(end_addr, ' - ') AS direccion_fin, ((mileage / 1000) / (TIMESTAMPDIFF(SECOND, start_time, end_time) / 3600)) AS velocidad,
												IFNULL(CONCAT('Lat, Lng(', end_latlon, ')'), ' - ') AS coordenadas, (mileage / 1000) AS kilometraje
											FROM obd_data_1.trip_data 
											WHERE car_id = ".$row_general["car_id"]." 
											AND (TIMESTAMP(DATE_SUB(end_time, INTERVAL $minute_offset MINUTE))) = '".$row_general["fecha"]."' ";
						$result_espec = $this->query($query_espec);
						if($result_espec->num_rows == 1){
							$row_espec = $result_espec->fetch_assoc();
							
							//datos de GPS
							$anio_fecha = date('Y', strtotime($row_general["fecha"]));
							$query_gps = "SELECT IFNULL(rpm, '-') AS rpm, 
													IFNULL(IF(latitude_way = 1 AND longitude_way = 1, 'Noreste',
														IF(latitude_way = 1 AND longitude_way = 0, 'Noroeste',
															IF(latitude_way = 0 AND longitude_way = 1, 'Sureste',
																IF(latitude_way = 0 AND longitude_way = 0, 'Suroeste', '')
															)
														)
													), '-') AS direccion
											FROM obd_data_1.gps_data_$anio_fecha
											WHERE car_id = ".$row_general["car_id"]."
											AND DATE(TIMESTAMP(DATE_SUB(collect_datetime, INTERVAL $minute_offset MINUTE))) = DATE('".$row_general["fecha"]."')
											AND HOUR(TIMESTAMP(DATE_SUB(collect_datetime, INTERVAL $minute_offset MINUTE))) = HOUR('".$row_general["fecha"]."')
											AND MINUTE(TIMESTAMP(DATE_SUB(collect_datetime, INTERVAL $minute_offset MINUTE))) = MINUTE('".$row_general["fecha"]."')
											ORDER BY collect_datetime ASC
											LIMIT 1;";
							try{
								$result_gps = $this->query($query_gps);
								if($result_gps){
									if($result_gps->num_rows == 1){
										$row_gps = $result_gps->fetch_assoc();
										$rpm = $row_gps["rpm"];
										$direccion = $row_gps["direccion"];
									}
									else{
										$rpm = "-";
			        					$direccion = "-";
									}
								}
								
							}
							catch(Exception $e){
								$rpm = "-";
	        					$direccion = "-";
							}
							//FIN: datos de GPS
							
							$datos_general[] = array("car_id" => $row_general["car_id"],
													 "grupo" => $row_general["grupo"],
													 "placa" => $row_general["placa"],
													 "fecha" => $row_general["fecha"],
													 "localizacion" => $row_espec["direccion_fin"],
													 "velocidad" => $row_espec["velocidad"],
													 "rpm" => $rpm,
													 "direccion" => $direccion,
													 "coordenadas" => $row_espec["coordenadas"],
													 "kilometraje" => $row_espec["kilometraje"]);
	        			//FIN: Obtener datos generales
	        			
	        			
						}
						else{
							$resultado = "Error";
				            $mensaje = "No hay datos en el periodo seleccionado";
						}
						
						//Por viaje
						$query_espec = "SELECT ((mileage / 1000) / (TIMESTAMPDIFF(SECOND, start_time, end_time) / 3600)) AS velocidad,
												(mileage / 1000) AS kilometraje, (TIMESTAMP(DATE_SUB(end_time, INTERVAL $minute_offset MINUTE))) AS fecha, 
												car_id
											FROM obd_data_1.trip_data AS td
											WHERE car_id = ".$row_general["car_id"]."
											AND (TIMESTAMP(DATE_SUB(start_time, INTERVAL $minute_offset MINUTE))) >= '$start_date' 
											AND (TIMESTAMP(DATE_SUB(end_time, INTERVAL $minute_offset MINUTE))) <= '".$row_general["fecha"]."' ".$complemento_query;
						$result_espec = $this->query($query_espec);
						if($result_espec->num_rows > 0){
							while($row_espec = $result_espec->fetch_assoc()){
								//datos de GPS
								$anio_fecha = date('Y', strtotime($row_espec["fecha"]));
								$query_gps = "SELECT IFNULL(rpm, '-') AS rpm
												FROM obd_data_1.gps_data_$anio_fecha
												WHERE car_id = ".$row_espec["car_id"]."
												AND DATE(TIMESTAMP(DATE_SUB(collect_datetime, INTERVAL $minute_offset MINUTE))) = DATE('".$row_espec["fecha"]."')
												AND HOUR(TIMESTAMP(DATE_SUB(collect_datetime, INTERVAL $minute_offset MINUTE))) = HOUR('".$row_espec["fecha"]."')
												AND MINUTE(TIMESTAMP(DATE_SUB(collect_datetime, INTERVAL $minute_offset MINUTE))) = MINUTE('".$row_espec["fecha"]."')
												ORDER BY collect_datetime ASC
												LIMIT 1;";
								try{
									$result_gps = $this->query($query_gps);
									if($result_gps){
										if($result_gps->num_rows == 1){
											$row_gps = $result_gps->fetch_assoc();
											$rpm = $row_gps["rpm"];
										}
										else{
											$rpm = 0;
										}
									}
									
								}
								catch(Exception $e){
									$rpm = 0;
								}
								//FIN: datos de GPS
								
								//Datos por cada carro encontrado
			        			if(!isset($datos_individual[$row_espec["car_id"]]["velocidad"]))
									$datos_individual[$row_espec["car_id"]]["velocidad"] = 0;
									
								if(!isset($datos_individual[$row_espec["car_id"]]["kilometraje"]))
									$datos_individual[$row_espec["car_id"]]["kilometraje"] = 0;	
								
								if(!isset($datos_individual[$row_espec["car_id"]]["rpm"]))
									$datos_individual[$row_espec["car_id"]]["rpm"] = 0;
								
								if(!isset($datos_individual[$row_espec["car_id"]]["total"]))
									$datos_individual[$row_espec["car_id"]]["total"] = 0;
			        			
			        			$datos_individual[$row_espec["car_id"]]["velocidad"] += $row_espec["velocidad"];
								$datos_individual[$row_espec["car_id"]]["kilometraje"] += $row_espec["kilometraje"];
								$datos_individual[$row_espec["car_id"]]["rpm"] += $rpm; 
								$datos_individual[$row_espec["car_id"]]["total"] += 1;
			        			//FIN: Datos por cada carro encontrado
							}
						}
						//FIN: Por viaje
	        		}
	        	}
				else{
					$resultado = "Error";
		            $mensaje = "No hay datos en el periodo seleccionado";
				}
	        }
			catch(Exception $e){
				$resultado = "Error";
	            $mensaje = "Error con consulta: $e";
			}
		}
		else{
			$resultado = "Error";
	        $mensaje = "Ocurrió un error";
		}
		
		$salida = json_encode(array("resultado" => $resultado, "datos" => array("mensaje" => $mensaje, "datos_general" => $datos_general, "datos_individual" => $datos_individual)));

        return $salida;
    }
	/*informacionActividadInusual*/
    /*
    *
   
   
   
   
   +++Inicio de informacionDashboardRiesgos+++
    *
    */
     function informacionDashboardRiesgos($params){
    	ini_set("memory_limit","-1");
		set_time_limit(0);
		
    	//Para mes pasado
        if(isset($params["mes_pasado"]) && $params["mes_pasado"] == 1){
        	$start_year = date("Y", strtotime("first day of last month"));
			$start_month = date("m", strtotime("first day of last month"));
	        $start_day = date("d", strtotime("first day of last month"));
	        $start_hour = "00";
	        $start_minute = "00";
	        $start_second = "00";
	        $end_year = date("Y", strtotime("last day of last month"));;
	        $end_month = date("m", strtotime("last day of last month"));
	        $end_day = date("d", strtotime("last day of last month"));
	        $end_hour = "23";
	        $end_minute = "59";
	        $end_second = "59";

	        /*$start_year = "2015";
			$start_month = "10";
	        $start_day = "01";
	        $start_hour = "00";
	        $start_minute = "00";
	        $start_second = "00";
	        $end_year = "2015";
	        $end_month = "10";
	        $end_day = "31";
	        $end_hour = "23";
	        $end_minute = "59";
	        $end_second = "59";*/
	        $rf = cal_days_in_month(CAL_GREGORIAN, $start_month, $start_year);
        }
		else{
			$start_year = $this->cleanQuery($params["start_year"]);
	        $start_month = $this->cleanQuery($params["start_month"]);
	        $start_day = $this->cleanQuery($params["start_day"]);
	        $start_hour = $this->cleanQuery($params["start_hour"]);
	        $start_minute = $this->cleanQuery($params["start_minute"]);
	        $start_second = $this->cleanQuery($params["start_second"]);
	        $end_year = $this->cleanQuery($params["end_year"]);
	        $end_month = $this->cleanQuery($params["end_month"]);
	        $end_day = $this->cleanQuery($params["end_day"]);
	        $end_hour = $this->cleanQuery($params["end_hour"]);
	        $end_minute = $this->cleanQuery($params["end_minute"]);
	        $end_second = $this->cleanQuery($params["end_second"]);
			$rf = 0;
		}
		//FIN: Para mes pasado
         
        $datos_general = NULL;
		$datos_individual = NULL;
        $datos_periodos["A"] = 
        $datos_periodos["B"] = 
        $datos_periodos["C"] = 
        $datos_periodos["D"] = 
        $datos_periodos["E"] = array("tiempo_manejo" => floatval(0),
                                     "km_manejo" => floatval(0),
                                     "consumo" => floatval(0),
                                     "velocidad_promedio" => floatval(0),
                                     "eventos_agresivos" => floatval(0),
                                     "vehiculos" => intval(0),
									 "speed_alerts" => intval(0),
                                     "hard_breaking" => intval(0),
                                     "hard_acceleration" => intval(0),
                                     "rpm" => intval(0),
									 "conteo_alarmas" => intval(0),
                                     "coordenadas" => array());

		$resultado = "OK";
		$car_path = $params["car_path"];
		$mensaje = "";
        $tiempo_manejo_total = 0;
        $vehiculos["A"] = $vehiculos["B"] = $vehiculos["C"] = $vehiculos["D"] = $vehiculos["E"] = array();
		$total_vehiculos = 0;
		$total_viajes["A"] = $total_viajes["B"] = $total_viajes["C"] = $total_viajes["D"] = $total_viajes["E"] = 0; 
		$total_alarmas = 0;
		$total_kilometros_manejo = 0;
		$total_eventos_agresivos = 0;
        $coordenadas_fila ="";
		$coordenadas["A"] = $coordenadas["B"] = $coordenadas["C"] = $coordenadas["D"] = $coordenadas["E"] = array();
		$total_coordenadas["A"] = 
		$total_coordenadas["B"] = 
		$total_coordenadas["C"] = 
		$total_coordenadas["D"] = 
		$total_coordenadas["E"] = array("total" => 0, "en_cluster" => 0);
		$coordenadas_por_vehiculo = NULL;
		$total_coordenadas_por_vehiculo = NULL;
        $datos_vehiculo = NULL; 
         
		$tamano_cluster = 4;
		if(isset($params["tamano_cluster"]) && $params["tamano_cluster"] > 0)
			$tamano_cluster = $this->cleanQuery($params["tamano_cluster"]); 
	    
		$conexion = new OCDsession();
        if(!$conexion->LoggedIn) {
            error_log("Logged in");
            header('Location: login.php');
            exit();
        } //if
        $minute_offset = $conexion->time_offset; 
        
        $start_date = date("Y-m-d H:i:s", strtotime($start_year."-".$start_month."-".$start_day." ".$start_hour.":".$start_minute.":".$start_second));
		$end_date = date("Y-m-d H:i:s", strtotime($end_year."-".$end_month."-".$end_day." ".$end_hour.":".$end_minute.":".$end_second));
	    
       	if($start_date < $end_date){
			$query_general = "SELECT  tc.c_vehicleNO AS placa,
                              				tp.car_id, DATE_SUB(tp.start_time, INTERVAL $minute_offset MINUTE) AS start_time, 
                              				DATE_SUB(tp.end_time, INTERVAL $minute_offset MINUTE) AS end_time, tp.start_latlon, 
                              				tp.end_latlon, (tp.mileage / 1000) AS kilometros,
                              				tp.fuel_consumption AS consumo,
                              
                              IF(
                              	TIME(DATE_SUB(tp.end_time, INTERVAL $minute_offset MINUTE)) >= TIME('00:00:00') 
                              	AND 
                              	TIME(DATE_SUB(tp.end_time, INTERVAL $minute_offset MINUTE)) <= TIME('06:00:00'), 'D', 
									IF(
										TIME(DATE_SUB(tp.end_time, INTERVAL $minute_offset MINUTE)) > TIME('06:00:00') 
										AND 
										TIME(DATE_SUB(tp.end_time, INTERVAL $minute_offset MINUTE)) <= TIME('11:00:00'), 'B',
											IF(
												TIME(DATE_SUB(tp.end_time, INTERVAL $minute_offset MINUTE)) > TIME('11:00:00') 
												AND 
												TIME(DATE_SUB(tp.end_time, INTERVAL $minute_offset MINUTE)) <= TIME('14:00:00'), 'C',
													IF(
														TIME(DATE_SUB(tp.end_time, INTERVAL $minute_offset MINUTE)) > TIME('14:00:00') 
														AND 
														TIME(DATE_SUB(tp.end_time, INTERVAL $minute_offset MINUTE)) <= TIME('18:00:00'), 'A',
															IF(
																TIME(DATE_SUB(tp.end_time, INTERVAL $minute_offset MINUTE)) > TIME('18:00:00') 
																AND 
																TIME(DATE_SUB(tp.end_time, INTERVAL $minute_offset MINUTE)) <= TIME('23:59:59'), 'E', 'Z'
															)
                                       				)
                                    		)
                                	)
                              ) AS time_cluster,
                              
                              IF(
								TIME(DATE_SUB(tp.end_time, INTERVAL $minute_offset MINUTE)) >= TIME('00:00:00') 
								AND 
								TIME(DATE_SUB(tp.end_time, INTERVAL $minute_offset MINUTE)) <= TIME('06:00:00'), 4, 
									IF(
										TIME(DATE_SUB(tp.end_time, INTERVAL $minute_offset MINUTE)) > TIME('06:00:00') 
										AND 
										TIME(DATE_SUB(tp.end_time, INTERVAL $minute_offset MINUTE)) <= TIME('11:00:00'), 8,
											IF(
												TIME(DATE_SUB(tp.end_time, INTERVAL $minute_offset MINUTE)) > TIME('11:00:00') 
												AND 
												TIME(DATE_SUB(tp.end_time, INTERVAL $minute_offset MINUTE)) <= TIME('14:00:00'), 6,
													IF(
														TIME(DATE_SUB(tp.end_time, INTERVAL $minute_offset MINUTE)) > TIME('14:00:00') 
														AND 
														TIME(DATE_SUB(tp.end_time, INTERVAL $minute_offset MINUTE)) <= TIME('18:00:00'), 9,
															IF(
																TIME(DATE_SUB(tp.end_time, INTERVAL $minute_offset MINUTE)) > TIME('18:00:00') 
																AND 
																TIME(DATE_SUB(tp.end_time, INTERVAL $minute_offset MINUTE)) <= TIME('23:59:59'), 3, 100)
                                        )
                                    )
                                )
                              ) AS time_probabilidad,
                              
                              (TIMESTAMPDIFF(SECOND, tp.start_time, tp.end_time) / 3600) AS duracion,
                              ((tp.mileage / 1000) / (TIMESTAMPDIFF(SECOND, tp.start_time, tp.end_time) / 3600)) AS velocidad_promedio,
                              
                              IF(((tp.mileage / 1000) / (TIMESTAMPDIFF(SECOND, tp.start_time, tp.end_time) / 3600)) BETWEEN 0 AND 10, 'E',
								IF(((tp.mileage / 1000) / (TIMESTAMPDIFF(SECOND, tp.start_time, tp.end_time) / 3600)) BETWEEN 10 AND 25, 'D', 
									IF(((tp.mileage / 1000) / (TIMESTAMPDIFF(SECOND, tp.start_time, tp.end_time) / 3600)) BETWEEN 25 AND 50, 'C', 
										IF(((tp.mileage / 1000) / (TIMESTAMPDIFF(SECOND, tp.start_time, tp.end_time) / 3600)) BETWEEN 50 AND 75, 'B', 
											IF(((tp.mileage / 1000) / (TIMESTAMPDIFF(SECOND, tp.start_time, tp.end_time) / 3600)) >75, 'A', 'X')
                                        )
									
                                    )
                                )
                              ) AS speed_type
                                   
								FROM obd_data_1.trip_data AS tp
                                LEFT JOIN obd_config.TCars AS tc ON tp.car_id = tc.c_id
                                WHERE tc.o_path LIKE '". $car_path ."%' 
                                	AND 
	                      			DATE_SUB(tp.start_time, INTERVAL $minute_offset MINUTE) >= '" . 
	                      						$start_year . "-" . $start_month . "-" . $start_day . " " . 
	                      						$start_hour . ":" . $start_minute . ":" . $start_second . "' 
	                      					AND 
	                      			DATE_SUB(tp.end_time, INTERVAL $minute_offset MINUTE) <= '" . 
	                      						$end_year . "-" . $end_month . "-" . $end_day . " " . 
	                      						$end_hour . ":" . $end_minute . ":" . $end_second . "';";
            					
			//Evitar que inyecten codigo malo
	        if(stripos($query_general, "insert") !== FALSE || stripos($query_general, "alter") !== FALSE 
	        			|| stripos($query_general, "drop") !== FALSE || stripos($query_general, "delete") !== FALSE){
	        	return array("resultado" => "Error", "datos" => "Ocurrio un error!");
	        }
	        
	        //El formato de la base de datos es utf8
	        mysqli_set_charset($this->conexMySQL, "utf8" );
	        
	        try{
	        	$resultado_general = $this->query($query_general);
	        	if($resultado_general->num_rows > 0){
	        		while($row_general = $resultado_general->fetch_assoc()){
                        $agressive_type = 0;
                        $agressive_probabilidad = 0;
                        
                        /*if($row_general["eventos_agresivos"] > 0 && $row_general["eventos_agresivos"] <= 5){
                            $agressive_type = "E";
                            $agressive_probabilidad = 2;
                        }
                        else if($row_general["eventos_agresivos"] > 5 && $row_general["eventos_agresivos"] <= 10){
                            $agressive_type = "D";
                            $agressive_probabilidad = 4;
                        }
                        else if($row_general["eventos_agresivos"] > 10 && $row_general["eventos_agresivos"] <= 25){
                            $agressive_type = "C";
                            $agressive_probabilidad = 6;
                        }
                        else if($row_general["eventos_agresivos"] > 25 && $row_general["eventos_agresivos"] <= 50){
                            $agressive_type = "B";
                            $agressive_probabilidad = 8;
                        }
                        else if($row_general["eventos_agresivos"] > 50){
                            $agressive_type = "A";
                            $agressive_probabilidad = 10;
                        }*/
                        
                        $datos_general[] = array(
                                            "placa" => $row_general["placa"],
                                            "car_id" => $row_general["car_id"],
                                            "start_time" => $row_general["start_time"],
                                            "end_time" => $row_general["end_time"],
                                            "time_cluster" => $row_general["time_cluster"],
                                            "time_probabilidad" => $row_general["time_probabilidad"],
                                            "start_latlon" => $row_general["start_latlon"],
                                            "end_latlon" => $row_general["end_latlon"],
                                            "kilometros" => $row_general["kilometros"],
                                            "duracion" => $row_general["duracion"],
                                            "velocidad_promedio" => $row_general["velocidad_promedio"],
                                            "speed_type" => $row_general["speed_type"],
                                            //"speed_alerts" => $row_general["speed_alerts"],
                                            //"hard_breaking" => $row_general["hard_breaking"],
                                            //"hard_acceleration" => $row_general["hard_acceleration"],
                                            //"eventos_agresivos" => $row_general["eventos_agresivos"],
                                            "agressive_type" => $agressive_type,
                                            "agressive_probabilidad" => $agressive_probabilidad,
                                            "consumo" => $row_general["consumo"]
                        );
                        
                        $total_viajes[$row_general["time_cluster"]] += 1; 
	        		}
	        	}
				else{
					$resultado = "Error";
		            $mensaje = "No hay datos en el periodo seleccionado";
				}
	        }
			catch(Exception $e){
				$resultado = "Error";
	            $mensaje = "Error con consulta: $e";
			}
          
            //++++Obtener datos por vehiculo (tabla de colores)
            if ($datos_general != NULL){
            	foreach ($datos_general as $dato ) {
            		if(!isset($datos_vehiculo[$dato["car_id"]]["consumo"]))
                    	$datos_vehiculo[$dato["car_id"]]["consumo"] = 0;
                    if(!isset($datos_vehiculo[$dato["car_id"]]["velocidad_promedio"]))
                        $datos_vehiculo[$dato["car_id"]]["velocidad_promedio"] = 0;
                    if(!isset($datos_vehiculo[$dato["car_id"]]["total"]))
                        $datos_vehiculo[$dato["car_id"]]["total"] = 0;
					if(!isset($datos_vehiculo[$dato["car_id"]][$dato["time_cluster"]]))
                        $datos_vehiculo[$dato["car_id"]][$dato["time_cluster"]] = 0;
					if(!isset($datos_vehiculo[$dato["car_id"]]["kilometros"]))
                        $datos_vehiculo[$dato["car_id"]]["kilometros"] = 0;
					if(!isset($datos_vehiculo[$dato["car_id"]]["coordenadas"]))
                        $datos_vehiculo[$dato["car_id"]]["coordenadas"] = array();
                        
                    $datos_vehiculo[$dato["car_id"]]["placa"] = ($dato["placa"]);    
                    $datos_vehiculo[$dato["car_id"]]["consumo"] += floatval ($dato["consumo"]);
                    $datos_vehiculo[$dato["car_id"]]["velocidad_promedio"] += floatval ($dato["velocidad_promedio"]);    
                    $datos_vehiculo[$dato["car_id"]]["total"] += 1;
					$datos_vehiculo[$dato["car_id"]][$dato["time_cluster"]] += 1;
					$datos_vehiculo[$dato["car_id"]]["kilometros"] += floatval ($dato["kilometros"]);
					
					if($dato["end_latlon"] != "")
						array_push($datos_vehiculo[$dato["car_id"]]["coordenadas"], $dato["end_latlon"]);
              	}

				if($datos_vehiculo != NULL){
					foreach ($datos_vehiculo as $key => $value) {
						//Alarmas
						$query_alarmas_vehiculo = "SELECT IFNULL(SUM(IF(type = 2 OR type = 4 OR type = 5 OR type = 8,  1, 0)), 0) AS conteo,
															IFNULL(SUM(IF(type = 2, 1, 0)), 0) AS speeding, IFNULL(SUM(IF(type = 4, 1, 0)) , 0) AS acceleration, 
															IFNULL(SUM(IF(type = 5, 1, 0)), 0) AS braking, IFNULL(SUM(IF(type = 8, 1, 0)), 0) AS rpm
													FROM obd_data_1.alarm_data 
													WHERE car_id = $key 
														AND DATE_SUB(d_time, INTERVAL $minute_offset MINUTE) BETWEEN '" . $start_year . "-" . $start_month . "-" . $start_day . " " . $start_hour . ":" . $start_minute . ":" . $start_second . "' 
				                						AND '" . $end_year . "-" . $end_month . "-" . $end_day . " " . $end_hour . ":" . $end_minute . ":" . $end_second . "' ";
						$result_alarmas_vehiculo = $this->query($query_alarmas_vehiculo);
						$row_alarmas_vehiculo = $result_alarmas_vehiculo->fetch_assoc();
						$datos_vehiculo[$key]["total_alarmas"] = $row_alarmas_vehiculo["conteo"];
						
						//Cluster
				        //Contamos número de ocurrencias de cada coordenada, truncando a dos decimales primero
				        $llave = $key;
				        //Iterar por coordenadas
				        foreach ($value["coordenadas"] as $coo) {
				           	$coo_pza = explode(",", $coo);
				            $latitud = $coo_pza[0];
							$longitud = $coo_pza[1];
							$latitud = substr($latitud, 0, strpos($latitud, ".") + 3);
							$longitud = substr($longitud, 0, strpos($longitud, ".") + 3);
								
							if(!isset($coordenadas_por_vehiculo[$llave][$latitud.",".$longitud]))
								$coordenadas_por_vehiculo[$llave][$latitud.",".$longitud] = 0;
							
							if(isset($coordenadas_por_vehiculo[$llave][$latitud.",".$longitud]))
								$coordenadas_por_vehiculo[$llave][$latitud.",".$longitud] += 1;
				        }
					}
					
					if($coordenadas_por_vehiculo != NULL){
						foreach ($coordenadas_por_vehiculo as $key => $value) {
							$llave = $key;
							foreach ($value as $coo) {
								if(!isset($total_coordenadas_por_vehiculo[$llave]["total"]))
									$total_coordenadas_por_vehiculo[$llave]["total"] = 0;
								if(!isset($total_coordenadas_por_vehiculo[$llave]["en_cluster"]))
									$total_coordenadas_por_vehiculo[$llave]["en_cluster"] = 0;
								
								$total_coordenadas_por_vehiculo[$llave]["total"] += $coo;
								
								if($coo >= $tamano_cluster)
									$total_coordenadas_por_vehiculo[$llave]["en_cluster"] += $coo;
							}
						}
					}
				    //FIN: Cluster
				}          
          	}
			//FIN: ++++Obtener datos por vehiculo (tabla de colores)
           
          	ksort($datos_vehiculo);
                
            //Obtener los datos agrupados por periodo
            if($datos_general != NULL){
                foreach($datos_general AS $dato){
                    $datos_periodos[$dato["time_cluster"]]["tiempo_manejo"] += floatval($dato["duracion"]);
                    $datos_periodos[$dato["time_cluster"]]["km_manejo"] += floatval($dato["kilometros"]);
                    $datos_periodos[$dato["time_cluster"]]["consumo"] += floatval($dato["consumo"]);
                    $datos_periodos[$dato["time_cluster"]]["velocidad_promedio"] += floatval($dato["velocidad_promedio"]);
                    //$datos_periodos[$dato["time_cluster"]]["eventos_agresivos"] += floatval($dato["eventos_agresivos"]);
                    
                    if(!in_array($dato["car_id"], $vehiculos[$dato["time_cluster"]])){
                        $datos_periodos[$dato["time_cluster"]]["vehiculos"] += intval(1);
                        array_push($vehiculos[$dato["time_cluster"]], $dato["car_id"]);
						
						$total_vehiculos += 1;
                    }
                    
                    $tiempo_manejo_total += floatval($dato["duracion"]);
					$total_kilometros_manejo += floatval($dato["kilometros"]);
                    
                    
                    //Coordendas
                    if($dato["end_latlon"] != "")
                    	$datos_periodos[$dato["time_cluster"]]["coordenadas"][] = $dato["end_latlon"];
                           
                }
            }
            else{
               $resultado = "Error";
	           $mensaje = "No hay datos";
            }

		}  
         else{
			$resultado = "Error";
	        $mensaje = "Ocurrió un error";
		}
		
        ksort($datos_periodos); 
		
		//Contar alarmas
		foreach ($vehiculos as $key => $value) {
			$llave = $key;
			$carros = "";
			foreach ($value as $valor) {
				$carros .= $valor.", ";
			}	
			$carros = substr($carros, 0, -2);
			
			if($carros != ""){
				$query_alarmas = "SELECT IFNULL(SUM(IF(type = 2 OR type = 4 OR type = 5 OR type = 8,  1, 0)), 0) AS conteo,
										IFNULL(SUM(IF(type = 2, 1, 0)), 0) AS speeding, IFNULL(SUM(IF(type = 4, 1, 0)) , 0) AS acceleration, 
										IFNULL(SUM(IF(type = 5, 1, 0)), 0) AS braking, IFNULL(SUM(IF(type = 8, 1, 0)), 0) AS rpm
									FROM obd_data_1.alarm_data 
									WHERE car_id IN ($carros)
										AND DATE_SUB(d_time, INTERVAL $minute_offset MINUTE) BETWEEN 
														'" . $start_year . "-" . $start_month . "-" . $start_day . " " . $start_hour . ":" . $start_minute . ":" . $start_second . "' 
	                								AND '" . $end_year . "-" . $end_month . "-" . $end_day . " " . $end_hour . ":" . $end_minute . ":" . $end_second . "' ";
				
				switch ($llave) {
					case "A":
						$query_alarmas .= "AND TIME(DATE_SUB(d_time, INTERVAL $minute_offset MINUTE)) > TIME('14:00:00') 
												AND 
												TIME(DATE_SUB(d_time, INTERVAL $minute_offset MINUTE)) <= TIME('18:00:00');";
					break;
						
					case "B":
						$query_alarmas .= "AND TIME(DATE_SUB(d_time, INTERVAL $minute_offset MINUTE)) > TIME('06:00:00') 
												AND 
												TIME(DATE_SUB(d_time, INTERVAL $minute_offset MINUTE)) <= TIME('11:00:00');";
					break;
					
					case "C":
						$query_alarmas .= "AND TIME(DATE_SUB(d_time, INTERVAL $minute_offset MINUTE)) > TIME('11:00:00') 
												AND 
												TIME(DATE_SUB(d_time, INTERVAL $minute_offset MINUTE)) <= TIME('14:00:00');";
					break;
						
					case "D":
						$query_alarmas .= "AND TIME(DATE_SUB(d_time, INTERVAL $minute_offset MINUTE)) >= TIME('00:00:00') 
												AND 
												TIME(DATE_SUB(d_time, INTERVAL $minute_offset MINUTE)) <= TIME('06:00:00');";
					break;
						
					case "E":
						$query_alarmas .= "AND TIME(DATE_SUB(d_time, INTERVAL $minute_offset MINUTE)) > TIME('18:00:00') 
												AND 
												TIME(DATE_SUB(d_time, INTERVAL $minute_offset MINUTE)) <= TIME('23:59:59');";
					break;
					
					default:
					break;
				}
				
				$result_alarmas = $this->query($query_alarmas);
				if($result_alarmas->num_rows > 0){
					$row_alarmas = $result_alarmas->fetch_assoc();
					
					$datos_periodos[$llave]["speed_alerts"] = $row_alarmas["speeding"];
					$datos_periodos[$llave]["hard_breaking"] = $row_alarmas["braking"];
					$datos_periodos[$llave]["hard_acceleration"] = $row_alarmas["acceleration"];
					$datos_periodos[$llave]["rpm"] = $row_alarmas["rpm"];
					$datos_periodos[$llave]["conteo_alarmas"] = $row_alarmas["conteo"];
					
					$total_alarmas += $row_alarmas["conteo"];
				}
			}
		}
		//FIN: Contar alarmas
		
		//Eventos agresivos
		/*foreach ($datos_periodos as $key => $value) {
			$total_eventos_agresivos += ($value["conteo_alarmas"] / $value["km_manejo"]);
		}*/
		//FIN: Eventos agresivos
         
        //Cluster
        //Contamos número de ocurrencias de cada coordenada, truncando a dos decimales primero
        foreach ($datos_periodos as $key => $value) {
        	$llave = $key;
            //Iterar por coordenadas
            foreach ($value["coordenadas"] as $coo) {
            	$coo_pza = explode(",", $coo);
                $latitud = $coo_pza[0];
				$longitud = $coo_pza[1];
				$latitud = substr($latitud, 0, strpos($latitud, ".") + 3);
				$longitud = substr($longitud, 0, strpos($longitud, ".") + 3);
				
				if(!isset($coordenadas[$llave][$latitud.",".$longitud]))
					$coordenadas[$llave][$latitud.",".$longitud] = 0;
				
				if(isset($coordenadas[$llave][$latitud.",".$longitud]))
					$coordenadas[$llave][$latitud.",".$longitud] += 1;
            }
		}
		
		foreach ($coordenadas as $key => $value) {
			$llave = $key;
			foreach ($value as $coo) {
				$total_coordenadas[$llave]["total"] += $coo;
				
				if($coo >= $tamano_cluster)
					$total_coordenadas[$llave]["en_cluster"] += $coo;
			}
		}
        //FIN: Cluster
         
		$salida = json_encode(array("resultado" => $resultado, 
									"datos" => array(
										"mensaje" => $mensaje, 
										//"datos_general" => $datos_general, 
										"periodos" => $datos_periodos, 
										"tiempo_manejo_total" => $tiempo_manejo_total,
										"vehiculos" => $vehiculos,
										"total_vehiculos" => $total_vehiculos,
										"total_viajes" => $total_viajes,
										"total_alarmas" => $total_alarmas,
										"total_kilometros_manejo" => $total_kilometros_manejo,
										//"total_eventos_agresivos" => $total_eventos_agresivos,
										"coordenadas" => $coordenadas,
										"total_coordenadas" => $total_coordenadas,
                                        "vehiculos_color" => $datos_vehiculo,
                                        "coordenadas_vehiculos" => $coordenadas_por_vehiculo,
                                        "total_coordenadas_vehiculos" => $total_coordenadas_por_vehiculo   
									)
								)
							);

        return $salida;
    /*FIN  DE informacionDasboardRiesgos*/
	} 
}
?>