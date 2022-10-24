<?php
//include_once("clases/session.php");
include_once("clases/ocdsession.php");

//Contenido 

$ocdsession = new OCDsession();

if(!$ocdsession->LoggedIn) {
    header('Location: login.php');
    exit();
} //if

$opcion = isset($_GET['op']) ? $_GET['op'] : 'home';
$php_file = $opcion . ".php";
$template = $opcion . ".tpl";

if(file_exists($php_file))
    include($php_file);
//print_r($user->Accesos);

if($ocdsession->LoggedIn) {
    //Le enviamos el PATH DE LA ORGANIZACIÓN DEL USUARIO LOGUEADO
    $smarty->assign('car_path', $ocdsession->Org_Path);
	$smarty->assign('time_offset', $ocdsession->time_offset);
	$smarty->assign('id_usuario', $ocdsession->id);
} //if
$smarty->assign('loggedin', TRUE);
//$smarty->assign('nombre', $user->Nombre);
//$smarty->assign('pais', $user->Pais);
//$smarty->assign('acceso_op', $user->Accesos[3]);
//$smarty->assign('acceso_ap', $user->Accesos[1]);
//$smarty->assign('acceso_rp', 1);

$smarty->display("header.tpl");
$smarty->display($template);
$smarty->display("footer.tpl");
?>
