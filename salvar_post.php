<?php

require_once "../config/auth.php";
require_once "../config/conexao.php";

if ($_SERVER["REQUEST_METHOD"] != "POST") {

    header("Location: ../admin.php");

    exit();
}

$titulo = trim($_POST["titulo"]);

$categoria = trim($_POST["categoria"]);

$autor = trim($_POST["autor"]);

$resumo = trim($_POST["resumo"]);

$conteudo = trim($_POST["conteudo"]);

$imagem = "";

if (

    isset($_FILES["imagem"])

    &&

    $_FILES["imagem"]["error"] == 0

) {

    $pasta = "../uploads/posts/";

    if (!is_dir($pasta)) {

        mkdir($pasta, 0777, true);
    }

    $nomeArquivo = time() . "_" . $_FILES["imagem"]["name"];

    move_uploaded_file(

        $_FILES["imagem"]["tmp_name"],

        $pasta . $nomeArquivo

    );

    $imagem = "uploads/posts/" . $nomeArquivo;
}

$sql = $pdo->prepare("

INSERT INTO posts

(

titulo,

categoria,

autor,

resumo,

conteudo,

imagem

)

VALUES

(

?,?,?,?,?,?

)

");

$sql->execute([

    $titulo,

    $categoria,

    $autor,

    $resumo,

    $conteudo,

    $imagem

]);

header("Location: ../admin.php?sucesso=1");

exit();
