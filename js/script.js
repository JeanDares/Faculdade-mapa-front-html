/**
 * Serra Gaúcha Turismo - JavaScript Principal
 * Arquivo responsável por todas as interações e animações do site
 */

// ===== VARIÁVEIS GLOBAIS =====
let isLoading = true;
let scrolled = false;

// ===== DOCUMENT READY =====
$(document).ready(function () {
  initializeWebsite();
});

// ===== INICIALIZAÇÃO DO WEBSITE =====
function initializeWebsite() {
  // Simular loading
  setTimeout(function () {
    hideLoadingScreen();
    initializeAnimations();
    bindEvents();
  }, 2000);
}

// ===== LOADING SCREEN =====
function hideLoadingScreen() {
  $("#loading-screen").fadeOut(500, function () {
    isLoading = false;
    $("body").removeClass("loading");
  });
}

// ===== INICIALIZAR ANIMAÇÕES =====
function initializeAnimations() {
  // Inicializar AOS (Animate On Scroll)
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 100,
    });
  }

  // Animação dos números/contadores
  animateCounters();

  // Animação de digitação no hero
  typewriterEffect();
}

// ===== BIND EVENTS =====
function bindEvents() {
  // Scroll events
  $(window).on("scroll", handleScroll);

  // Navbar events
  $(".nav-link").on("click", handleNavClick);

  // Newsletter form
  $("#newsletterForm").on("submit", handleNewsletterSubmit);

  // Back to top button
  $("#backToTop").on("click", scrollToTop);

  // Smooth scrolling para links internos
  $('a[href*="#"]').on("click", handleSmoothScroll);

  // Parallax effect no hero
  $(window).on("scroll", parallaxEffect);

  // Lazy loading de imagens
  lazyLoadImages();

  // Resize event
  $(window).on("resize", handleResize);
}

// ===== SCROLL HANDLING =====
function handleScroll() {
  const scrollTop = $(window).scrollTop();

  // Navbar scroll effect
  if (scrollTop > 100 && !scrolled) {
    $("#mainNavbar").addClass("scrolled");
    scrolled = true;
  } else if (scrollTop <= 100 && scrolled) {
    $("#mainNavbar").removeClass("scrolled");
    scrolled = false;
  }

  // Back to top button
  if (scrollTop > 300) {
    $("#backToTop").addClass("show");
  } else {
    $("#backToTop").removeClass("show");
  }

  // Active nav link baseado na seção visível
  updateActiveNavLink();
}

// ===== NAVEGAÇÃO =====
function handleNavClick(e) {
  // Fechar navbar mobile após clique
  $(".navbar-collapse").collapse("hide");

  // Atualizar active state
  $(".nav-link").removeClass("active");
  $(this).addClass("active");
}

function updateActiveNavLink() {
  const scrollTop = $(window).scrollTop();
  const windowHeight = $(window).height();

  $("section[id]").each(function () {
    const section = $(this);
    const sectionTop = section.offset().top - 100;
    const sectionHeight = section.outerHeight();

    if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
      const sectionId = section.attr("id");
      $(".nav-link").removeClass("active");
      $(`.nav-link[href*="${sectionId}"]`).addClass("active");
    }
  });
}

// ===== SMOOTH SCROLLING =====
function handleSmoothScroll(e) {
  const target = $(this.getAttribute("href"));

  if (target.length) {
    e.preventDefault();
    $("html, body").animate(
      {
        scrollTop: target.offset().top - 80,
      },
      1000,
      "easeInOutCubic"
    );
  }
}

function scrollToTop() {
  $("html, body").animate(
    {
      scrollTop: 0,
    },
    1000,
    "easeInOutCubic"
  );
}

// ===== PARALLAX EFFECT =====
function parallaxEffect() {
  const scrolled = $(window).scrollTop();
  const parallaxSpeed = 0.5;

  $(".hero-background").css(
    "transform",
    `translateY(${scrolled * parallaxSpeed}px)`
  );
}

