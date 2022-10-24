<?php
//include("clases/session.php");
include_once("clases/ocdsession.php");
$ocdsession = new OCDsession();


    $ocdsession->logout();


header("Location: " . ruta_relativa);
?>