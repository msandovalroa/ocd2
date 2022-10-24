<?php
include_once("clases/ocdsession.php");

if(is_string($smarty)){
   die($smarty);
} //if

$user = "";
$mensaje = "";

$ocdsession = new OCDsession();
//$ocdsession->setSite(APISITE);

if(isset($_POST['user_name']) && isset($_POST['user_password'])) {
    $user = $_POST['user_name'];
    $pass = $_POST['user_password'];
    if(!$ocdsession->loginByUser($user, $pass))
        $mensaje = "Usuario o contrase&ntilde;a incorrectos...";
} //if


if($ocdsession->LoggedIn) {
    header("Location: " . ruta_relativa);
    exit();
} //if


//Contenido 
$smarty->assign('loggedin', FALSE);
$smarty->assign('user', $user);
$smarty->assign('mensaje', $mensaje);

$smarty->display("header.tpl");
$smarty->display("login.tpl");
$smarty->display("footer.tpl");
?>