// ===== NEWSLETTER =====
function handleNewsletterSubmit(e) {
  e.preventDefault();

  const email = $("#newsletterEmail").val();
  const messageDiv = $("#newsletterMessage");
  const submitBtn = $(this).find('button[type="submit"]');

  if (!isValidEmail(email)) {
    showNewsletterMessage("Por favor, insira um e-mail válido.", "error");
    return;
  }

  // Mostrar loading
  const originalText = submitBtn.html();
  submitBtn
    .html('<i class="fas fa-spinner fa-spin"></i> Enviando...')
    .prop("disabled", true);

  // Simular envio (em produção, fazer requisição AJAX real)
  setTimeout(function () {
    // Simular sucesso
    showNewsletterMessage(
      "Obrigado! Você foi inscrito com sucesso em nossa newsletter.",
      "success"
    );
    $("#newsletterEmail").val("");

    // Restaurar botão
    submitBtn.html(originalText).prop("disabled", false);

    // Limpar mensagem após 5 segundos
    setTimeout(function () {
      messageDiv.fadeOut();
    }, 5000);
  }, 2000);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showNewsletterMessage(message, type) {
  const messageDiv = $("#newsletterMessage");
  messageDiv.removeClass("success error").addClass(type).text(message).fadeIn();
}

// ===== ANIMAÇÃO DE CONTADORES =====
function animateCounters() {
  $(".counter").each(function () {
    const $this = $(this);
    const target = parseInt($this.data("target"));

    $this.prop("Counter", 0).animate(
      {
        Counter: target,
      },
      {
        duration: 2000,
        easing: "swing",
        step: function (now) {
          $this.text(Math.ceil(now));
        },
      }
    );
  });
}

// ===== EFEITO DE DIGITAÇÃO =====
function typewriterEffect() {
  const texts = [
    "Paisagens Deslumbrantes",
    "Gastronomia Única",
    "Vinhos Premiados",
    "Hospitalidade Gaúcha",
  ];

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 100;
  const deleteSpeed = 50;
  const delayBetweenTexts = 2000;

  function typeEffect() {
    const currentText = texts[textIndex];
    const typewriterElement = $("#typewriter-text");

    if (!typewriterElement.length) return;

    if (isDeleting) {
      typewriterElement.text(currentText.substring(0, charIndex - 1));
      charIndex--;
    } else {
      typewriterElement.text(currentText.substring(0, charIndex + 1));
      charIndex++;
    }

    let speed = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentText.length) {
      speed = delayBetweenTexts;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
    }

    setTimeout(typeEffect, speed);
  }

  typeEffect();
}

// ===== LAZY LOADING DE IMAGENS =====
function lazyLoadImages() {
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  }
}

// ===== EFEITOS INTERATIVOS =====
// Efeito hover nos cards
$(document).on(
  "mouseenter",
  ".feature-card, .cidade-card, .experiencia-card",
  function () {
    $(this).addClass("hover-effect");
  }
);

$(document).on(
  "mouseleave",
  ".feature-card, .cidade-card, .experiencia-card",
  function () {
    $(this).removeClass("hover-effect");
  }
);

// Efeito de reveal nas imagens
function revealImages() {
  const images = document.querySelectorAll(".reveal-image");

  images.forEach((image) => {
    const imageTop = image.getBoundingClientRect().top;
    const imageBottom = image.getBoundingClientRect().bottom;

    if (imageTop < window.innerHeight && imageBottom > 0) {
      image.classList.add("revealed");
    }
  });
}

// ===== MODAL DINÂMICO =====
function createModal(title, content, size = "lg") {
  const modalId = "dynamicModal";

  // Remover modal existente
  $(`#${modalId}`).remove();

  const modalHTML = `
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
            <div class="modal-dialog modal-${size} modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="${modalId}Label">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                </div>
            </div>
        </div>
    `;

  $("body").append(modalHTML);
  $(`#${modalId}`).modal("show");
}

