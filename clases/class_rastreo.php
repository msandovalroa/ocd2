<?php

include("config.inc.php"); 
include "../common/database.php";
include("utilidades.php");
class rastreo extends database {
        
   function __construct() {
      parent::__construct();
   }
        
   function __destruct() {
		parent::__destruct();
   }
  
  public function lista_grupo($parms){
	 $utilidades=new utilidades(); 
	 $car_path=$parms["car_path"];
	 $qry_grupos="SELECT obd_config.TOrganization.o_id, obd_config.TOrganization.o_name
	                FROM obd_config.TCars 
	                    INNER JOIN obd_config.TOrganization
	                        ON obd_config.TCars.o_path = obd_config.TOrganization.o_path 
	                WHERE obd_config.TCars.o_path LIKE '". $car_path ."%' GROUP BY o_name;";
	 $res_grupos=$this->query($qry_grupos);
	 $salida= array();
	   if ($res_grupos){
		   $salida["code"]="OK";
		   while($ar_grupos=$res_grupos->fetch_assoc()){
		         $salida["data"][]=$utilidades->utf8_converter($ar_grupos);
		    }//while
		}//if 
		else{
			 $salida["code"]="ER";
			 $salida["data"]=$utilidades->utf8_converter("ocurrio un error");
		}	
	  return json_encode($salida);
	}

	public function vehiculos($params){
		
		$c_id = $params["c_id"];
		//error_log($c_id);
	 $utilidades=new utilidades(); 
	 $carro_id=$c_id;
	 $qry_autos="SELECT obd_config.TCars.c_id AS 'car_id',
			obd_config.TCars.c_vehicleNO AS 'nick',
			trip_data.end_latlon as 'final',
			MAX(obd_data_1.trip_data.end_time) as 'cuando'
			FROM obd_config.TCars 
			INNER JOIN obd_data_1.trip_data
			ON obd_config.TCars.c_id = obd_data_1.trip_data.car_id
			WHERE obd_config.TCars.c_id 
			IN (". $carro_id .")
			AND trip_data.end_latlon != ''
			GROUP BY obd_config.TCars.c_id
			ORDER BY cuando;";
//error_log($qry_autos);
	 $res_grupos=$this->query($qry_autos);
	 $salida= array();
	   if ($res_grupos){
		   $salida["code"]="OK";
		   while($ar_grupos=$res_grupos->fetch_assoc()){
		         $salida["data"][]=$utilidades->utf8_converter($ar_grupos);
		    }//while
		}//if 
		else{
			 $salida["code"]="ER";
			 $salida["data"]=$utilidades->utf8_converter("ocurrio un error");
		}	
	  return json_encode($salida);
	}

	public function arbol($parms){
	 $utilidades=new utilidades(); 
	 $car_path=$parms["car_path"];
	 $id_usuario=$parms["id_usuario"];
		 $qry_arbol="SELECT obd_config.TOrganization.o_name, obd_config.TCars.c_vehicleNO, c_id AS 'car_id', 
		(SELECT tor.o_name FROM obd_config.TBaseUser AS tba LEFT JOIN obd_config.TOrganization AS tor ON tba.org_path = tor.o_path WHERE tba.b_id = '".$id_usuario."') 
		AS EL_MASTER FROM obd_config.TCars INNER JOIN obd_config.TOrganization ON obd_config.TCars.o_path = obd_config.TOrganization.o_path 
		left join obd_config.TBaseUser on obd_config.TCars.o_path=obd_config.TBaseUser.org_path WHERE obd_config.TCars.o_path LIKE '". $car_path ."%'
		group by car_id order by o_name;";
		//error_log($qry_arbol);
	 $res_arbol=$this->query($qry_arbol);
	 
	   if ($res_arbol){
	   		$result["code"]="OK";
	   		$arbol = array(
	   			"title" => "DESAMOX",
	   			"key" => "1",
	   			"expand"=> true,
	   			"children" => array()
	   		);
		   while ($arrayo = $res_arbol->fetch_array(MYSQLI_BOTH)){
		   	$array = $utilidades->utf8_converter($arrayo);
		   	
		   	$existe = false;
		   	foreach ($arbol["children"] as $child) {
		   		if($child["title"] == $array["o_name"]){
		   			$existe = true;
		   		}
		   	}

		   	if(!$existe){
		   		array_push($arbol["children"], array("title" => $array["o_name"],"key" => "1", "children" => array()));
		   	}
		   	/*if(!$existe){
		   		array_push($arbol["children"], array("title" => $array["o_name"], "expand" => true, "children" => array()));
		   	}*/

		   	foreach ($arbol["children"] as $key => $value) {
		   		if($value["title"] == $array["o_name"]){
		   			array_push($arbol["children"][$key]["children"], array("title" => $array["c_vehicleNO"],"key" => $array["car_id"]));
		   		}
		   	}	   
	            }

	          $result["data"]=$arbol;
		}//if 
		else{
			 $result["code"]="ER";
			 $result["data"]=$utilidades->utf8_converter("ocurrio un error");
		}	
	  return json_encode($result);
	  
	} //funcion arbol

