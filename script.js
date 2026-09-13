document.addEventListener("DOMContentLoaded", () => {
  /*==============================
      MENU MOBILE
    ==============================*/
  const menuBtn = document.querySelector(".menu-mobile");
  const mobileNav = document.querySelector(".mobile-nav");
  const closeBtn = document.querySelector(".close-menu");

  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      mobileNav.style.display = "flex";
      mobileNav.style.flexDirection = "column";
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      mobileNav.style.display = "none";
    });
  }

  /*==============================
      NAVBAR AO ROLAR
    ==============================*/

  const header = document.querySelector(".header");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.style.background = "rgba(23,60,141,.98)";
      header.style.boxShadow = "0 5px 20px rgba(0,0,0,.15)";
    } else {
      header.style.background = "rgba(23,60,141,.95)";
      header.style.boxShadow = "none";
    }
  });

  /*==============================
      MODAL ADMIN
    ==============================*/

  const adminBtn = document.getElementById("adminBtn");
  const modal = document.getElementById("adminModal");
  const closeModal = document.getElementById("closeModal");
  const loginBtn = document.getElementById("loginBtn");

  const SENHA = "admin123";

  if (adminBtn) {
    adminBtn.addEventListener("click", () => {
      modal.style.display = "block";
    });
  }

  if (closeModal) {
    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
      document.getElementById("adminPassword").value = "";
      document.getElementById("loginError").textContent = "";
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const senha = document.getElementById("adminPassword").value;
      if (senha === SENHA) {
        localStorage.setItem("admin", "true");
        window.location.href = "admin.php";
      } else {
        document.getElementById("loginError").textContent = "Senha incorreta!";
      }
    });
  }

  /*==============================
      ENTER NO LOGIN
    ==============================*/

  const senhaInput = document.getElementById("adminPassword");

  if (senhaInput) {
    senhaInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        loginBtn.click();
      }
    });
  }

  /*==============================
      ANIMAÇÃO AO ROLAR
    ==============================*/

  const reveals = document.querySelectorAll(".hero, .apresentacao, #blog");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.animate(
            [
              {
                opacity: 0,
                transform: "translateY(50px)",
              },
              {
                opacity: 1,
                transform: "translateY(0px)",
              },
            ],
            {
              duration: 700,
              fill: "forwards",
              easing: "ease",
            },
          );
        }
      });
    },
    {
      threshold: 0.15,
    },
  );

  reveals.forEach((element) => {
    observer.observe(element);
  });
});
