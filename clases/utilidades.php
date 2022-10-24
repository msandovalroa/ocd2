<?php
/**
* Clase Utilidades
* Clase con métodos para apoyo con operaciones
*
* @package luxottica.rh
* @version 1.0
* @copyright Madhouse
*/
	class utilidades {
		/**
		 * utf8_converter - Encoding de un array en UTF 8
		*/
	    function utf8_converter($array){
	        array_walk_recursive($array, function(&$item, $key){
	            if(!mb_detect_encoding($item, 'utf-8', true)){
	            	$item = utf8_encode($item);
	            }
	        });
	        return $array;
	    }
		/* ノ(ಠ_ಠノ ) utf8_converter ノ(ಠ_ಠノ;) */
		
		/**
		 * Generate a random string, using a cryptographically secure 
		 * pseudorandom number generator (random_int)
		 * 
		 * For PHP 7, random_int is a PHP core function
		 * For PHP 5.x, depends on https://github.com/paragonie/random_compat
		 * 
		 * @param int $length      How many characters do we want?
		 * @param string $keyspace A string of all possible characters
		 *                         to select from
		 * @return string
		 */
		function random_str($length = 16){
			if(file_exists("clases/random_compat/random.php"))
				include "clases/random_compat/random.php";
			else include "../clases/random_compat/random.php";
			
		    $str = '';
			$keyspace = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		    $max = mb_strlen($keyspace, '8bit') - 1;
		    for ($i = 0; $i < $length; ++$i) {
		        $str .= $keyspace[random_int(0, $max)];
		    }
		    return $str;
		}
		/* ノ(ಠ_ಠノ ) random_str ノ(ಠ_ಠノ;) */
		
		/**
		 * insertarLog - inserta registro en log de transacciones
		 * $conexion - la conexión a base de datos. Objeto MYSQL
		 * $query - El query a guardar. TEXT
		 * $error - Error generado, 'NO' si no lo hubo. TEXT
		*/
	    function insertarLog($conexion, $query, $error){
	    	$insertado = TRUE;
	        $query_transaccion = "INSERT INTO log_transacciones(query_transaccion, error)
	        						VALUES('".$conexion->cleanQuery($query)."', '".$conexion->cleanQuery($error)."');";
			try {
				$conexion->query($query_transaccion);
			} 
			catch (Exception $e) {
				$insertado = FALSE;
				$respuesta = $e->getMessage();
			}
	        
	        return $insertado;
	    }
		/* ノ(ಠ_ಠノ ) insertarLog ノ(ಠ_ಠノ;) */
	}
?>