<?php
/**
* Clase Suscripcion
* Clase con los métodos para administrar el registro de suscriptores a My Luxottica
*
* @package Luxottica
* @version 1.0
* @copyright Madhouse
*/
include_once('session.php');

class Users extends Session {
    protected $record_loaded = FALSE;
    protected $nombre = NULL;
    private $email = NULL;
	private $next_mail = NULL;
    private $pais = NULL;
    private $nivel = NULL;
    private $password = NULL;
    private $tmp_password = NULL;
    private $accesos = array(FALSE, FALSE, FALSE, FALSE);
    private $foto =  NULL;
    private $activo = NULL;
    private $auditoria = NULL;

/**
* Constructor de la clase
*
* 
*/
    function __construct($user_id = 0) {
        parent::__construct();

        if($user_id > 0) {
            $this->user_id = $user_id;
            $this->readRecord();
        } //if
    } //function __construct

/**
* Destructor de la clase; asegura el cierre de las conexiones de base de datos utilizadas
*
* 
*/
    function __destruct() {
        parent::__destruct();
    } //function __destruct

/**
* __get - Devuelve el valor del campo especificado
* @param $fieldname nombre del campo
*
* 
*/
    public function __get($fieldname) {
        if(!$this->record_loaded && !is_null($this->user_id))
            $this->readRecord();

        switch($fieldname) {
            case 'Nombre': return trim($this->nombre);
            case 'eMail': return trim($this->email);
			case 'nMail': return trim($this->next_mail);
            case 'Pais': return $this->pais;
            case 'Nivel': return $this->nivel;
            case 'Activo': return $this->activo;
            case 'Accesos': return $this->accesos;
            case 'Foto': return trim($this->foto);
            case 'Auditoria': return $this->auditoria;
			default: return parent::__get($fieldname);
        } //switch
    } //public function __get

/**
* __set - Asigna el valor del campo especificado
* @param $fieldname nombre del campo
* @param $fieldvalue valor para el campo
*
* 
*/
    public function __set($fieldname, $fieldvalue) {
        switch($fieldname) {
            case 'Nombre': $this->nombre = $fieldvalue; break;
            case 'eMail': $this->email = $fieldvalue; break;
            case 'Pais': $this->pais = $fieldvalue; break;
            case 'Nivel': $this->nivel = $fieldvalue; break;
            case 'Accesos': $this->accesos = $fieldvalue; break;
            case 'Foto': $this->foto = $fieldvalue; break;
        } //switch

        $trace = debug_backtrace();
        throw new Exception(
            'Undefined property via __get(): ' . $fieldname .
            ' in ' . $trace[0]['file'] .
            ' on line ' . $trace[0]['line'],
            E_USER_NOTICE);
        return null;
    } //public function __set

/**
* readRecord - Lee el registro completo del suscriptor
*
* 
*/
    protected function readRecord() {
        // Recupera registro MySQL
        $sql = "SELECT * FROM master_usuarios WHERE usuario_id = $this->user_id LIMIT 1;";
        if($this->debug) trigger_error($sql);
        try {
            $results = $this->conexMySQL->query($sql);
            $mysql_data = $results->fetch_assoc();
            $this->setDataMySQL($mysql_data);
            $results->free();
        } catch(Exception $ex) {
            throw new Exception($ex->getMessage());
        } //try
        
        $this->record_loaded = TRUE;
    } //private function readRecord

/**
* assembleMySQL - Ensambla sentencia SQL para insertar nuevo registro
*
* 
*/
    private function assembleMySQLInsert() {
        $sql = "INSERT INTO master_usuarios (usuario_user, usuario_password, pais_id, usuario_nivel, usuario_nombre, usuario_email, acceso_usuarios, acceso_presupuesto, acceso_proveedores, acceso_ordenes, usuario_foto) VALUES('$this->user_name', '$this->password', $this->pais, $this->nivel, '$this->nombre', '$this->email', ";
        
        foreach($this->accesos as $acceso) {
            $sql .= ($acceso ? 'TRUE' : 'FALSE'). ", ";
        } //foreach

        $sql .= "'$this->foto')";
        return $sql;
    } //private function assembleMySQLInsert

/**
* setDataMySQL - Asigna valores de registro a variables privadas
* @param array $data arreglo asociativo con valores que se asignarán
*
* 
*/
    private function setDataMySQL($data) {
        $this->user_name = $data['usuario_user'];
        $this->nombre = $data['usuario_nombre'];
        $this->pais = $data['pais_id'];
        $this->nivel = $data['usuario_nivel'];
        $this->email = $data['usuario_email'];
		$this->next_mail = $data['usuario_next_mail'];
        $this->accesos = array(
            $data['acceso_usuarios'],
            $data['acceso_presupuesto'],
            $data['acceso_proveedores'],
            $data['acceso_ordenes']);
        $this->activo = $data['usuario_activo'];
    } //private function setDataMySQL

/**
* add - Crea registro para nuevo suscriptor
*
* 
*/
    private function assignPhoto() {
        if(isset($_FILES) && is_array($_FILES)) {
            $this->foto = $_FILES['usuario_foto']['name'];
            $uploads_dir = "img/fotos";
            move_uploaded_file($_FILES['usuario_foto']['tmp_name'], "$uploads_dir/$this->foto");
        } //if
    } //private function assignPhoto

/**
* saveChanges - Realiza la actualización del registro del suscriptor en la BD
*
* 
*/
    private function saveChanges() {
        $sql = "UPDATE master_usuarios SET usuario_nombre = '$this->nombre', usuario_email = '$this->email', pais_id = $this->pais, usuario_nivel = $this->nivel, ";
        
        $sql .= "acceso_usuarios = " . ($this->accesos[0] ? 'TRUE' : 'FALSE') . ", ";
        $sql .= "acceso_presupuesto = " . ($this->accesos[1] ? 'TRUE' : 'FALSE') . ", ";
        $sql .= "acceso_proveedores = " . ($this->accesos[2] ? 'TRUE' : 'FALSE') . ", ";
        $sql .= "acceso_ordenes = " . ($this->accesos[3] ? 'TRUE' : 'FALSE') . ", ";
        
        $sql .= "usuario_foto = '$this->foto' WHERE usuario_id = $this->id;";

        if($this->debug) trigger_error($sql);
        try {
            $this->conexMySQL->query($sql);
        } catch(Exception $ex) {
            throw new Exception($ex->getMessage());
        } //try
        $texto = $sql;

        return $texto;
    } //private function saveChanges

/**
* add - Crea registro para nuevo suscriptor
*
* 
*/
    public function add($data) {
        // Asigna valores recibidos
        $this->user_name = urldecode(trim($data['user_name']));
        $this->tmp_password = trim($data['user_password']);
        $this->password = $this->encrypt($this->tmp_password);
        $this->nombre = $data['nombre'];
        $this->email = $data['email'];
        $this->pais = $data['pais'];
        $this->nivel = $data['nivel'];

        $this->accesos = array(FALSE, FALSE, FALSE, FALSE);

        if(isset($data['accesos'])) {
            foreach($data['accesos'] as $acceso) {
                $this->accesos[$acceso] = TRUE;
            } //foreach
        } //if

        $this->assignPhoto();
        // Graba registro MySQL
        $sql = $this->assembleMySQLInsert();
        if($this->debug) trigger_error($sql);
        try {
            $this->conexMySQL->query($sql);
            $this->user_id = $this->conexMySQL->insert_id;
            //$this->assignPhoto();
        } catch(Exception $ex) {
            throw new Exception($ex->getMessage());
        } //try
        $content = "<br />$sql<br />";

        // Respuesta del proceso
        $content = "Su registro ha sido creado en el sistema.";
        return json_encode( $feed=array("response" => "OK", "content" => utf8_encode($content)) );
    } //public function add

/**
* disable - Deshabilita el usuario
*
* 
*/
    public function disable($data) {
        // No aplica cambios si no hay identificador de usuario
        if(is_null($this->id) || $this->id == 0) return json_encode( $feed=array("response" => "ERR","content" => utf8_encode("No se ha especificado ID de usuario")) );

        $sql = "UPDATE master_usuarios SET usuario_activo = FALSE WHERE usuario_id = $this->id";
        if($this->debug) trigger_error($sql);
        try {
            $this->conexMySQL->query($sql);
        } catch(Exception $ex) {
            throw new Exception($ex->getMessage());
        } //try

        $content = "Usuario desabilitado satisfactoriamente";

        return json_encode( $feed=array("response" => "OK", "content" => utf8_encode($content)) );
    } //public function disable

/**
* enable - Habilida el usuario
*
* 
*/
    private function enable($company) {
        // No aplica cambios si no hay identificador de usuario
        if(is_null($this->id) || $this->id == 0) return json_encode( $feed=array("response" => "ERR","content" => utf8_encode("No se ha especificado ID de usuario")) );

        $sql = "UPDATE master_usuarios SET usuario_activo = TRUE WHERE usuario_id = $this->id";
        if($this->debug) trigger_error($sql);
        try {
            $this->conexMySQL->query($sql);
        } catch(Exception $ex) {
            throw new Exception($ex->getMessage());
        } //try

        $content = "Usuario desabilitado satisfactoriamente";

        return json_encode( $feed=array("response" => "OK", "content" => utf8_encode($content)) );
    } //private function enable

/**
* edit - Prepara datos laborales para actualizar registro
*
* 
*/
    public function edit($data) {
        // No aplica cambios si no hay identificador de usuario
        if(is_null($this->id) || $this->id == 0) return json_encode( $feed=array("response" => "ERR","content" => utf8_encode("No se ha especificado ID de usuario")) );

        // Recupera datos actuales
        if(!$this->record_loaded && !is_null($this->user_id))
            $this->readRecord();

        $this->nombre = $data['nombre'];
        $this->email = $data['email'];
        $this->pais = $data['pais'];
        $this->nivel = $data['nivel'];

        if(isset($data['accesos'])) {
            foreach($data['accesos'] as $acceso) {
                $this->accesos[$acceso] = TRUE;
            } //foreach
        } //if

        $this->assignPhoto();

        // Actualiza registro
        $content = $this->saveChanges();
        $content = "Datos de usuario actualizados satisfactoriamente";

        return json_encode( $feed=array("response" => "OK", "content" => utf8_encode($content)) );
    } //public function edit

/**
* details_user - Regresa detalle de usuario
*
* 
*/
    public function details_user($data) {
        $this->user_id = $data['usuario_id'];
        $this->readRecord();

        $content = array("usuario_user" => $this->user_name, "usuario_nombre" => $this->nombre, "pais_id" => $this->pais, "usuario_nivel" => $this->nivel, "usuario_email" => $this->email, "usuario_foto" => $this->foto, "usuario_activo" => $this->activo, "accesos" => $this->accesos);

        return json_encode( $feed=array("response" => "OK", "content" => utf8_encode($content)) );
    } //public function list_users

/**
* list_users - Regresa lista de usuarios
*
* 
*/
    public function list_users() {
        $content = array();
        $sql = "SELECT * FROM master_usuarios;";
        if($this->debug) trigger_error($sql);
        try {
            $this->conexMySQL->query($sql);
        } catch(Exception $ex) {
            throw new Exception($ex->getMessage());
        } //try

        $content = "Usuario desabilitado satisfactoriamente";

        return json_encode( $feed=array("response" => "OK", "content" => utf8_encode($content)) );
    } //public function list_users
} //class Suscripcion
?>