// ===== GALERIA DE IMAGENS =====
function initializeGallery() {
  $(".gallery-image").on("click", function () {
    const src = $(this).attr("src");
    const alt = $(this).attr("alt");

    const galleryContent = `
            <div class="text-center">
                <img src="${src}" alt="${alt}" class="img-fluid rounded">
                <p class="mt-3 text-muted">${alt}</p>
            </div>
        `;

    createModal("Galeria de Imagens", galleryContent, "xl");
  });
}

// ===== FILTROS DE CONTEÚDO =====
function initializeFilters() {
  $(".filter-btn").on("click", function () {
    const filter = $(this).data("filter");

    $(".filter-btn").removeClass("active");
    $(this).addClass("active");

    if (filter === "all") {
      $(".filterable-item").fadeIn(400);
    } else {
      $(".filterable-item").fadeOut(200);
      $(`.filterable-item[data-category="${filter}"]`).fadeIn(400);
    }
  });
}

// ===== BUSCA AVANÇADA =====
function initializeSearch() {
  $("#searchInput").on("input", function () {
    const searchTerm = $(this).val().toLowerCase();

    $(".searchable-item").each(function () {
      const itemText = $(this).text().toLowerCase();

      if (itemText.includes(searchTerm)) {
        $(this).fadeIn(300);
      } else {
        $(this).fadeOut(300);
      }
    });
  });
}

// ===== MAPA INTERATIVO =====
function initializeMap() {
  // Placeholder para integração com Google Maps ou Leaflet
  const mapContainer = $("#map-container");

  if (mapContainer.length) {
    mapContainer.html(`
            <div class="map-placeholder">
                <i class="fas fa-map-marked-alt fa-3x mb-3"></i>
                <h5>Mapa da Serra Gaúcha</h5>
                <p>Clique aqui para ver os pontos turísticos no mapa interativo</p>
            </div>
        `);

    mapContainer.on("click", function () {
      // Abrir mapa em nova aba ou modal
      window.open(
        "https://maps.google.com/search/serra+gaucha+pontos+turisticos",
        "_blank"
      );
    });
  }
}

// ===== WEATHER WIDGET =====
function initializeWeather() {
  const weatherContainer = $("#weather-widget");

  if (weatherContainer.length) {
    // Simular dados de clima (em produção usar API real)
    const weatherData = {
      location: "Gramado, RS",
      temperature: "18°C",
      condition: "Parcialmente nublado",
      humidity: "65%",
      wind: "12 km/h",
      icon: "fas fa-cloud-sun",
    };

    const weatherHTML = `
            <div class="weather-card">
                <div class="weather-header">
                    <i class="${weatherData.icon} fa-2x"></i>
                    <div>
                        <h6>${weatherData.location}</h6>
                        <span class="temperature">${weatherData.temperature}</span>
                    </div>
                </div>
                <div class="weather-details">
                    <div class="weather-item">
                        <i class="fas fa-eye"></i>
                        <span>${weatherData.condition}</span>
                    </div>
                    <div class="weather-item">
                        <i class="fas fa-tint"></i>
                        <span>${weatherData.humidity}</span>
                    </div>
                    <div class="weather-item">
                        <i class="fas fa-wind"></i>
                        <span>${weatherData.wind}</span>
                    </div>
                </div>
            </div>
        `;

    weatherContainer.html(weatherHTML);
  }
}

// ===== TOOLTIP INITIALIZATION =====
function initializeTooltips() {
  // Inicializar tooltips do Bootstrap
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

// ===== CAROUSEL CUSTOMIZADO =====
function initializeCustomCarousel() {
  $(".custom-carousel").each(function () {
    const carousel = $(this);
    const items = carousel.find(".carousel-item");
    const indicators = carousel.find(".carousel-indicators");
    let currentIndex = 0;

    // Auto play
    setInterval(function () {
      currentIndex = (currentIndex + 1) % items.length;
      showCarouselItem(carousel, currentIndex);
    }, 5000);

    // Click nos indicadores
    indicators.on("click", ".indicator", function () {
      currentIndex = $(this).data("index");
      showCarouselItem(carousel, currentIndex);
    });
  });
}

function showCarouselItem(carousel, index) {
  const items = carousel.find(".carousel-item");
  const indicators = carousel.find(".indicator");

  items.removeClass("active").eq(index).addClass("active");
  indicators.removeClass("active").eq(index).addClass("active");
}

// ===== EFEITOS DE ENTRADA =====
function initializeScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal-on-scroll");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
}

