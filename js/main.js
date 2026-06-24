/* ==============================
   0. CONTROLES DE TAMAÑO DE FUENTE
   Web Storage → localStorage
============================== */
const FONT_SCALE_KEY = 'gym_font_scale';
const FONT_SCALES = {
  small: 0.85,
  normal: 1,
  large: 1.15,
  xlarge: 1.35
};

function getStoredFontScale() {
  const stored = localStorage.getItem(FONT_SCALE_KEY);
  return stored ? parseFloat(stored) : FONT_SCALES.normal;
}

function setStoredFontScale(scale) {
  localStorage.setItem(FONT_SCALE_KEY, scale.toString());
}

function applyFontScale(scale) {
  document.documentElement.style.setProperty('--font-scale', scale);
  updateFontScaleButtons(scale);
}

function updateFontScaleButtons(scale) {
  const decreaseBtn = document.getElementById('font-decrease');
  const resetBtn = document.getElementById('font-reset');
  const increaseBtn = document.getElementById('font-increase');
  
  if (!decreaseBtn || !resetBtn || !increaseBtn) return;

  // Remover clase active de todos
  decreaseBtn.classList.remove('active');
  resetBtn.classList.remove('active');
  increaseBtn.classList.remove('active');

  // Agregar clase active según la escala actual
  if (scale === FONT_SCALES.small) {
    decreaseBtn.classList.add('active');
  } else if (scale === FONT_SCALES.normal) {
    resetBtn.classList.add('active');
  } else if (scale >= FONT_SCALES.large) {
    increaseBtn.classList.add('active');
  }
}

function initFontScale() {
  const stored = getStoredFontScale();
  applyFontScale(stored);
}


initFontScale();


/* ==============================
   1. MODO OSCURO / CLARO
   Web Storage → localStorage
============================== */
const THEME_KEY = 'gym_theme_preference';

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY);
}

function setStoredTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light-mode');
  } else {
    document.body.classList.remove('light-mode');
  }
  updateThemeButton(theme);
}

function updateThemeButton(theme) {
  const btn = document.getElementById('theme-btn');
  if (!btn) return;
  if (theme === 'light') {
    btn.textContent = '🌙';
    btn.setAttribute('aria-label', 'Cambiar a modo oscuro');
    btn.setAttribute('title', 'Modo oscuro');
  } else {
    btn.textContent = '☀️';
    btn.setAttribute('aria-label', 'Cambiar a modo claro');
    btn.setAttribute('title', 'Modo claro');
  }
}

function initTheme() {
  // Recuperar preferencia guardada en localStorage (persistencia real al recargar)
  const stored = getStoredTheme();
  if (stored) {
    applyTheme(stored);
  } else {
    // Respetar preferencia del SO si no hay dato guardado
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }
}

function toggleTheme() {
  const isLight = document.body.classList.contains('light-mode');
  const newTheme = isLight ? 'dark' : 'light';
  applyTheme(newTheme);
  setStoredTheme(newTheme); // Guardar en localStorage → persistencia al recargar
}

initTheme();

