<?php

require_once "config/auth.php";
require_once "config/conexao.php";

$posts = $pdo->query("
SELECT *
FROM posts
ORDER BY criado_em DESC
")->fetchAll();

?>

<!DOCTYPE html>

<html lang="pt-BR">

<head>
    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Posts | CVFP</title>

    <link rel="stylesheet" href="css/admin.css">

    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>

</head>

<body>

    <div class="container">

        <header class="topbar">

            <h1>Gerenciar Publicações</h1>

            <div class="perfil">

                <img src="Imagens/admin.png">

                <div>

                    <h3><?= htmlspecialchars($_SESSION["nome"]) ?></h3>

                    <span><?= htmlspecialchars($_SESSION["nivel"]) ?></span>

                </div>

            </div>

        </header>

        <div class="acoes">

            <a href="admin.php" class="btn">

                <i class='bx bx-arrow-back'></i>

                Voltar

            </a>

            <a href="admin.php#novoPost" class="btn">

                <i class='bx bx-plus'></i>

                Novo Post

            </a>

        </div>

        <table class="tabela">

            <thead>

                <tr>

                    <th>Imagem</th>

                    <th>Título</th>

                    <th>Categoria</th>

                    <th>Autor</th>

                    <th>Data</th>

                    <th>Ações</th>

                </tr>

            </thead>

            <tbody>
                <?php foreach ($posts as $post): ?>

                    <tr>

                        <td>

                            <?php if (!empty($post["imagem"])): ?>

                                <img
                                    src="<?= htmlspecialchars($post["imagem"]) ?>"
                                    class="miniatura"
                                    alt="Imagem do Post">

                            <?php else: ?>

                                <span>Sem imagem</span>

                            <?php endif; ?>

                        </td>

                        <td>

                            <?= htmlspecialchars($post["titulo"]) ?>

                        </td>

                        <td>

                            <?= htmlspecialchars($post["categoria"]) ?>

                        </td>

                        <td>

                            <?= htmlspecialchars($post["autor"]) ?>

                        </td>

                        <td>

                            <?= date("d/m/Y", strtotime($post["criado_em"])) ?>

                        </td>

                        <td class="acoesTabela">

                            <a
                                href="editar_post.php?id=<?= $post["id"] ?>"
                                class="btnEditar">

                                <i class='bx bx-edit'></i>

                            </a>

                            <a

                                href="actions/excluir_post.php?id=<?= $post["id"] ?>"

                                class="btnExcluir"

                                onclick="return confirm('Deseja realmente excluir este post?')">

                                <i class='bx bx-trash'></i>

                            </a>

                        </td>

                    </tr>

                <?php endforeach; ?>

            </tbody>

        </table>

    </div>

</body>

</html>