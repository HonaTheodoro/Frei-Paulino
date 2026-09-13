<?php
session_start();

require_once "config/conexao.php";

if (isset($_SESSION["admin"])) {
    header("Location: admin.php");
    exit();
}

$erro = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $usuario = trim($_POST["usuario"]);
    $senha = $_POST["senha"];

    $sql = "SELECT * FROM administradores WHERE usuario = :usuario LIMIT 1";

    $stmt = $pdo->prepare($sql);

    $stmt->bindValue(":usuario", $usuario);

    $stmt->execute();

    if ($stmt->rowCount() > 0) {

        $admin = $stmt->fetch();

        if (password_verify($senha, $admin["senha"])) {

            $_SESSION["admin"] = $admin["id"];
            $_SESSION["nome"] = $admin["nome"];
            $_SESSION["nivel"] = $admin["nivel"];

            $update = $pdo->prepare("
                UPDATE administradores
                SET ultimo_login = NOW()
                WHERE id = :id
            ");

            $update->bindValue(":id", $admin["id"]);
            $update->execute();

            header("Location: admin.php");
            exit();
        } else {

            $erro = "Senha incorreta.";
        }
    } else {

        $erro = "Usuário não encontrado.";
    }
}
?>

<!DOCTYPE html>

<html lang="pt-BR">

<head>

    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Login Administrativo | CVFP</title>

    <link rel="stylesheet" href="css/login.css">

    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>

    <link rel="icon" href="imagens/Logo.png">

</head>

<body>

    <div class="login-container">

        <div class="login-card">

            <img src="imagens/Logo.png" class="logo">

            <h1>Centro Vocacional Frei Paulino</h1>

            <h2>Painel Administrativo</h2>

            <?php if ($erro != ""): ?>

                <div class="erro">

                    <i class='bx bx-error-circle'></i>

                    <?= $erro; ?>

                </div>

            <?php endif; ?>

            <form method="POST" autocomplete="off">

                <div class="input-group">

                    <label>

                        Usuário

                    </label>

                    <div class="input-box">

                        <i class='bx bx-user'></i>

                        <input
                            type="text"
                            name="usuario"
                            placeholder="Digite seu usuário"
                            required>

                    </div>

                </div>

                <div class="input-group">

                    <label>

                        Senha

                    </label>

                    <div class="input-box senha-box">

                        <i class='bx bx-lock-alt'></i>

                        <input
                            type="password"
                            name="senha"
                            id="senha"
                            placeholder="Digite sua senha"
                            required>

                        <i
                            class='bx bx-hide'
                            id="mostrarSenha"></i>

                    </div>

                </div>

                <div class="opcoes">

                    <label>

                        <input
                            type="checkbox"
                            name="lembrar">

                        Lembrar-me

                    </label>

                    <a href="#">

                        Esqueci minha senha

                    </a>

                </div>

                <button
                    type="submit"
                    class="btn-login">

                    <i class='bx bx-log-in'></i>

                    Entrar

                </button>

            </form>

            <div class="rodape">

                <p>

                    © <?php echo date("Y"); ?>

                    Centro Vocacional Frei Paulino

                </p>

                <span>

                    Sistema Administrativo

                </span>

            </div>

        </div>

    </div>

    <script>
        const mostrarSenha = document.getElementById("mostrarSenha");

        const senha = document.getElementById("senha");

        mostrarSenha.addEventListener("click", () => {

            if (senha.type === "password") {

                senha.type = "text";

                mostrarSenha.classList.remove("bx-hide");

                mostrarSenha.classList.add("bx-show");

            } else {
                senha.type = "password";
                mostrarSenha.classList.remove("bx-show");
                mostrarSenha.classList.add("bx-hide");
            }

        });
    </script>

</body>

</html>