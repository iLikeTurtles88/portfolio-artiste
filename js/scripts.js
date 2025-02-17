document.addEventListener("DOMContentLoaded", () => {
  // Sauvegarde de l'élément déclencheur du modal
  let lastFocusedElement = null;

  /* ===== Scroll-to-top : correction ===== */
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  scrollTopBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

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

  /* ===== Gestion du scroll général ===== */
  const navbar = document.getElementById("navbar");
  const hero = document.getElementById("hero");
  const gearWheel = document.getElementById("gear-wheel");

  // Fonction d'easing (easeOutCubic)
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

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

    // Parallaxe pour le hero (inchangé)
    if (hero) {
      hero.style.backgroundPositionY = `${scrollPos * 0.5}px`;
    }

    // Mise à jour de la teinte pour les sections portfolio (inchangé)
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

    // --- Mise à jour des animations scroll-driven ---
    updateScrollAnimations();
  };

  // Système général de keyframes scroll-driven pour les éléments portant data-scroll-anim
  function updateScrollAnimations() {
    const animElements = document.querySelectorAll("[data-scroll-anim]");
    const viewportHeight = window.innerHeight;
    animElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      let progress = (viewportHeight - rect.top) / viewportHeight;
      progress = Math.max(0, Math.min(1, progress));
      // Appliquer l'easing
      const easedProgress = easeOutCubic(progress);

      // Récupération du type d'effet désiré
      const effect = el.getAttribute("data-scroll-effect") || "fadeUp";
      let transformStyle = "";

      switch (effect) {
        case "fadeUp": {
          // Accentuation légère : translation verticale de 50px, rotation de 10° et échelle de 0.93 à 1
          const translateY = (1 - easedProgress) * 50;
          const rotate = (1 - easedProgress) * 10;
          const scale = 0.93 + easedProgress * 0.07;
          transformStyle = `translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`;
          break;
        }
        case "slideLeft": {
          // Translation horizontale de -100px à 0
          const translateX = (1 - easedProgress) * -100;
          transformStyle = `translateX(${translateX}px)`;
          break;
        }
        case "zoomIn": {
          // Passage de l'échelle de 0.8 à 1
          const scaleZoom = 0.8 + easedProgress * 0.2;
          transformStyle = `scale(${scaleZoom})`;
          break;
        }
        case "rotateIn": {
          // Rotation de -15° à 0°
          const rotateVal = (1 - easedProgress) * -15;
          transformStyle = `rotate(${rotateVal}deg)`;
          break;
        }
        case "rotateSlide": {
          // Pour le formulaire de contact, on souhaite terminer l'animation dès 50% du viewport.
          let customProgress = Math.min(
            (viewportHeight - rect.top) / (viewportHeight * 0.5),
            1
          );
          customProgress = easeOutCubic(customProgress);
          const translateX = (1 - customProgress) * 100;
          const rotateVal = (1 - customProgress) * 15;
          transformStyle = `translateX(${translateX}px) rotate(${rotateVal}deg)`;
          break;
        }
        default: {
          const translateY = (1 - easedProgress) * 50;
          const rotate = (1 - easedProgress) * 10;
          const scale = 0.93 + easedProgress * 0.07;
          transformStyle = `translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`;
        }
      }

      el.style.opacity = easedProgress;
      el.style.transform = transformStyle;
    });
  }

  // Lancer la mise à jour au scroll et au chargement
  handleScroll();
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleScroll);

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
      const spinner = img
        .closest(".thumbnail-container")
        .querySelector(".spinner");
      if (spinner) {
        spinner.style.display = "none";
      }
    });
    if (img.complete) {
      const spinner = img
        .closest(".thumbnail-container")
        .querySelector(".spinner");
      if (spinner) {
        spinner.style.display = "none";
      }
    }
  });

  /* ===== GESTION DE LA POPUP & SLIDESHOW ===== */
  document
    .querySelectorAll(".thumbnail-container")
    .forEach((thumbContainer) => {
      thumbContainer.addEventListener("click", () => {
        lastFocusedElement = document.activeElement; // sauvegarde de l'élément déclencheur
        const thumbnailsContainer = thumbContainer.closest(".thumbnails");
        const images = thumbnailsContainer.querySelectorAll("img.thumbnail");
        const slides = [];
        images.forEach((img) => {
          slides.push(img.currentSrc.replace("-mini", ""));
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
    releaseFocus(modal);
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

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
    element._handleFocus = handleFocus;
  }

  function releaseFocus(element) {
    if (element._handleFocus) {
      element.removeEventListener("keydown", element._handleFocus);
      delete element._handleFocus;
    }
  }
});
