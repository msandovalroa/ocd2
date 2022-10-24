<?php
/*
 * Establecer los parametros del motor de plantillas. Incluye tambien constantes sobre rutas.
 * @version 1.0
 */
$smarty = NULL;

//Error reporting
//error_reporting(E_ERROR | E_PARSE);

/*
*Rutas del sistema
*/

// PRODUCCION
/*
if(!defined("MY_SMARTY")) define("MY_SMARTY", "F:/Smarty/");
if(!defined("PROYECTO")) define("PROYECTO", "ocd/dashboard");
if(!defined("ruta_relativa")) define("ruta_relativa", "http://localhost/ocd/dashboard/");
*/

if(!defined("MY_SMARTY")) define("MY_SMARTY", "/Applications/XAMPP/xamppfiles/htdocs/smarty");//aqui va la ruta
if(!defined("PROYECTO")) define("PROYECTO", "OCDDASHBOARD4");
if(!defined("ruta_relativa")) define("ruta_relativa", "http://localhost/OCD/OCD2");
if(!defined("ruta_absoluta")) define("ruta_absoluta", dirname(__FILE__)."/");
if(!defined("common")) define("common", ruta_absoluta."../common/");
if(!defined("inc")) define("inc", ruta_absoluta."inc/");

//COOKIES
//if(!defined("DOMINIO")) define("DOMINIO", ruta_relativa); NOT LOCALHOST
if(!defined("COOKIE_TIME")) define("COOKIE_TIME", time() + (86400 * 30));

//Necesario para la API de OCD
if(!defined("APISITE")) define("APISITE", "http://www.onclouddiagnostics.com:80/api/");

/*if(!defined("MY_SMARTY")) define("MY_SMARTY", "../Smarty/");
if(!defined("PROYECTO")) define("PROYECTO", "OCDDASHBOARD");
if(!defined("ruta_relativa")) define("ruta_relativa", "http://dashboard-ocd2.com/");
if(!defined("ruta_absoluta")) define("ruta_absoluta", dirname(__FILE__)."/");
if(!defined("common")) define("common", ruta_absoluta."../common/");
if(!defined("inc")) define("inc", ruta_absoluta."inc/");

//COOKIES
if(!defined("DOMINIO")) define("DOMINIO", ruta_relativa); //NOT LOCALHOST
if(!defined("COOKIE_TIME")) define("COOKIE_TIME", time() + (86400 * 30));

//Necesario para la API de OCD
if(!defined("APISITE")) define("APISITE", "http://www.onclouddiagnostics.com:80/api/");*/

/*
* Configuraciones especificas para la integracion con mail_chimp
*/
//define("url",'https://webservice.s6.exacttarget.com/etframework.wsdl');
define("apikey",'12dccc2e8b042d109f481acb9429066d-us8');

//DB
//Nombre, url o dirección IP del servidor de base de datos
if(!defined('SERVER')) define("SERVER", "localhost");
//Nombre de usuario
if(!defined("DB_USER")) define("DB_USER", "root");
//Contraseña de acceso
//if(!defined("PASSWORD")) define("PASSWORD", "Ht141421");
if(!defined("PASSWORD")) define("PASSWORD", "");
//Schema o Base de datos por omisión
if(!defined("DATABASE")) define("DATABASE", "obd_config");

/*if(!defined('SERVER')) define("SERVER", "172.31.15.41");
//Nombre de usuario
if(!defined("DB_USER")) define("DB_USER", "root");
//Contraseña de acceso
if(!defined("PASSWORD")) define("PASSWORD", "Ht141421");
//Schema o Base de datos por omisión
if(!defined("DATABASE")) define("DATABASE", "obd_config");*/

/*
 * Configuracion de Smarty
 */
if (file_exists(MY_SMARTY . 'libs/Smarty.class.php')) {
    require(MY_SMARTY . 'libs/Smarty.class.php');
    $smarty = new Smarty;
    $smarty->compile_dir = MY_SMARTY .'crm/compile/';
    $smarty->cache_dir = MY_SMARTY .'crm/cache';
    $smarty->config_dir = 'plantillas/configs/';
    $smarty->template_dir = 'plantillas/sistema';
} else {
    echo(MY_SMARTY);
    die("Ocurrio un error de carga de smarty");
} //if
?>