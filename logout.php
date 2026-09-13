<?php

session_start();

/*=========================================
    DESTRÓI A SESSÃO
=========================================*/

$_SESSION = [];

session_unset();

session_destroy();

/*=========================================
    LIMPA COOKIES (caso existam)
=========================================*/

if (isset($_COOKIE[session_name()])) {

    setcookie(
        session_name(),
        "",
        time() - 3600,
        "/"
    );
}

/*=========================================
    REDIRECIONA
=========================================*/

header("Location: login.php");

exit();
