/*====================================================
                ELEMENTOS
====================================================*/

const menuItems = document.querySelectorAll(".menu li");
const pages = document.querySelectorAll(".page");

/*====================================================
            NAVEGAÇÃO DA SIDEBAR
====================================================*/

menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    menuItems.forEach((i) => i.classList.remove("active"));

    item.classList.add("active");

    const page = item.dataset.page;

    pages.forEach((p) => {
      p.classList.remove("active-page");
    });

    document.getElementById(page).classList.add("active-page");
  });
});

/*====================================================
                MODAL APRENDIZ
====================================================*/

const modalAprendiz = document.getElementById("modalAprendiz");

const btnNovoAprendiz = document.getElementById("novoAprendiz");

const fecharAprendiz = document.querySelector(".closeModal");

const cancelarAprendiz = document.querySelector(".btnCancelar");

btnNovoAprendiz.addEventListener("click", () => {
  modalAprendiz.classList.add("active");
});

fecharAprendiz.addEventListener("click", () => {
  modalAprendiz.classList.remove("active");
});

cancelarAprendiz.addEventListener("click", () => {
  modalAprendiz.classList.remove("active");
});

window.addEventListener("click", (e) => {
  if (e.target === modalAprendiz) {
    modalAprendiz.classList.remove("active");
  }
});

/*====================================================
                MODAL POST
====================================================*/

const modalPost = document.getElementById("modalPost");

const btnNovoPost = document.getElementById("novoPost");

const fecharPost = document.querySelector(".closePost");

btnNovoPost.addEventListener("click", () => {
  modalPost.classList.add("active");
});

fecharPost.addEventListener("click", () => {
  modalPost.classList.remove("active");
});

window.addEventListener("click", (e) => {
  if (e.target === modalPost) {
    modalPost.classList.remove("active");
  }
});

/*====================================================
                ABAS
====================================================*/

const tabs = document.querySelectorAll(".tab-btn");

tabs.forEach((btn) => {
  btn.addEventListener("click", () => {
    const pai = btn.parentElement.parentElement;

    pai.querySelectorAll(".tab-btn").forEach((b) => {
      b.classList.remove("active");
    });

    pai.querySelectorAll(".tab-content").forEach((c) => {
      c.classList.remove("active");
    });

    btn.classList.add("active");

    pai.querySelector("#" + btn.dataset.tab).classList.add("active");
  });
});

/*====================================================
                    BLOG
====================================================*/

let posts = JSON.parse(localStorage.getItem("posts")) || [];

const listaPosts = document.getElementById("listaPosts");
const totalPosts = document.getElementById("totalPosts");

let editandoPost = null;

/*====================================================
                SALVAR POSTS
====================================================*/

function salvarPosts() {
  localStorage.setItem("posts", JSON.stringify(posts));
}

/*====================================================
            CONTADOR POSTS
====================================================*/

function atualizarContadorPosts() {
  totalPosts.textContent = posts.length;
}

/*====================================================
            LISTAR POSTS
====================================================*/

function listarPosts() {
  listaPosts.innerHTML = "";

  posts.forEach((post, index) => {
    listaPosts.innerHTML += `

        <div class="post-card fade">

            <img src="${post.imagem || "Imagens/post_padrao.jpg"}">

            <div class="post-info">

                <h3>${post.titulo}</h3>

                <p>${post.resumo}</p>

                <div class="post-meta">

                    <span>${post.autor}</span>

                    <span>${post.categoria}</span>

                </div>

                <div class="card-actions">

                    <button
                        class="btnEditar"
                        onclick="editarPost(${index})">

                        Editar

                    </button>

                    <button
                        class="btnExcluir"
                        onclick="excluirPost(${index})">

                        Excluir

                    </button>

                </div>

            </div>

        </div>

        `;
  });

  atualizarContadorPosts();
}

/*====================================================
            PUBLICAR
====================================================*/

document.getElementById("publicar").addEventListener("click", () => {
  const novoPost = {
    titulo: document.getElementById("titulo").value,

    categoria: document.getElementById("categoria").value,

    autor: document.getElementById("autor").value,

    resumo: document.getElementById("resumo").value,

    texto: document.getElementById("texto").value,

    imagem: "",
  };

  if (novoPost.titulo === "" || novoPost.resumo === "") {
    alert("Preencha pelo menos o título e o resumo.");

    return;
  }

  if (editandoPost === null) {
    posts.push(novoPost);
  } else {
    posts[editandoPost] = novoPost;

    editandoPost = null;
  }

  salvarPosts();

  listarPosts();

  modalPost.classList.remove("active");

  limparFormularioPost();
});

/*====================================================
            LIMPAR FORMULÁRIO
====================================================*/

function limparFormularioPost() {
  document.getElementById("titulo").value = "";

  document.getElementById("categoria").selectedIndex = 0;

  document.getElementById("autor").value = "";

  document.getElementById("resumo").value = "";

  document.getElementById("texto").value = "";

  document.getElementById("imagem").value = "";
}

/*====================================================
            EDITAR
====================================================*/

function editarPost(index) {
  const post = posts[index];

  document.getElementById("titulo").value = post.titulo;

  document.getElementById("categoria").value = post.categoria;

  document.getElementById("autor").value = post.autor;

  document.getElementById("resumo").value = post.resumo;

  document.getElementById("texto").value = post.texto;

  editandoPost = index;

  modalPost.classList.add("active");
}

/*====================================================
            EXCLUIR
====================================================*/

function excluirPost(index) {
  if (confirm("Deseja excluir esta publicação?")) {
    posts.splice(index, 1);

    salvarPosts();

    listarPosts();
  }
}

/*====================================================
            INICIAR
====================================================*/

listarPosts();
