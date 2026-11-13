const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');

const closeMenu = () => {
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Abrir menú');
  navMenu.classList.remove('is-open');
  document.body.classList.remove('nav-open');
};

navToggle.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
  navMenu.classList.toggle('is-open', !isOpen);
  document.body.classList.toggle('nav-open', !isOpen);
});

navLinks.forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('click', (event) => {
  if (document.body.classList.contains('nav-open') && !event.target.closest('.navbar')) {
    closeMenu();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && document.body.classList.contains('nav-open')) {
    closeMenu();
    navToggle.focus();
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const animateCounter = (counter) => {
  const target = Number(counter.dataset.count);
  const duration = 1400;
  const start = performance.now();

  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = `+${Math.floor(target * eased)}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  };

  requestAnimationFrame(update);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.55 }
);

document.querySelectorAll('.metric-number').forEach((counter) => counterObserver.observe(counter));

const leadForm = document.querySelector('.lead-form');
leadForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const submitButton = leadForm.querySelector('.form-submit');
  submitButton.textContent = 'Mensaje listo para enviar';

  setTimeout(() => {
    submitButton.textContent = 'Contácteme';
    leadForm.reset();
  }, 2200);
});

const officeCarousel = document.querySelector('.office-carousel');
if (officeCarousel) {
  const slides = [...officeCarousel.querySelectorAll('.office-slide')];
  const dots = [...officeCarousel.querySelectorAll('.office-dot')];
  const pauseButton = officeCarousel.querySelector('.office-pause');
  const status = officeCarousel.querySelector('.office-status');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let paused = false;
  let hovered = false;
  let focused = false;
  let timer;
  let touchStart = null;

  const schedule = () => {
    clearInterval(timer);
    if (!paused && !hovered && !focused && !document.hidden && !motion.matches) {
      timer = setInterval(() => show(index + 1), 5000);
    }
  };
  const show = (next, manual = false) => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === index);
      slide.setAttribute('aria-hidden', String(i !== index));
      dots[i].setAttribute('aria-current', String(i === index));
    });
    if (manual) status.textContent = `Fotografía ${index + 1} de ${slides.length}`;
  };
  const navigate = (next) => { show(next, true); schedule(); };
  officeCarousel.querySelector('.office-prev').addEventListener('click', () => navigate(index - 1));
  officeCarousel.querySelector('.office-next').addEventListener('click', () => navigate(index + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => navigate(i)));
  pauseButton.addEventListener('click', () => {
    paused = !paused;
    pauseButton.textContent = paused ? 'Reanudar' : 'Pausar';
    pauseButton.setAttribute('aria-label', paused ? 'Reanudar cambio automático' : 'Pausar cambio automático');
    schedule();
  });
  officeCarousel.addEventListener('mouseenter', () => { hovered = true; schedule(); });
  officeCarousel.addEventListener('mouseleave', () => { hovered = false; schedule(); });
  officeCarousel.addEventListener('focusin', () => { focused = true; schedule(); });
  officeCarousel.addEventListener('focusout', (event) => {
    focused = officeCarousel.contains(event.relatedTarget);
    schedule();
  });
  officeCarousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      navigate(index + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  officeCarousel.addEventListener('touchstart', (event) => {
    touchStart = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
    clearInterval(timer);
  }, { passive: true });
  officeCarousel.addEventListener('touchend', (event) => {
    if (touchStart && event.changedTouches.length) {
      const dx = event.changedTouches[0].clientX - touchStart.x;
      const dy = event.changedTouches[0].clientY - touchStart.y;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) navigate(index + (dx < 0 ? 1 : -1));
    }
    touchStart = null;
    schedule();
  }, { passive: true });
  officeCarousel.addEventListener('touchcancel', () => { touchStart = null; schedule(); }, { passive: true });
  const updateMotion = () => {
    pauseButton.hidden = motion.matches;
    schedule();
  };
  motion.addEventListener('change', updateMotion);
  document.addEventListener('visibilitychange', schedule);
  updateMotion();
}