// ===== FORM VALIDATION =====
function setupFormValidation() {
  $("form").each(function () {
    const form = $(this);

    form.on("submit", function (e) {
      if (!validateForm(form)) {
        e.preventDefault();
        e.stopPropagation();
      }

      form.addClass("was-validated");
    });

    // Validação em tempo real
    form.find("input, textarea, select").on("blur", function () {
      validateField($(this));
    });
  });
}

function validateForm(form) {
  let isValid = true;

  form.find("[required]").each(function () {
    if (!validateField($(this))) {
      isValid = false;
    }
  });

  return isValid;
}

function validateField(field) {
  const value = field.val().trim();
  const type = field.attr("type");
  let isValid = true;
  let errorMessage = "";

  // Validação de campo obrigatório
  if (field.prop("required") && !value) {
    isValid = false;
    errorMessage = "Este campo é obrigatório.";
  }

  // Validação específica por tipo
  if (value && type === "email") {
    if (!isValidEmail(value)) {
      isValid = false;
      errorMessage = "Por favor, insira um e-mail válido.";
    }
  }

  if (value && type === "tel") {
    if (value.replace(/\D/g, "").length < 10) {
      isValid = false;
      errorMessage = "Telefone deve ter pelo menos 10 dígitos.";
    }
  }

  // Mostrar/esconder mensagem de erro
  showFieldError(field, isValid, errorMessage);

  return isValid;
}

function showFieldError(field, isValid, message) {
  const errorDiv = field.siblings(".error-message");

  if (isValid) {
    field.removeClass("is-invalid").addClass("is-valid");
    errorDiv.hide();
  } else {
    field.removeClass("is-valid").addClass("is-invalid");
    errorDiv.text(message).show();
  }
}

// ===== RESIZE HANDLER =====
function handleResize() {
  // Ajustar elementos responsivos
  adjustResponsiveElements();

  // Recalcular posições de elementos fixos
  updateFixedElements();
}

function adjustResponsiveElements() {
  const windowWidth = $(window).width();

  // Ajustar navbar mobile
  if (windowWidth < 992) {
    $(".navbar-nav").addClass("mobile-nav");
  } else {
    $(".navbar-nav").removeClass("mobile-nav");
  }

  // Ajustar cards em mobile
  if (windowWidth < 768) {
    $(".experiencia-destaque").addClass("mobile-stack");
    $(".experiencia-pequena").addClass("mobile-stack");
  } else {
    $(".experiencia-destaque").removeClass("mobile-stack");
    $(".experiencia-pequena").removeClass("mobile-stack");
  }
}

function updateFixedElements() {
  // Recalcular posição do back to top
  const backToTop = $("#backToTop");
  if ($(window).width() < 576) {
    backToTop.css({
      bottom: "20px",
      right: "20px",
    });
  } else {
    backToTop.css({
      bottom: "30px",
      right: "30px",
    });
  }
}

// ===== PERFORMANCE OPTIMIZATION =====
function optimizePerformance() {
  // Debounce scroll events
  let scrollTimer = null;
  $(window)
    .off("scroll.optimized")
    .on("scroll.optimized", function () {
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }

      scrollTimer = setTimeout(function () {
        handleScroll();
        parallaxEffect();
        revealImages();
      }, 10);
    });

  // Debounce resize events
  let resizeTimer = null;
  $(window)
    .off("resize.optimized")
    .on("resize.optimized", function () {
      if (resizeTimer) {
        clearTimeout(resizeTimer);
      }

      resizeTimer = setTimeout(function () {
        handleResize();
      }, 100);
    });
}

