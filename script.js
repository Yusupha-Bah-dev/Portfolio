/* ==========================================================================
   PORTFOLIO MVP — SCRIPT
   Handles: mobile navigation, active nav-link tracking on scroll,
            contact form validation (client-side only, no backend),
            footer year.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initActiveNavTracking();
  initContactForm();
  setFooterYear();
});

/* ============ MOBILE NAV TOGGLE ============ */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  };

  const openMenu = () => {
    toggle.setAttribute('aria-expanded', 'true');
    nav.classList.add('is-open');
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  // Close the menu whenever a nav link is clicked (mobile UX)
  nav.querySelectorAll('[data-nav]').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Close if the viewport is resized back to desktop width
  window.addEventListener('resize', () => {
    if (window.innerWidth > 720) closeMenu();
  });
}

/* ============ ACTIVE LINK ON SCROLL ============ */
function initActiveNavTracking() {
  const links = document.querySelectorAll('[data-nav]');
  const sections = Array.from(links)
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (!sections.length) return;

  const setActive = (id) => {
    links.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ============ CONTACT FORM VALIDATION ============ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;

  const fields = {
    name: { el: form.querySelector('#name'), message: 'Please enter your name.' },
    email: { el: form.querySelector('#email'), message: 'Please enter a valid email address.' },
    message: { el: form.querySelector('#message'), message: 'Please enter a short message.' },
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateField(key) {
    const { el } = fields[key];
    const wrapper = el.closest('.form-field');
    const errorEl = form.querySelector(`[data-error-for="${key}"]`);
    let valid = true;

    if (!el.value.trim()) {
      valid = false;
    } else if (key === 'email' && !emailPattern.test(el.value.trim())) {
      valid = false;
    }

    wrapper.classList.toggle('has-error', !valid);
    if (errorEl) errorEl.textContent = valid ? '' : fields[key].message;
    return valid;
  }

  Object.keys(fields).forEach((key) => {
    fields[key].el.addEventListener('blur', () => validateField(key));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const results = Object.keys(fields).map((key) => validateField(key));
    const isValid = results.every(Boolean);

    if (!isValid) {
      status.textContent = 'Please fix the highlighted fields and try again.';
      return;
    }

    // No backend is wired up yet — replace this block with a real
    // submission (fetch to an API, a form service like Formspree, etc.)
    status.textContent = 'Thanks! This form is not yet connected to a server, so wire up your endpoint of choice to receive messages.';
    form.reset();
  });
}

/* ============ FOOTER YEAR ============ */
function setFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
