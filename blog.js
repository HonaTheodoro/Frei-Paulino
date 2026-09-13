/*=========================================
BLOG
=========================================*/

const postsGrid = document.getElementById("posts-grid");
// pega os posts do localStorage
const posts = JSON.parse(localStorage.getItem("posts")) || [];

// mostra os posts
mostrarPosts();
function mostrarPosts() {
  postsGrid.innerHTML = "";
  if (posts.length === 0) {
    postsGrid.innerHTML = `
        <div class="sem-post">
            <h2>
                Nenhuma notícia publicada.
            </h2>
            <p>
                Assim que o administrador publicar
                uma notícia ela aparecerá aqui.
            </p>
        </div>
        `;
    return;
  }
  posts.forEach((post) => {
    postsGrid.innerHTML += criarCard(post);
  });
}

function criarCard(post) {
  return `
        <article class="post-card">
            <div class="post-image">
                <img src="${post.imagem}" alt="">
            </div>
            <div class="post-content">
                <span class="categoria-tag">
                    ${post.categoria}
                </span>
                <h3>
                    ${post.titulo}
                </h3>
                <p>
                    ${post.resumo}
                </p>
                <div class="post-info">
                    <span>
                        📅 ${post.data}
                    </span>
                    <span>
                        👤 ${post.autor}
                    </span>
                </div>
                <a href="post.phpl?id=${post.id}" class="read-more">
                Leia Mais →
                </a>
            </div>
        </article>
    `;
}
