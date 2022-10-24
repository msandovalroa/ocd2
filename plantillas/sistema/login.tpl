
<div style="width:100%; height:85%">
<style>
    #header {
        display:none;
    }
</style>
    
    <div>{$mensaje}</div>

    <div id="login_panel"> 
        <img id="logo" src="img/assets/logo_ocd_large.png">
        <form id="frm_login" method="post">
            <input placeholder="USUARIO" type="text" class="text_field" id="user_name" name="user_name" value="{$user}"/><br>
            <input placeholder="CONTRASEÑA" type="password" class="text_field" id="user_password" name="user_password" /><br>
            <input type="submit" value="ENTRAR" class="button_field" />
        </form>
    </div>

</div>