document.addEventListener('DOMContentLoaded', function () {

  /* ==============================
   Botones de tamaño de fuente
============================== */
const decreaseBtn = document.getElementById('font-decrease');
const resetBtn = document.getElementById('font-reset');
const increaseBtn = document.getElementById('font-increase');

if (decreaseBtn) {
  decreaseBtn.addEventListener('click', function() {
    applyFontScale(FONT_SCALES.small);
    setStoredFontScale(FONT_SCALES.small);
  });
}

if (resetBtn) {
  resetBtn.addEventListener('click', function() {
    applyFontScale(FONT_SCALES.normal);
    setStoredFontScale(FONT_SCALES.normal);
  });
}

if (increaseBtn) {
  increaseBtn.addEventListener('click', function() {
    const currentScale = getStoredFontScale();
    const nextScale = currentScale >= FONT_SCALES.large ? FONT_SCALES.xlarge : FONT_SCALES.large;
    applyFontScale(nextScale);
    setStoredFontScale(nextScale);
  });
}
  /* ==============================
     Botón de tema
  ============================== */
  const themeBtn = document.getElementById('theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
    // Soporte teclado Enter/Space ya nativo para <button>
  }


  /* ==============================
     2. HEADER SCROLL
  ============================== */
  const header = document.getElementById('site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Ejecutar al inicio por si la página carga con scroll
  }


  /* ==============================
     3. MENÚ MÓVIL (accesible)
  ============================== */
  const menuBtn = document.getElementById('menu-btn');
  const navMenu = document.getElementById('nav-menu');

  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', isOpen.toString());
      menuBtn.textContent = isOpen ? '✕' : '☰';
      menuBtn.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');

      // Bloquear scroll del body cuando el menú está abierto
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Cerrar menú al hacer clic en un link del nav
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.textContent = '☰';
        menuBtn.setAttribute('aria-label', 'Abrir menú');
        document.body.style.overflow = '';
      });
    });

    // Cerrar menú con tecla Escape (accesibilidad WCAG)
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.textContent = '☰';
        menuBtn.setAttribute('aria-label', 'Abrir menú');
        document.body.style.overflow = '';
        menuBtn.focus(); // Devolver foco al botón (WCAG)
      }
    });
  }


  /* ==============================
     4. FORMULARIO DE CONTACTO
  ============================== */
  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (form && formStatus) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nombre = form.nombre.value.trim();
      const email = form.email.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Validación básica
      if (!nombre) {
        formStatus.textContent = '⚠️ Por favor ingresa tu nombre.';
        formStatus.style.color = '#e8624a';
        form.nombre.focus();
        return;
      }

      if (!email || !emailRegex.test(email)) {
        formStatus.textContent = '⚠️ Ingresa un correo electrónico válido.';
        formStatus.style.color = '#e8624a';
        form.email.focus();
        return;
      }

      // Simular envío exitoso
      formStatus.textContent = '✅ ¡Mensaje recibido! Te contactaremos pronto.';
      formStatus.style.color = 'var(--color-accent)';

      // Guardar en sessionStorage el nombre del usuario como preferencia de sesión
      sessionStorage.setItem('gym_last_contact_name', nombre);

      // Resetear formulario
      form.reset();

      // Limpiar mensaje después de 6 segundos
      setTimeout(() => {
        formStatus.textContent = '';
      }, 6000);
    });
  }


  /* ==============================
     5. AÑO DINÁMICO EN FOOTER
  ============================== */
  document.querySelectorAll('#footer-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });


  /* ==============================
     6. FADE-IN ON SCROLL
     IntersectionObserver accesible
  ============================== */
  // Respetar preferencia de movimiento reducido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    const fadeEls = document.querySelectorAll(
      '.about-grid, .service-row, .schedule-card, .routine-card, .routine-detail-card, .gallery-item, .contact-channel, .contact-form-block'
    );

    // Añadir estilos de fade inicial
    fadeEls.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeEls.forEach(el => observer.observe(el));
  }


  /* ==============================
     7. SMOOTH SCROLL (fallback para
        navegadores sin soporte CSS)
  ============================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Mover foco al target para accesibilidad de teclado
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });


  /* ==============================
     8. CARRUSEL DE GALERÍA
  ============================== */
  (function () {
    const track   = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsEl  = document.getElementById('carousel-dots');

    if (!track || !prevBtn || !nextBtn) return;

    const slides      = Array.from(track.querySelectorAll('.carousel-slide'));
    const total       = slides.length;
    const perPage     = () => window.innerWidth <= 700 ? 1 : 3;
    let   current     = 0; // índice del primer slide visible
    let   autoTimer   = null;

    // ── Calcular offset de un slide (ancho + gap) ──
    function slideWidth() {
      const gap = window.innerWidth <= 700 ? 0 : 16; // 1rem gap en px
      return slides[0].offsetWidth + gap;
    }

    // ── Número de "páginas" ──
    function totalPages() {
      return Math.ceil(total / perPage());
    }

    function currentPage() {
      return Math.floor(current / perPage());
    }

    // ── Mover el track ──
    function goTo(slideIndex) {
      const pp  = perPage();
      // Asegurarse de no pasar del último grupo completo
      const max = total - pp;
      current   = Math.max(0, Math.min(slideIndex, max));

      // Alinear al inicio del grupo más cercano
      current = Math.floor(current / pp) * pp;
      if (current > max) current = max;

      track.style.transform = `translateX(-${current * slideWidth()}px)`;
      updateState();
    }

    function goToPage(page) {
      goTo(page * perPage());
    }

    // ── Actualizar botones y puntos ──
    function updateState() {
      const pp   = perPage();
      const page = currentPage();
      const tp   = totalPages();

      prevBtn.disabled = current === 0;
      nextBtn.disabled = current >= total - pp;

      // Puntos
      if (dotsEl) {
        dotsEl.querySelectorAll('.carousel-dot').forEach((dot, i) => {
          dot.classList.toggle('active', i === page);
          dot.setAttribute('aria-selected', i === page ? 'true' : 'false');
        });
      }
    }

    // ── Crear puntos indicadores ──
    function buildDots() {
      if (!dotsEl) return;
      dotsEl.innerHTML = '';
      const tp = totalPages();
      for (let i = 0; i < tp; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Grupo ${i + 1} de ${tp}`);
        dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        dot.addEventListener('click', () => { goToPage(i); resetAuto(); });
        dotsEl.appendChild(dot);
      }
    }

    // ── Auto-play (cada 5 s) ──
    function startAuto() {
      autoTimer = setInterval(() => {
        const pp = perPage();
        if (current >= total - pp) {
          goTo(0);
        } else {
          goTo(current + pp);
        }
      }, 5000);
    }

    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }

    // ── Swipe táctil ──
    let touchStartX = 0;
    track.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        const pp = perPage();
        if (diff > 0) goTo(current + pp);
        else          goTo(current - pp);
        resetAuto();
      }
    }, { passive: true });

    // ── Teclado en el carrusel ──
    track.setAttribute('tabindex', '0');
    track.addEventListener('keydown', e => {
      const pp = perPage();
      if (e.key === 'ArrowRight') { goTo(current + pp); resetAuto(); }
      if (e.key === 'ArrowLeft')  { goTo(current - pp); resetAuto(); }
    });

    // ── Eventos de flechas ──
    prevBtn.addEventListener('click', () => {
      goTo(current - perPage());
      resetAuto();
    });

    nextBtn.addEventListener('click', () => {
      goTo(current + perPage());
      resetAuto();
    });

    // ── Recalcular al redimensionar ──
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        buildDots();
        goTo(0);
      }, 200);
    });

    // ── Detener auto-play si el usuario está en foco / hover ──
    track.addEventListener('mouseenter', () => clearInterval(autoTimer));
    track.addEventListener('mouseleave', startAuto);
    track.addEventListener('focusin',   () => clearInterval(autoTimer));
    track.addEventListener('focusout',  startAuto);

    // ── Init ──
    buildDots();
    goTo(0);
    startAuto();
  })();


  /* ==============================
     9. GALERÍA — lightbox básico
  ============================== */
  const galleryItems = document.querySelectorAll('.carousel-slide');
  galleryItems.forEach(item => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');

    const handleOpen = () => {
      const img = item.querySelector('img');
      if (!img || img.style.display === 'none') return;

      const overlay = document.createElement('div');
      overlay.id = 'gallery-lightbox';
      overlay.style.cssText = `
        position: fixed; inset: 0; z-index: 9999;
        background: rgba(0,0,0,0.92);
        display: flex; align-items: center; justify-content: center;
        cursor: pointer;
        animation: fadeIn 0.25s ease;
      `;
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-label', 'Vista ampliada de imagen');
      overlay.setAttribute('aria-modal', 'true');

      const imgClone = document.createElement('img');
      imgClone.src = img.src;
      imgClone.alt = img.alt;
      imgClone.style.cssText = `
        max-width: 92vw; max-height: 85vh;
        object-fit: contain; border-radius: 4px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.6);
      `;

      const closeBtn = document.createElement('button');
      closeBtn.textContent = '✕';
      closeBtn.setAttribute('aria-label', 'Cerrar imagen');
      closeBtn.style.cssText = `
        position: absolute; top: 1.5rem; right: 1.5rem;
        background: rgba(255,255,255,0.15); border: none;
        color: white; font-size: 1.4rem; width: 44px; height: 44px;
        border-radius: 50%; cursor: pointer; display: flex;
        align-items: center; justify-content: center;
      `;

      overlay.appendChild(imgClone);
      overlay.appendChild(closeBtn);
      document.body.appendChild(overlay);
      closeBtn.focus();

      const close = () => {
        overlay.remove();
        item.focus();
      };

      overlay.addEventListener('click', close);
      closeBtn.addEventListener('click', (e) => { e.stopPropagation(); close(); });
      document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escHandler); }
      });
    };

    item.addEventListener('click', handleOpen);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpen(); }
    });
  });

}); // fin DOMContentLoaded
