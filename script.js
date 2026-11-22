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
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    counter.textContent = `+${target}`;
    return;
  }
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
const serviceSelect = leadForm.querySelector('#service');
const planInterest = leadForm.querySelector('#plan-interest');
const planNote = leadForm.querySelector('#plan-interest-note');
const clearPlanInterest = () => {
  planInterest.value = '';
  planInterest.disabled = true;
  planNote.textContent = '';
  planNote.hidden = true;
};
serviceSelect.setAttribute('aria-describedby', 'plan-interest-note');
document.querySelectorAll('.plans a[data-plan]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    serviceSelect.value = 'Contabilidad';
    planInterest.value = link.dataset.plan;
    planInterest.disabled = false;
    planNote.textContent = `Plan de interés: ${link.dataset.plan}`;
    planNote.hidden = false;
    const target = document.querySelector('#formulario-consulta');
    target.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: 'center'
    });
    serviceSelect.focus({ preventScroll: true });
  });
});
serviceSelect.addEventListener('change', () => {
  if (serviceSelect.value !== 'Contabilidad') clearPlanInterest();
});
leadForm.addEventListener('reset', clearPlanInterest);

const nameInput = leadForm.elements.namedItem('name');
const phoneInput = leadForm.elements.namedItem('phone');
const validateContact = () => {
  nameInput.setCustomValidity(nameInput.value.trim().length < 2 ? 'Escribe tu nombre (al menos dos caracteres).' : '');
  const digits = phoneInput.value.replace(/\D/g, '');
  const validPhone = /^\+?[0-9\s().-]+$/.test(phoneInput.value.trim()) && digits.length >= 7 && digits.length <= 15;
  phoneInput.setCustomValidity(validPhone ? '' : 'Escribe un teléfono válido con entre 7 y 15 dígitos.');
};
nameInput.addEventListener('input', validateContact);
phoneInput.addEventListener('input', validateContact);

leadForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (leadForm.getAttribute('aria-busy') === 'true') return;
  validateContact();
  if (!leadForm.reportValidity()) return;

  const submitButton = leadForm.querySelector('.form-submit');
  const status = leadForm.querySelector('.form-status');
  if (leadForm.elements.namedItem('_gotcha').value) {
    status.hidden = false;
    status.textContent = 'No pudimos procesar la consulta. Revisa los datos y vuelve a intentarlo.';
    return;
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  submitButton.disabled = true;
  leadForm.setAttribute('aria-busy', 'true');
  status.hidden = false;
  status.textContent = 'Enviando tu consulta…';

  try {
    const response = await fetch(leadForm.action, {
      method: 'POST',
      body: (() => {
        const data = new FormData(leadForm);
        for (const key of ['name', 'email', 'phone']) data.set(key, String(data.get(key)).trim());
        return data;
      })(),
      headers: { Accept: 'application/json' },
      signal: controller.signal
    });
    const result = await response.json();
    if (!response.ok || result.ok !== true) throw new Error('Submission not confirmed');

    status.textContent = 'Recibimos tu consulta';
    leadForm.reset();
    nameInput.setCustomValidity('');
    phoneInput.setCustomValidity('');
  } catch (error) {
    status.textContent = error.name === 'AbortError'
      ? 'No pudimos confirmar la recepción a tiempo. Tus datos se conservaron; puedes reintentar.'
      : 'No pudimos enviar tu consulta. Tus datos se conservaron; vuelve a intentarlo.';
  } finally {
    clearTimeout(timeout);
    submitButton.disabled = false;
    leadForm.removeAttribute('aria-busy');
  }
});

const officeCarousel = document.querySelector('.office-carousel');
if (officeCarousel) {
  const slides = [...officeCarousel.querySelectorAll('.office-slide')];
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let timer;

  const schedule = () => {
    clearInterval(timer);
    if (!document.hidden && !motion.matches && slides.length > 1) {
      timer = setInterval(() => {
        index = (index + 1) % slides.length;
        slides.forEach((slide, i) => {
          slide.classList.toggle('is-active', i === index);
          slide.setAttribute('aria-hidden', String(i !== index));
        });
      }, 5000);
    }
  };
  motion.addEventListener('change', schedule);
  document.addEventListener('visibilitychange', schedule);
  schedule();
}

const clientsTrack = document.querySelector('.clients-track');
if (clientsTrack) {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const originals = [...clientsTrack.children];
  const copies = originals.map((item) => {
    const copy = item.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.querySelectorAll('img').forEach((img) => { img.alt = ''; });
    clientsTrack.append(copy);
    return copy;
  });
  let frame;
  let previousTime;
  let position = clientsTrack.scrollLeft;
  let speed = 1;
  let fromSpeed = 1;
  let targetSpeed = 1;
  let speedStartedAt = 0;
  const speedAt = (now) => {
    const progress = Math.min(Math.max((now - speedStartedAt) / 400, 0), 1);
    const eased = progress * progress * (3 - 2 * progress);
    return fromSpeed + (targetSpeed - fromSpeed) * eased;
  };
  let touching = false;
  let keyboardFocused = false;
  const cycleWidth = () => copies[0].getBoundingClientRect().left - originals[0].getBoundingClientRect().left;
  const tick = (now) => {
    const requestedSpeed = Number(getComputedStyle(clientsTrack).getPropertyValue('--clients-speed')) || 1;
    const previousSpeed = speed;
    speed = speedAt(now);
    if (requestedSpeed !== targetSpeed) {
      fromSpeed = speed;
      targetSpeed = requestedSpeed;
      speedStartedAt = now;
    }
    if (previousTime !== undefined) {
      position += Math.min(now - previousTime, 64) * 0.018 * (previousSpeed + speed) / 2;
      const cycle = cycleWidth();
      if (cycle > 0) position %= cycle;
      clientsTrack.scrollLeft = position;
    }
    previousTime = now;
    frame = requestAnimationFrame(tick);
  };
  const scheduleClients = () => {
    cancelAnimationFrame(frame);
    previousTime = undefined;
    copies.forEach((copy) => { copy.hidden = motion.matches; });
    if (motion.matches || document.hidden || touching || keyboardFocused) return;
    position = clientsTrack.scrollLeft;
    frame = requestAnimationFrame(tick);
  };
  clientsTrack.addEventListener('focusin', () => {
    keyboardFocused = clientsTrack.matches(':focus-visible');
    scheduleClients();
  });
  clientsTrack.addEventListener('focusout', () => { keyboardFocused = false; scheduleClients(); });
  clientsTrack.addEventListener('touchstart', () => { touching = true; scheduleClients(); }, { passive: true });
  const endTouch = () => { touching = false; scheduleClients(); };
  clientsTrack.addEventListener('touchend', endTouch, { passive: true });
  clientsTrack.addEventListener('touchcancel', endTouch, { passive: true });
  document.addEventListener('visibilitychange', () => { touching = false; scheduleClients(); });
  window.addEventListener('resize', scheduleClients);
  motion.addEventListener('change', scheduleClients);
  scheduleClients();
}

