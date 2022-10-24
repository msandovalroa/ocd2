<?php
/**
* Clase session
* Clase con los métodos para administración de sesión de usuarios en My Luxottica
*
* @package Luxottica
* @version 1.0
* @copyright Madhouse
*/
include_once("config.inc.php");
include_once(common.'database.php');

class OCDsession extends database {
    protected $user_id = NULL;
    private $name = NULL;
    protected $user_name = NULL;
    private $user_password = NULL;
    private $user_fb_id = NULL;
    private $user_li_id = NULL;
    private $user_session_id = NULL;
    protected $o_path = NULL;
	protected $time_offset = NULL;

/**
* Constructor de la clase
*
*/
    function __construct() {
        parent::__construct();
    } //function __construct

/**
* Destructor de la clase; asegura el cierre de las conexiones de base de datos utilizadas
*
*/
    function __destruct() {
        parent::__destruct();
    } //function __destruct

/**
* __get - Devuelve el valor del campo especificado
* @param $fieldname nombre del campo
*
*/
    public function __get($fieldname) {
        switch($fieldname) {
            case 'id': return $this->user_id;
            case 'NickName': return $this->user_name;
            case 'Name': return $this->name;
            case 'Org_Path': return $this->o_path;
            case 'SessionId': return $this->user_session_id;
            case 'LoggedIn': return $this->isLogged();
            case 'ConexDB': return $this->conexMySQL;
            case 'fbJoined': return (!is_null($this->user_fb_id) && !empty($this->user_fb_id));
            case 'liJoined': return (!is_null($this->user_li_id) && !empty($this->user_li_id));
			case 'time_offset': return $this->time_offset;
        } //switch

        $trace = debug_backtrace();
        throw new Exception(
            'Undefined property via __get(): ' . $fieldname .
            ' in ' . $trace[0]['file'] .
            ' on line ' . $trace[0]['line'],
            E_USER_NOTICE);
        return null;
    } //public function __get
    
    
/**
* isLogged - Indica si el usuario a iniciado sesión
*
*
*/
    private function isLogged() {
        if(is_null($this->user_session_id))
            return ($this->cookieSession());
        return TRUE;
    } //private function isLogged
    
/**
* cookieSession - Verifica si el usuario tiene sesión activa en navegador
*
*
*/
    private function cookieSession() {
        if(isset($_COOKIE['session_remember'])){
            $this->user_name = $_COOKIE['session_u'];
            $this->user_password = $_COOKIE['session_p'];

            if($this->isUserValid($this->user_name, $this->user_password)) {
                $this->setSession();
                return TRUE;
            } //if
        } //if
        return FALSE;
    } //private function cookieSession
    
/**
* isUserValid - Verifica si el usuario existe y su contraseña es correcta
*
*
*/
    private function isUserValid($user, $encrypt_password) {
    	$user = $this->cleanQuery($user);
        // Consulta el usuario
        
        $sql = "SELECT b_Id, b_userName, b_password, b_name, b_email, org_path, b_timeZone 
        			FROM obd_config.TBaseUser 
        			WHERE b_userName = '$user' 
        			AND b_password = '$encrypt_password' 
        			AND b_status BETWEEN 1 AND 2 
        			LIMIT 1;";
        //Status -1 borrado, 0 deshabilitado, 1 normal, 2 discapacitado. ????? 
        
        if($this->debug) trigger_error($sql);
        try {
            //$results = $this->conexMySQL->query($sql);
			$results = $this->query($sql);
            if($results) {
                if($results->num_rows) {
                    $this->setUserData($results);
                    $results->free();
                    return TRUE;
                } //if
            } //if
        } catch( Exception $ex ) {
            throw new Exception($ex->getMessage());
        } //try

        return FALSE;
    } //private function isUserValid

/**
* setUserData - Verifica si el usuario existe y su contraseña es correcta
* @param $results objeto con resultados del query
*
*
*/
    private function setUserData($results) {
        $data = $results->fetch_assoc();
        $this->user_id = $data['b_Id'];
        $this->user_name = $data['b_userName'];
        $this->user_password = $data['b_password'];
        $this->name = $data['b_name'];
        $this->o_path = $data['org_path'];
		$this->time_offset = $data["b_timeZone"];
        //$this->user_fb_id = $data['user_fb_id'];
        //$this->user_li_id = $data['user_li_id'];
    } //private function setUserData
    
    
/**
* loginByUser - Inicia sesión con el usuario y contraseña especificados
*
*
*/
    public function loginByUser($user, $password) {
        $this->user_name = $user;
        $this->user_password = $this->encrypt($password, 'md5');

        if($this->isUserValid($this->user_name, $this->user_password)) {
            $this->setSession();
            return TRUE;
        } //if

        return FALSE;
    } //public function loginByUser
    
/**
* setSession - Inicializa la sessión de usuario
*
*
*/
    private function setSession() {
        // Crea nueva sesión en My
        @session_start();
        $this->user_session_id = session_id();

        // Variables de sesión
        $_SESSION['user_id'] = $this->id;
        $_SESSION['username'] = $this->user_name;
        $_SESSION['password'] = $this->user_password;
        $_SESSION['ssid'] = $this->user_session_id;
        
        /*
        // Actualiza ID de sesión en registro de usuario
        $sql = "UPDATE master_usuarios SET usuario_ssid = '$this->user_session_id' WHERE usuario_user = '$this->user_name' AND usuario_password = '$this->user_password' LIMIT 1;";
        if($this->debug) trigger_error($sql);
        try {
            $this->query($sql);
        } catch(Exception $ex) {
            trigger_error($ex->getMessage());
        } //try
        */

        // Establece valores de sesión en navegador
        /*
        setcookie("session_u", $this->user_name, COOKIE_TIME, "/", DOMINIO);
        setcookie("session_p", $this->user_password, COOKIE_TIME, "/", DOMINIO);
        setcookie("session_remember", 'true', COOKIE_TIME, "/", DOMINIO);
        */
        setcookie("session_u", $this->user_name, COOKIE_TIME);
        setcookie("session_p", $this->user_password, COOKIE_TIME);
        setcookie("session_remember", 'true', COOKIE_TIME); 
        
    } //private function cookieSession
    
/**************************************************************************************************************************************************************************************************/

/**
* isUserFound; Verifica si el usuario proporcionado existe en registro
* @param string $user_name; nombre del usuario a verificar
*
* 
*/
    private function isUserFound($email) {
        $sql = "SELECT usuario_id FROM master_usuarios WHERE usuario_email = '$email' LIMIT 1;";
        if($this->debug) trigger_error($sql);
        try {
            $results = $this->query($sql);
            if($results) {
                if($results->num_rows) {
                    $results->free();
                    return TRUE;
                } //if
                $results->free();
            } //if
        } catch( Exception $ex ) {
            throw new Exception($ex->getMessage());
        } //try
        
        return FALSE;
    } //public function userExist



/**
* isSocialValid - Verifica si el ID de Red Social proporcionado existe
*
* 
*/
    private function isSocialValid($db_field, $fb_user_id) {
        // Consulta el usuario
        $sql = "SELECT user_id, user_usrname, user_password, user_name, user_fb_id, user_li_id FROM users WHERE $db_field = '$fb_user_id' LIMIT 1";
        if($this->debug) trigger_error($sql);
        try {
            $results = $this->query($sql);
            if($results) {
                if($results->num_rows) {
                    $this->setUserData($results);
                    $results->free();
                    return TRUE;
                } //if
            } //if
        } catch( Exception $ex ) {
            throw new Exception($ex->getMessage());
        } //try

        return FALSE;
    } //private function isSocialValid



/**
* linkSocial - Relaciona registro My con ID del usuario de red social
*
* 
*/
    private function linkSocial($db_field, $social_id, $user_name) {
        $sql = "UPDATE users SET $db_field = '$social_id' WHERE user_usrname= '$user_name' LIMIT 1";
        if($this->debug) trigger_error($sql);

        try {
            $this->query($sql);
        } catch(Exception $ex) {
            throw new Exception($ex->getMessage());
        } //try
    } //private function linkSocial

/**
* loginByUserAJAX - Inicia sesión con Facebook proporcionado
*
* 
*/
    public function loginByUserAJAX($parametros) {
        $code = FALSE;
        $content = "Iniciando sesi&oacute;n...";
        
        $code = $this->loginByUser($parametros['user_name'], $parametros['user_password']);

        return json_encode( $feed=array("response" => $code, "content" => $content) );
    } //public function forceloginByFB

/**
* forceloginByFB - Inicia sesión con Facebook proporcionado
*
* 
*/
    public function forceloginByFB($parametros) {
        $code = FALSE;
        $content = "No se encontr&oacute; registro para su correo electr&oacute;nico de Facebook, inicie sesi&oacute;n manualmente para relacionar su registro";
        
        if($this->isUserFound($parametros['fb_email'])) {
            $this->linkSocial('user_fb_id', $parametros['fb_user_id'], $parametros['fb_email']);
            if($this->isSocialValid('user_fb_id', $parametros['fb_user_id'])) {
                $this->setSession();
                $code = TRUE;
                $content = "";
            } //if
        } //if

        return json_encode( $feed=array("response" => $code, "content" => $content) );
    } //public function forceloginByFB

/**
* loginByFB - Inicia sesión con el ID de Facebook proporcionado
*
* 
*/
    public function loginByFB($parametros) {
        $content = FALSE;
        if($this->isSocialValid('user_fb_id', $parametros['fb_user_id'])) {
            $this->setSession();
            $content = TRUE;
        } //if

        return json_encode( $feed=array("response" => "OK", "content" => $content) );
    } //public function loginByFB

/**
* forceloginByLI - Inicia sesión con el ID de LinkedIn proporcionado
*
* 
*/
    public function forceloginByLI($parametros) {
        $code = FALSE;
        $content = "No se encontr&oacute; registro para su correo electr&oacute;nico de Facebook, inicie sesi&oacute;n manualmente para relacionar su registro";
        if($this->isUserFound($parametros['li_email'])) {
            $this->linkSocial('user_li_id', $parametros['li_user_id'], $parametros['li_email']);
            if($this->isSocialValid('user_li_id', $parametros['li_user_id'])) {
                $this->setSession();
                $code = TRUE;
                $content = "";
            } //if
        } //if

        return json_encode( $feed=array("response" => $code, "content" => $content) );
    } //public function forceloginByLI

/**
* loginByLI - Inicia sesión con el ID de LinkedIn proporcionado
*
* 
*/
    public function loginByLI($parametros) {
        $content = FALSE;
        if($this->isSocialValid('user_li_id', $parametros['li_user_id'])) {
            $this->setSession();
            $content = TRUE;
        } //if

        return json_encode( $feed=array("response" => "OK", "content" => $content) );
    } //public function loginByLI

/**
* onSession - Verifica si el usuario tiene sesión activa en My
*
* 
*/
    private function onSession() {
        @session_start();

        //Check if user is logged on Luxottica 
        if(isset($_SESSION['username']) && isset($_SESSION['password'])){
            $this->user_name = $_SESSION['username'];
            $this->user_password = $_SESSION['password'];
            $this->user_session_id = $_SESSION['ssid'];

            if($this->isUserValid($this->user_name, $this->user_password)) {
                $sql = "SELECT usuario_id FROM master_usuarios WHERE usuario_user = '$this->user_name' AND usuario_ssid = '$this->user_session_id' LIMIT 1";
                error_log($sql);
                if($this->debug) trigger_error($sql);
                try {
                    $results = $this->query($sql);
                    if($results) {
                        $results->free();
                        $this->setSession();
                        return TRUE;
                    } //if
                } catch( Exception $ex ) {
                    throw new Exception($ex->getMessage());
                } //try
            } //if
            $this->destroySession();
        } //if
        return FALSE;
    } //private function onSession

/**
* destroySession - Destruye valores de sesión en My
*
* 
*/
    private function destroySession() {
        session_unset();
        session_destroy();
    } //private function destroySession

/**
* destroyCookieSession - Destruye valores de sesión en el navegador
*
* 
*/
    private function destroyCookieSession() {
        setcookie("session_u", '', -(COOKIE_TIME), "/", DOMINIO);
        setcookie("session_p", '', -(COOKIE_TIME), "/", DOMINIO);
        setcookie("session_remember", '', -(COOKIE_TIME), "/", DOMINIO);
        unset($_COOKIE['session_u']);
		setcookie('session_u', '', time() - 3600);
        unset($_COOKIE['session_p']);
		setcookie('session_p', '', time() - 3600);
        unset($_COOKIE['session_remember']);
		setcookie('session_remember', '', time() - 3600);
    } //private function destroyCookieSession

/**
* loginByUser - Finaliza la sesión del usuario
*
* 
*/
    public function logout() {
        $this->destroySession();
        $this->destroyCookieSession();
    } //public function logout

/**
* userExist; Verifica si el usuario proporcionado existe en registro
* @param string $parametros; datos de usuario para verificar
*
* 
*/
    public function userExist($parametros) {
        $code = "ERR";
        $content = "";
        if($this->isUserFound($parametros['user_name'])) {
            $code = "OK";
            $content = "El usuario <strong> " . $parametros['user_name'] . "<strong> ya existe en el sistema.";
        } //if
        
        return json_encode( $feed=array("response" => $code, "content" => $content) );
    } //public function userExist

/**
* joinFB; Relaciona ID de Facebook a registro de usuario
* @param string $parametros; ID de Facebook a relacionar
*
* 
*/
    public function joinFB($parametros) {
        $code = "ERR";
        $content = "No ha iniciado sesi&oacute;n en el sistema";
        if($this->LoggedIn) {
            $this->linkSocial('user_fb_id', $parametros['fb_user_id']);

            if($this->isSocialValid('user_fb_id', $parametros['fb_user_id'])) {
                $code = "OK";
                $content = "Ahora puede iniciar sesi&oacute;n usando Facebook.";
            } else {
                $content = "Error al relacionar su registro, intente m&aacute;s tarde.";
            } //if
        } //if
        
        return json_encode( $feed=array("response" => $code, "content" => $content) );
    } //public function userExist

/**
* joinLI; Relaciona ID de LinkedIn a registro de usuario
* @param string $parametros; ID de Facebook a relacionar
*
* 
*/
    public function joinLI($parametros) {
        $code = "ERR";
        $content = "No ha iniciado sesi&oacute;n en el sistema";
        if($this->LoggedIn) {
            $this->linkSocial('user_li_id', $parametros['li_user_id']);

            if($this->isSocialValid('user_li_id', $parametros['li_user_id'])) {
                $code = "OK";
                $content = "Ahora puede iniciar sesi&oacute;n usando LinkedIn.";
            } else {
                $content = "Error al relacionar su registro, intente m&aacute;s tarde.";
            } //if
        } //if
        
        return json_encode( $feed=array("response" => $code, "content" => $content) );
    } //public function joinLI

/**
* setPassword; Asigna contraseña de usuario
* @param string $parametros; nueva contraseña
*
* 
*/
    private function setPassword($password, $user = NULL) {
        $user = is_null($user) ? $this->user_name : $user;
        $pass = $this->encrypt($this->encrypt($this->encrypt($this->encrypt($password, 'md5')), 'md5'));
        $sql = "UPDATE master_usuarios SET usuario_password = '$pass' WHERE usuario_email = '$user' LIMIT 1";
        if($this->debug) trigger_error($sql);
        try {
            $this->query($sql);
            return TRUE;
        } catch(Exception $ex) {
            trigger_error($ex->getMessage());
        } //try
        
        return FALSE;
    } //private function setPassword

/**
* changePassword; Modifica contraseña de usuario
* @param string $parametros; dirección de correo electrónico
*
* 
*/
    public function changePassword($parametros) {
        $code = "ERR";
        $content = "Ocurri&oacute; un error inesperado, favor de volver a intentar.";
        if($this->LoggedIn && $this->loginByUser($this->user_name, $parametros['user_password'])) {
            if($this->setPassword($parametros['new_password'])) {
                if($this->loginByUser($this->user_name, $parametros['new_password'])) {
                    $code = "OK";
                    $content = "Su contrase&ntilde;a ha sido modificada.";
                } //if
            } //if
        } else {
            $content = "La contrase&ntilde;a actual es incorrecta, por favor verifique.";
        } //if
        
        return json_encode( $feed=array("response" => $code, "content" => $content) );
    } //public function changePassword

    private function rndPassword() {
	    $acceptedChars = 'azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN0123456789';
	    $max = strlen($acceptedChars)-1;
	    $code = null;
	    for($i=0; $i < 12; $i++) { $code .= $acceptedChars{ mt_rand(0, $max) }; } //for
	    $ttcode = $code . time();
	    $ttcodef = substr($ttcode,2,10);

        return $ttcodef;
    } //function rndPassword

/**
* sendPassword; Envía contraseña a correo electrónico
* @param string $parametros; dirección de correo electrónico
*
* 
*/
    public function sendPassword($parametros) {
        $code = "ERR";
        $content = "Correo electr&oacute;nico no registrado";
        $email = urldecode($parametros['email']);
        if($this->isUserFound($email)) {
            // Envía notificación al suscriptor
            $this->tmp_password = $this->rndPassword();
            if($this->setPassword($this->tmp_password, $email)) {
                $code = "OK";
                $content = "Por favor revise su correo electr&oacute;nico";
            } //if
        } //if
        
        return json_encode( $feed=array("response" => $code, "content" => $content) );
    } //public function sendPassword
} //class Session
?>