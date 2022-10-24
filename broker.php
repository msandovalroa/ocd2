<?php
/**
* Gestor de clases
* Mediante el patron Factory instancia cada clase.
* Recibe y envia los datos.
* @version: 1.1 (optimiza gestion de errores)
* @version: 1.2 (instanciar clase)

*/
include(getcwd()."/../common/mh_broker.php");
$broker = new MadHouseBroker;
$broker->service();
?>