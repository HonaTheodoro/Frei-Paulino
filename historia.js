/* ============================================================
   HISTÓRIA — CENTRO VOCACIONAL FREI PAULINO
   JavaScript da página "Nossa História"
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  console.log("✓ Página História carregada.");

  /* ============================================================
     ELEMENTOS PRINCIPAIS
  ============================================================ */

  const header = document.querySelector(".historia-header");
  const hero = document.querySelector(".history-hero");
  const heroContent = document.querySelector(".hero-content");
  const heroScroll = document.querySelector("#heroScroll");
  const heroCircles = document.querySelectorAll(".hero-circle");

  const timeline = document.querySelector(".timeline");
  const timelineProgress = document.querySelector("#timelineProgress");
  const timelineItems = document.querySelectorAll(".timeline-item");
  const timelineYears = document.querySelectorAll(".timeline-year span");

  const revealElements = document.querySelectorAll(".reveal");

  const menuToggle = document.querySelector("#menuToggle");
  const mobileMenu = document.querySelector("#mobileMenu");

  const backToTop = document.querySelector("#backToTop");

  const currentlySection = document.querySelector(".currently-section");
  const currentlyTitle = document.querySelector(".currently-title");

  const futureSection = document.querySelector(".future-section");
  const futureButton = document.querySelector(".future-button");

  const valueItems = document.querySelectorAll(".value-item");

  /* ============================================================
     ACESSIBILIDADE
  ============================================================ */

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ============================================================
     1. HEADER AO ROLAR
  ============================================================ */

  function updateHeader() {
    if (!header) return;

    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", updateHeader, {
    passive: true,
  });

  /* ============================================================
     2. MENU MOBILE
  ============================================================ */

  function closeMobileMenu() {
    if (!mobileMenu || !menuToggle) return;

    mobileMenu.classList.remove("open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  }

  function openMobileMenu() {
    if (!mobileMenu || !menuToggle) return;

    mobileMenu.classList.add("open");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Fechar menu");
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.contains("open");

      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    /* Fecha ao clicar em um link */

    const mobileLinks = mobileMenu.querySelectorAll("a");

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeMobileMenu();
      });
    });
  }

  /* ============================================================
     3. FECHAR MENU COM ESC
  ============================================================ */

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      mobileMenu &&
      mobileMenu.classList.contains("open")
    ) {
      closeMobileMenu();
    }
  });

  /* ============================================================
     4. HERO — BOTÃO "CONHEÇA NOSSA TRAJETÓRIA"
  ============================================================ */

  if (heroScroll) {
    heroScroll.addEventListener("click", () => {
      const introduction = document.querySelector(".history-introduction");

      if (!introduction) return;

      introduction.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  }

  /* ============================================================
     5. ANIMAÇÃO REVEAL
     
     Os elementos aparecem conforme entram na tela.
  ============================================================ */

  if (!prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -60px 0px",
      },
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  /* ============================================================
     6. TIMELINE — PROGRESSO DA LINHA
  ============================================================ */

  let timelineTicking = false;

  function updateTimelineProgress() {
    if (!timeline || !timelineProgress) return;

    const rect = timeline.getBoundingClientRect();

    const viewportHeight = window.innerHeight;

    const readingPoint = viewportHeight * 0.48;

    const distance = readingPoint - rect.top;

    const totalHeight = rect.height;

    if (totalHeight <= 0) return;

    let percentage = (distance / totalHeight) * 100;

    percentage = Math.max(0, Math.min(100, percentage));

    timelineProgress.style.height = `${percentage}%`;
  }

  function requestTimelineUpdate() {
    if (timelineTicking) return;

    timelineTicking = true;

    requestAnimationFrame(() => {
      updateTimelineProgress();

      timelineTicking = false;
    });
  }

  window.addEventListener("scroll", requestTimelineUpdate, { passive: true });

  window.addEventListener("resize", updateTimelineProgress);

  /* ============================================================
     7. DESTACA O ANO ATIVO
  ============================================================ */

  if (timelineItems.length > 0) {
    const yearObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const item = entry.target;

          const year = item.querySelector(".timeline-year span");

          if (!year) return;

          if (entry.isIntersecting) {
            year.classList.add("year-active");
          } else {
            year.classList.remove("year-active");
          }
        });
      },
      {
        threshold: 0.35,
      },
    );

    timelineItems.forEach((item) => {
      yearObserver.observe(item);
    });
  }

  /* ============================================================
     8. PARALLAX DOS ANOS
  ============================================================ */

  function updateYearParallax() {
    if (prefersReducedMotion) return;

    timelineYears.forEach((year) => {
      const rect = year.getBoundingClientRect();

      const viewportCenter = window.innerHeight / 2;

      const elementCenter = rect.top + rect.height / 2;

      const difference = elementCenter - viewportCenter;

      const movement = difference * -0.025;

      year.style.transform = `translateY(${movement}px)`;
    });
  }

  /* ============================================================
     9. PARALLAX DAS IMAGENS
  ============================================================ */

  const timelineImages = document.querySelectorAll(
    `
      .timeline-image img,
      .gallery-main img,
      .gallery-small img,
      .currently-image img
    `,
  );

  function updateImageParallax() {
    if (prefersReducedMotion) return;

    timelineImages.forEach((image) => {
      const rect = image.getBoundingClientRect();

      if (rect.bottom < -100 || rect.top > window.innerHeight + 100) {
        return;
      }

      const center = rect.top + rect.height / 2;

      const difference = center - window.innerHeight / 2;

      const movement = difference * -0.018;

      image.style.transform = `translateY(${movement}px)`;
    });
  }

  /* ============================================================
     10. PARALLAX DO HERO
  ============================================================ */

  function updateHeroParallax() {
    if (prefersReducedMotion || !hero || !heroContent) {
      return;
    }

    const scroll = window.scrollY;

    const heroHeight = hero.offsetHeight;

    if (scroll > heroHeight) return;

    /* Movimento do conteúdo */

    const contentMovement = scroll * 0.1;

    const opacity = 1 - (scroll / heroHeight) * 0.85;

    heroContent.style.transform = `translateY(${contentMovement}px)`;

    heroContent.style.opacity = Math.max(0, opacity);

    /* Movimento dos círculos */

    if (heroCircles[0]) {
      heroCircles[0].style.transform = `translateY(${scroll * 0.06}px)`;
    }

    if (heroCircles[1]) {
      heroCircles[1].style.transform = `translateY(${scroll * -0.05}px)`;
    }
  }

  /* ============================================================
     11. ATUALIZAÇÃO CENTRAL DO SCROLL
  ============================================================ */

  let animationFrame = null;

  function handleScrollAnimation() {
    if (animationFrame) return;

    animationFrame = requestAnimationFrame(() => {
      updateHeroParallax();

      updateYearParallax();

      updateImageParallax();

      animationFrame = null;
    });
  }

  window.addEventListener("scroll", handleScrollAnimation, { passive: true });

  /* ============================================================
     12. BOTÃO VOLTAR AO TOPO
  ============================================================ */

  function updateBackToTop() {
    if (!backToTop) return;

    if (window.scrollY > 700) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  }

  window.addEventListener("scroll", updateBackToTop, { passive: true });

  if (backToTop) {
    backToTop.addEventListener("click", (event) => {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  }

  /* ============================================================
     13. SEÇÃO "ATUALMENTE"
  ============================================================ */

  if (currentlySection && currentlyTitle) {
    const currentlyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            currentlyTitle.classList.add("currently-visible");

            currentlyObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.25,
      },
    );

    currentlyObserver.observe(currentlySection);
  }

  /* ============================================================
     14. ANIMAÇÃO DOS VALORES
  ============================================================ */

  if (valueItems.length > 0) {
    const valueObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const item = entry.target;

          item.classList.add("value-visible");

          observer.unobserve(item);
        });
      },
      {
        threshold: 0.2,
      },
    );

    valueItems.forEach((item, index) => {
      if (!prefersReducedMotion) {
        item.style.transitionDelay = `${index * 0.12}s`;
      }

      valueObserver.observe(item);
    });
  }

  /* ============================================================
     15. ANIMAÇÃO DA SEÇÃO FUTURO
  ============================================================ */

  if (futureSection) {
    const futureElements = futureSection.querySelectorAll(
      ".future-container > *",
    );

    if (!prefersReducedMotion) {
      const futureObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            futureElements.forEach((element, index) => {
              setTimeout(() => {
                element.classList.add("future-element-visible");
              }, index * 100);
            });

            futureObserver.disconnect();
          });
        },
        {
          threshold: 0.15,
        },
      );

      futureObserver.observe(futureSection);
    } else {
      futureElements.forEach((element) => {
        element.classList.add("future-element-visible");
      });
    }
  }

  /* ============================================================
     16. HOVER DO BOTÃO FINAL
  ============================================================ */

  if (futureButton && !prefersReducedMotion) {
    futureButton.addEventListener("mouseenter", () => {
      futureButton.classList.add("button-hover");
    });

    futureButton.addEventListener("mouseleave", () => {
      futureButton.classList.remove("button-hover");
    });
  }

  /* ============================================================
     17. HOVER DAS IMAGENS
  ============================================================ */

  const imageContainers = document.querySelectorAll(
    `
        .timeline-image,
        .timeline-gallery,
        .currently-image
      `,
  );

  if (!prefersReducedMotion) {
    imageContainers.forEach((container) => {
      container.addEventListener("mouseenter", () => {
        container.classList.add("image-hover");
      });

      container.addEventListener("mouseleave", () => {
        container.classList.remove("image-hover");
      });
    });
  }

  /* ============================================================
     18. ANIMAÇÃO DA SETA DO HERO
  ============================================================ */

  if (heroScroll && !prefersReducedMotion) {
    const arrow = heroScroll.querySelector(".scroll-arrow");

    if (arrow) {
      let arrowAnimation;

      function animateArrow() {
        const time = Date.now() / 500;

        const movement = Math.sin(time) * 4;

        arrow.style.transform = `translateY(${movement}px)`;

        arrowAnimation = requestAnimationFrame(animateArrow);
      }

      animateArrow();

      window.addEventListener(
        "scroll",
        () => {
          if (window.scrollY > window.innerHeight * 0.6) {
            if (arrowAnimation) {
              cancelAnimationFrame(arrowAnimation);

              arrowAnimation = null;
            }
          } else if (!arrowAnimation) {
            animateArrow();
          }
        },
        { passive: true },
      );
    }
  }

  /* ============================================================
     19. LINKS INTERNOS COM SCROLL SUAVE
  ============================================================ */

  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",

        block: "start",
      });
    });
  });

  /* ============================================================
     20. IMAGENS QUE AINDA NÃO EXISTEM
  ============================================================ */

  const allImages = document.querySelectorAll("img");

  allImages.forEach((image) => {
    image.addEventListener("error", () => {
      image.classList.add("image-error");
    });
  });

  /* ============================================================
     21. FECHAR MENU SE A TELA FICAR GRANDE
  ============================================================ */

  window.addEventListener("resize", () => {
    if (
      window.innerWidth > 900 &&
      mobileMenu &&
      mobileMenu.classList.contains("open")
    ) {
      closeMobileMenu();
    }

    updateTimelineProgress();
  });

  /* ============================================================
     22. ATUALIZAÇÕES INICIAIS
  ============================================================ */

  updateHeader();

  updateBackToTop();

  updateTimelineProgress();

  if (!prefersReducedMotion) {
    updateHeroParallax();

    updateYearParallax();

    updateImageParallax();
  }

  /* ============================================================
     23. FINAL
  ============================================================ */

  console.log("Animações da página História ativadas.");
});