	public function tabla($params){
		$c_id = $params["c_id"];
		//error_log($c_id);
	 $utilidades=new utilidades(); 
	 $carro_id=$c_id;
	 //$year=date("Y");
	 $year=2015;
	 //error_log($year);
	  $qry_tabla="SELECT c_id, c_vehicleNO, o_name, MAX(end_time) as final, end_addr, obd_data_1.trip_data.status, 
				 (SELECT IFNULL(IF(obd_data_1.gps_data_". $year .".latitude_way = 1 AND obd_data_1.gps_data_". $year .".longitude_way = 1, 'NE', 
				 IF(obd_data_1.gps_data_". $year .".latitude_way = 1 AND obd_data_1.gps_data_". $year .".longitude_way = 0, 'NO', 
				 IF(obd_data_1.gps_data_". $year .".latitude_way = 0 AND obd_data_1.gps_data_". $year .".longitude_way = 1, 'SE', 
				 IF(obd_data_1.gps_data_". $year .".latitude_way = 0 AND obd_data_1.gps_data_". $year .".longitude_way = 0, 'SO', '') ) ) ), '-')
				 FROM obd_data_1.gps_data_". $year ." WHERE  obd_data_1.gps_data_". $year .".car_id=obd_config.TCars.c_id
				  AND collect_datetime = (SELECT MAX(collect_datetime) FROM obd_data_1.gps_data_". $year ." WHERE car_id = obd_config.TCars.c_id)) AS direccion,
				(SELECT speed
				 FROM obd_data_1.gps_data_". $year ." WHERE  obd_data_1.gps_data_". $year .".car_id=obd_config.TCars.c_id
				  AND collect_datetime = (SELECT MAX(collect_datetime) FROM obd_data_1.gps_data_". $year ." WHERE car_id = obd_config.TCars.c_id)) as speed
				 
				                 FROM obd_config.TCars 
				                     INNER JOIN obd_config.TOrganization
				                         ON obd_config.TCars.o_path = obd_config.TOrganization.o_path 
				                     INNER JOIN obd_data_1.trip_data
				                         ON obd_config.TCars.c_id = obd_data_1.trip_data.car_id
				                 WHERE obd_config.TCars.c_id IN (". $carro_id .")
				group by c_id;";
		//error_log($qry_tabla);
	 $res_tabla=$this->query($qry_tabla);
	 $salida_tabla= array();
	   if ($res_tabla){
		   $salida_tabla["code"]="OK";
		   //error_log("res tabla true");
		   while($ar_tabla=$res_tabla->fetch_assoc()){
		         $salida_tabla["data"][]=$utilidades->utf8_converter($ar_tabla);
		    }//while
		}//if 
		else{
			//error_log("res tabla false");
			 $salida_tabla["code"]="ER";
			 $salida_tabla["data"]=$utilidades->utf8_converter("ocurrio un error");
		}	
	  return json_encode($salida_tabla);
	}//funcion tabla



	public function tabla_alertas($params){
		$c_id = $params["c_id"];
		$time_offset = $params["time_offset"];
	 $utilidades=new utilidades(); 
	 $carro_id=$c_id;
	 //$year=date("Y");
	 $year=2015;
	 $date = isset($_GET['date']) ? $_GET['date'] : date("Y-m-d H:i:s");
	 $ayer        = date("Y-m-d H:i:s", strtotime($date .' -1 day'));
	 $qry_tabla_alerta="SELECT  car_id, d_time_d, c_vehicleNO, IFNULL(SUM(IF(type = 2 OR type = 4 OR type = 5 OR type = 8, 1, 0)), 0) AS conteo, IFNULL(SUM(IF(type = 2, 1, 0)), 0) AS speeding, IFNULL(SUM(IF(type = 4, 1, 0)) , 0)AS acceleration, IFNULL(SUM(IF(type = 5, 1, 0)), 0) AS braking, IFNULL(SUM(IF(type = 8, 1, 0)), 0) AS rpm FROM obd_data_1.alarm_data INNER JOIN obd_config.TCars
			ON obd_data_1.alarm_data.car_id =obd_config.TCars.c_id  WHERE car_id IN ( '" .$carro_id. "' ) AND TIMESTAMP(DATE_SUB(d_time, INTERVAL '" .$time_offset. "' MINUTE)) BETWEEN '" .$date. "' AND '" .$ayer. "'  ;";
		error_log($qry_tabla_alerta);
	 $res_tabla_alerta=$this->query($qry_tabla_alerta);
	 $salida_tabla_alerta= array();
	   if ($res_tabla_alerta){
		   $salida_tabla_alerta["code"]="OK";
		   while($ar_tabla_alerta=$res_tabla_alerta->fetch_assoc()){
		         $salida_tabla_alerta["data"][]=$utilidades->utf8_converter($ar_tabla_alerta);
		    }//while
		}//if 
		else{
			//error_log("res tabla false");
			 $salida_tabla_alerta["code"]="ER";
			 $salida_tabla_alerta["data"]=$utilidades->utf8_converter("ocurrio un error");
		}	
	  return json_encode($salida_tabla_alerta);
	}//funcion tabla


	}// class rastreo
?> 