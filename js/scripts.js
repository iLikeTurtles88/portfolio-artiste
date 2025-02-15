// js/scripts.js

document.addEventListener("DOMContentLoaded", () => {
  // Sauvegarde de l'élément déclencheur du modal
  let lastFocusedElement = null;

  // Initialisation de AOS
  AOS.init({
    duration: 1500,
    once: false,
  });

  // Références aux éléments
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  const navbar = document.getElementById("navbar");
  const hero = document.getElementById("hero");
  const gearWheel = document.getElementById("gear-wheel");

  /* ===== Gestion du Menu Hamburger ===== */
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector("#navbar ul");
  hamburger.addEventListener("click", () => {
    const expanded = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", !expanded);
    navMenu.classList.toggle("active");
  });
  hamburger.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      hamburger.click();
    }
  });

  /* ===== Configuration de particles.js ===== */
  if (document.getElementById("particles-js")) {
    particlesJS("particles-js", {
      particles: {
        number: {
          value: 300,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: { value: "#ffffff" },
        shape: {
          type: "circle",
          stroke: { width: 0, color: "#000000" },
        },
        opacity: {
          value: 0.8,
          random: true,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0.2,
            sync: false,
          },
        },
        size: {
          value: 2,
          random: true,
          anim: { enable: false },
        },
        line_linked: { enable: false },
        move: {
          enable: true,
          speed: 0.2,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: { enable: false },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: false },
          onclick: { enable: false },
          resize: true,
        },
      },
      retina_detect: true,
    });
  }

  /* ===== Gestion du scroll ===== */
  const handleScroll = () => {
    const scrollPos = window.pageYOffset;

    // Afficher le bouton "scroll-to-top"
    scrollTopBtn.style.display = scrollPos > 300 ? "flex" : "none";

    // Changement de style de la navbar
    if (scrollPos > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Parallaxe pour le hero
    if (hero) {
      hero.style.backgroundPositionY = `${scrollPos * 0.5}px`;
    }

    // Mise à jour de la teinte pour les sections portfolio
    const portfolioSections = document.querySelectorAll(".portfolio-section");
    const hue = scrollPos * 0.1;
    portfolioSections.forEach((section) => {
      section.style.setProperty("--hue", `${hue}deg`);
    });

    // Gestion de la roue crantée
    if (gearWheel) {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollPos / scrollableHeight;
      const gearHeight = gearWheel.offsetHeight;
      const topPos = scrollPercent * (window.innerHeight - gearHeight);
      gearWheel.style.top = topPos + "px";
      gearWheel.style.transform = `rotate(${scrollPos * 0.5}deg)`;
      const heroRect = hero.getBoundingClientRect();
      let gearOpacity = 1 - heroRect.bottom / window.innerHeight;
      gearOpacity = Math.min(Math.max(gearOpacity, 0), 1);
      gearWheel.style.opacity = gearOpacity;
    }
  };

  handleScroll();
  window.addEventListener("scroll", handleScroll);

  /* ===== Observer pour les animations fade-in/out ===== */
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Lorsque moins de 50% de l'élément est visible, on lance le fade-out
        if (
          !entry.isIntersecting &&
          entry.target.classList.contains("aos-animate")
        ) {
          if (!entry.target.classList.contains("aos-animate-out")) {
            entry.target.classList.add("aos-animate-out");
            entry.target.addEventListener("animationend", function handler() {
              entry.target.classList.remove("aos-animate", "aos-animate-out");
              entry.target.removeEventListener("animationend", handler);
            });
          }
        }
        // Lorsque l'élément atteint ou dépasse 50% de visibilité, on lance le fade-in
        else if (entry.isIntersecting) {
          entry.target.classList.remove("aos-animate-out");
          if (!entry.target.classList.contains("aos-animate")) {
            // Forcer le recalcul du style pour relancer l'animation
            void entry.target.offsetWidth;
            entry.target.classList.add("aos-animate");
          }
        }
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll("[data-aos]").forEach((el) => {
    fadeObserver.observe(el);
  });

  /* ===== Effet ripple sur les boutons ===== */
  const rippleElements = document.querySelectorAll(".btn, #scrollTopBtn");
  rippleElements.forEach((element) => {
    element.addEventListener("click", function (e) {
      const rect = element.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.classList.add("ripple");
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;
      element.appendChild(ripple);
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  /* ===== Gestion du chargement des images avec spinner ===== */
  const thumbnailImages = document.querySelectorAll(
    ".thumbnail-container img.thumbnail"
  );
  thumbnailImages.forEach((img) => {
    img.addEventListener("load", () => {
      const spinner = img.parentElement.querySelector(".spinner");
      if (spinner) {
        spinner.style.display = "none";
      }
    });
    // Si l'image est déjà en cache
    if (img.complete) {
      const spinner = img.parentElement.querySelector(".spinner");
      if (spinner) {
        spinner.style.display = "none";
      }
    }
  });

  /* ===== GESTION DE LA POPUP & SLIDESHOW ===== */
  // Lorsqu'on clique sur une miniature, on ouvre le modal
  document
    .querySelectorAll(".thumbnail-container")
    .forEach((thumbContainer) => {
      thumbContainer.addEventListener("click", () => {
        lastFocusedElement = document.activeElement; // sauvegarde de l'élément déclencheur
        const thumbnailsContainer = thumbContainer.closest(".thumbnails");
        const images = thumbnailsContainer.querySelectorAll("img.thumbnail");
        const slides = [];
        images.forEach((img) => {
          slides.push(img.src);
        });
        const currentIndex = Array.from(images).indexOf(
          thumbContainer.querySelector("img.thumbnail")
        );
        openModal(slides, currentIndex);
      });
    });

  function openModal(slides, currentIndex) {
    const modal = document.getElementById("popupModal");
    const slideshowContainer = modal.querySelector(".popup-slideshow");
    slideshowContainer.innerHTML = "";
    slides.forEach((src, index) => {
      const img = document.createElement("img");
      img.src = src;
      if (index === currentIndex) {
        img.classList.add("active");
      }
      slideshowContainer.appendChild(img);
    });
    const dotsContainer = modal.querySelector(".popup-dots");
    dotsContainer.innerHTML = "";
    slides.forEach((_, index) => {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      if (index === currentIndex) {
        dot.classList.add("active");
      }
      dot.addEventListener("click", () => {
        setSlide(index);
      });
      dotsContainer.appendChild(dot);
    });
    modal.dataset.currentIndex = currentIndex;
    modal.dataset.totalSlides = slides.length;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Trappe le focus dans le modal
    trapFocus(modal);

    // Positionne le focus sur le bouton de fermeture pour l'accessibilité
    modal.querySelector("#popup-close").focus();
  }

  function changeSlide(direction) {
    const modal = document.getElementById("popupModal");
    let currentIndex = parseInt(modal.dataset.currentIndex);
    const slideshowContainer = modal.querySelector(".popup-slideshow");
    const slidesElements = slideshowContainer.querySelectorAll("img");
    const totalSlides = slidesElements.length;
    slidesElements[currentIndex].classList.remove("active");
    currentIndex += direction;
    if (currentIndex < 0) {
      currentIndex = totalSlides - 1;
    } else if (currentIndex >= totalSlides) {
      currentIndex = 0;
    }
    slidesElements[currentIndex].classList.add("active");
    modal.dataset.currentIndex = currentIndex;
    updateDots();
  }

  function updateDots() {
    const modal = document.getElementById("popupModal");
    const dotsContainer = modal.querySelector(".popup-dots");
    const dots = dotsContainer.querySelectorAll(".dot");
    const currentIndex = parseInt(modal.dataset.currentIndex);
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  }

  function setSlide(index) {
    const modal = document.getElementById("popupModal");
    const slideshowContainer = modal.querySelector(".popup-slideshow");
    const slidesElements = slideshowContainer.querySelectorAll("img");
    const currentIndex = parseInt(modal.dataset.currentIndex);
    if (index === currentIndex) return;
    slidesElements[currentIndex].classList.remove("active");
    slidesElements[index].classList.add("active");
    modal.dataset.currentIndex = index;
    updateDots();
  }

  document.getElementById("popup-prev").addEventListener("click", () => {
    changeSlide(-1);
  });
  document.getElementById("popup-next").addEventListener("click", () => {
    changeSlide(1);
  });
  document.getElementById("popup-close").addEventListener("click", closeModal);
  document.getElementById("popupModal").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  });
  // Fermeture du modal avec la touche Échap
  document.addEventListener("keydown", (e) => {
    const modal = document.getElementById("popupModal");
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

  function closeModal() {
    const modal = document.getElementById("popupModal");
    modal.classList.remove("active");
    document.body.style.overflow = "";
    // Retirer le focus trap
    releaseFocus(modal);
    // Restituer le focus à l'élément déclencheur
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  // Fonction pour piéger le focus dans le modal
  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    function handleFocus(e) {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    }
    element.addEventListener("keydown", handleFocus);
    // Sauvegarde du handler pour pouvoir le retirer plus tard
    element._handleFocus = handleFocus;
  }

  function releaseFocus(element) {
    if (element._handleFocus) {
      element.removeEventListener("keydown", element._handleFocus);
      delete element._handleFocus;
    }
  }
});
