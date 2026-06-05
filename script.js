/* ═══════════════════════════════════════
   PORTFOLIO – David Christian
   script.js
═══════════════════════════════════════ */

// ── 1. NAV : active link au scroll ──
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a[href^="#"]');

function setActiveLink() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}
window.addEventListener('scroll', setActiveLink);
setActiveLink();

// ── 2. NAV : scroll smooth pour liens internes ──
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ── 3. Animation d'apparition au scroll (Intersection Observer) ──
const animElems = document.querySelectorAll(
  '.skill-card, .project-card, .contact-card, .about-inner, .hero-left'
);

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

animElems.forEach(el => {
  el.classList.add('fade-up');
  observer.observe(el);
});

// ── 4. Formulaire de contact : validation + feedback ──
const form    = document.querySelector('.contact-form');
const btnSend = document.querySelector('.btn-send');

if (form && btnSend) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    handleFormSubmit();
  });

  // Clic direct sur le bouton (au cas où pas de <form> wrapping)
  btnSend.addEventListener('click', () => {
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    handleFormSubmit();
  });
}

function handleFormSubmit() {
  const nom     = form.querySelector('input[type="text"]');
  const email   = form.querySelector('input[type="email"]');
  const message = form.querySelector('textarea');

  // Validation simple
  if (!nom.value.trim() || !email.value.trim() || !message.value.trim()) {
    showToast('⚠️  Veuillez remplir tous les champs.', 'warn');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    showToast('⚠️  Adresse email invalide.', 'warn');
    return;
  }

  // Simulation d'envoi (remplacez par un vrai fetch vers votre backend)
  btnSend.disabled = true;
  btnSend.textContent = 'Envoi en cours…';

  setTimeout(() => {
    showToast('✅  Message envoyé avec succès !', 'success');
    form.reset();
    btnSend.disabled = false;
    btnSend.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
      Envoyer le message`;
  }, 1200);
}

// ── 5. Toast de notification ──
function showToast(msg, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);

  // Style inline (indépendant du CSS)
  Object.assign(toast.style, {
    position:     'fixed',
    bottom:       '32px',
    right:        '32px',
    padding:      '14px 24px',
    borderRadius: '12px',
    fontSize:     '.9rem',
    fontFamily:   "'DM Sans', sans-serif",
    color:        '#fff',
    background:   type === 'success' ? '#059669' : '#b45309',
    boxShadow:    '0 8px 32px rgba(0,0,0,.4)',
    zIndex:       '9999',
    opacity:      '0',
    transform:    'translateY(12px)',
    transition:   'opacity .3s, transform .3s',
  });

  requestAnimationFrame(() => {
    toast.style.opacity   = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity   = '0';
    toast.style.transform = 'translateY(12px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ── 6. Bouton "Télécharger CV" : feedback visuel ──
document.querySelectorAll('.btn-cv, a[href="#"]').forEach(btn => {
  if (btn.textContent.trim().toLowerCase().includes('cv')) {
    btn.addEventListener('click', e => {
      e.preventDefault();
      showToast('📄  CV bientôt disponible au téléchargement.', 'warn');
    });
  }
});