// ===== ACCESSIBILITY =====
function setupAccessibility() {
  // Navegação por teclado
  $(document).on("keydown", function (e) {
    // ESC para fechar modais
    if (e.key === "Escape") {
      $(".modal").modal("hide");
    }

    // Enter e Space para botões
    if ((e.key === "Enter" || e.key === " ") && $(e.target).hasClass("btn")) {
      e.preventDefault();
      $(e.target).click();
    }
  });

  // Focus trap em modais
  $(".modal").on("shown.bs.modal", function () {
    $(this).find("[tabindex], button, input, select, textarea").first().focus();
  });

  // Anúncios para screen readers
  updateAriaLabels();
}

function updateAriaLabels() {
  // Atualizar aria-labels dinamicamente
  $(".nav-link.active").attr("aria-current", "page");
  $(".nav-link").not(".active").removeAttr("aria-current");
}

// ===== COOKIES E PREFERÊNCIAS =====
function setupCookieConsent() {
  if (!localStorage.getItem("cookieConsent")) {
    showCookieConsent();
  }
}

function showCookieConsent() {
  const consentHTML = `
        <div id="cookieConsent" class="cookie-consent">
            <div class="cookie-content">
                <p>Este site utiliza cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa política de cookies.</p>
                <div class="cookie-buttons">
                    <button class="btn btn-accent btn-sm" onclick="acceptCookies()">Aceitar</button>
                    <button class="btn btn-outline-light btn-sm" onclick="showCookiePolicy()">Saiba Mais</button>
                </div>
            </div>
        </div>
    `;

  $("body").append(consentHTML);
  $("#cookieConsent").slideDown(300);
}

function acceptCookies() {
  localStorage.setItem("cookieConsent", "true");
  $("#cookieConsent").slideUp(300, function () {
    $(this).remove();
  });
}

function showCookiePolicy() {
  const policyContent = `
        <h6>Política de Cookies</h6>
        <p>Utilizamos cookies essenciais para o funcionamento do site, cookies de análise para entender como você usa o site, e cookies de preferência para lembrar suas configurações.</p>
        <p>Você pode gerenciar suas preferências de cookies a qualquer momento através das configurações do seu navegador.</p>
    `;

  createModal("Política de Cookies", policyContent);
}

// ===== DARK MODE =====
function setupDarkMode() {
  const darkModeToggle = $("#darkModeToggle");
  const currentTheme = localStorage.getItem("theme") || "light";

  // Aplicar tema salvo
  if (currentTheme === "dark") {
    $("body").addClass("dark-mode");
    darkModeToggle.find("i").removeClass("fa-moon").addClass("fa-sun");
  }

  // Toggle dark mode
  darkModeToggle.on("click", function () {
    $("body").toggleClass("dark-mode");

    if ($("body").hasClass("dark-mode")) {
      localStorage.setItem("theme", "dark");
      $(this).find("i").removeClass("fa-moon").addClass("fa-sun");
    } else {
      localStorage.setItem("theme", "light");
      $(this).find("i").removeClass("fa-sun").addClass("fa-moon");
    }
  });
}

// ===== INICIALIZAÇÃO COMPLETA =====
$(window).on("load", function () {
  // Funcionalidades que dependem do carregamento completo
  initializeGallery();
  initializeFilters();
  initializeSearch();
  initializeMap();
  initializeWeather();
  initializeTooltips();
  initializeCustomCarousel();
  initializeScrollReveal();
  setupFormValidation();
  optimizePerformance();
  setupAccessibility();
  setupCookieConsent();
  setupDarkMode();

  console.log("🎉 Serra Gaúcha Turismo carregado com sucesso!");
});

// ===== EASING CUSTOMIZADO =====
$.easing.easeInOutCubic = function (x, t, b, c, d) {
  if ((t /= d / 2) < 1) return (c / 2) * t * t * t + b;
  return (c / 2) * ((t -= 2) * t * t + 2) + b;
};

// ===== SERVICE WORKER (PARA PWA) =====
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/sw.js")
      .then(function (registration) {
        console.log(
          "ServiceWorker registrado com sucesso: ",
          registration.scope
        );
      })
      .catch(function (error) {
        console.log("Falha ao registrar ServiceWorker: ", error);
      });
  });
}
