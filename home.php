<?php
include_once("clases/ocdsession.php");

if(is_string($smarty)){
   die($smarty);
} //if

$user = "";
$mensaje = "";

$ocdsession = new OCDsession();

if($ocdsession->LoggedIn) {
    //Le enviamos el PATH DE LA ORGANIZACIÓN DEL USUARIO LOGUEADO
    $smarty->assign('car_path', $ocdsession->Org_Path);
} //if


//Contenido 
$smarty->assign('loggedin', FALSE);
$smarty->assign('user', $user);
$smarty->assign('mensaje', $mensaje);

?>