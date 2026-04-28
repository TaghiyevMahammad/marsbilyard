/* ====================================
   MARS BILYARD — JavaScript
   ==================================== */

'use strict';

// ── Page Loader ──────────────────────
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('done');
    setTimeout(() => loader.remove(), 900);
  }, 1800);
});

// ── Scroll Progress Bar ──────────────
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (window.scrollY / docHeight) * 100;
  progressBar.style.width = scrolled + '%';
}, { passive: true });

// ── Sticky Navbar ────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Hamburger Menu ───────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close nav on outside click
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ── Scroll Reveal (Intersection Observer) ──
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

// ── Ripple Effect ────────────────────
document.querySelectorAll('.ripple').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2;

    const ripple = document.createElement('span');
    ripple.classList.add('ripple-wave');
    ripple.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x - size / 2}px;
      top: ${y - size / 2}px;
    `;
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

// ── Menu Tabs ────────────────────────
const tabBtns = document.querySelectorAll('.tab-btn');
const menuPanels = document.querySelectorAll('.menu-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabBtns.forEach(b => b.classList.remove('active'));
    menuPanels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    const panel = document.getElementById('tab-' + target);
    if (panel) {
      panel.classList.add('active');
      // Re-trigger reveals in newly shown panel
      panel.querySelectorAll('.reveal:not(.visible)').forEach(el => {
        revealObserver.observe(el);
      });
    }
  });
});

// ── Reservation Form Validation ──────
const form = document.getElementById('reservation-form');
const formSuccess = document.getElementById('form-success');

function showError(fieldId, errId, message) {
  const field = document.getElementById(fieldId);
  const err = document.getElementById(errId);
  if (field) field.classList.add('error');
  if (err) err.textContent = message;
}

function clearErrors() {
  form.querySelectorAll('input, select, textarea').forEach(el => el.classList.remove('error'));
  form.querySelectorAll('.field-err').forEach(el => el.textContent = '');
}

function validateForm() {
  clearErrors();
  let valid = true;

  const name = document.getElementById('res-name').value.trim();
  const phone = document.getElementById('res-phone').value.trim();
  const date = document.getElementById('res-date').value;
  const time = document.getElementById('res-time').value;
  const service = document.getElementById('res-service').value;

  if (!name || name.length < 2) {
    showError('res-name', 'err-name', 'Ad ən az 2 simvol olmalıdır');
    valid = false;
  }

  const phoneClean = phone.replace(/[\s\-\(\)]/g, '');
  if (!phoneClean || !/^\+?[0-9]{9,15}$/.test(phoneClean)) {
    showError('res-phone', 'err-phone', 'Düzgün telefon nömrəsi daxil edin');
    valid = false;
  }

  if (!date) {
    showError('res-date', 'err-date', 'Tarix seçin');
    valid = false;
  } else {
    const selected = new Date(date);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (selected < today) {
      showError('res-date', 'err-date', 'Keçmiş tarix seçilə bilməz');
      valid = false;
    }
  }

  if (!time) {
    showError('res-time', 'err-time', 'Saat seçin');
    valid = false;
  }

  if (!service) {
    showError('res-service', 'err-service', 'Xidmət seçin');
    valid = false;
  }

  return valid;
}

if (form) {
  // Live validation: remove error styling on change
  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => {
      el.classList.remove('error');
      const errId = 'err-' + el.name;
      const errEl = document.getElementById(errId);
      if (errEl) errEl.textContent = '';
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Get form data
    const name = document.getElementById('res-name').value.trim();
    const phone = document.getElementById('res-phone').value.trim();
    const date = document.getElementById('res-date').value;
    const time = document.getElementById('res-time').value;
    const service = document.getElementById('res-service').value;
    const note = document.getElementById('res-note').value.trim();

    // Create WhatsApp message
    const message = `Salam! Mars Bilyard'a rezervasiya etmək istəyirəm:\n\nAdım: ${name}\nTelefonum: ${phone}\nTarix: ${date}\nSaat: ${time}\nXidmət: ${service}${note ? '\nQeyd: ' + note : ''}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/994107264904?text=${encodedMessage}`;

    // Show success message and redirect
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Göndərilir...';
    submitBtn.disabled = true;

    setTimeout(() => {
      formSuccess.hidden = false;
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      setTimeout(() => { 
        formSuccess.hidden = true;
        // Redirect to WhatsApp
        window.open(whatsappUrl, '_blank');
      }, 2000);
    }, 1200);
  });
}

// ── Gallery Lightbox ─────────────────
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');

let currentGalleryIndex = 0;
const galleryData = Array.from(galleryItems).map(item => ({
  src: item.dataset.src,
  alt: item.querySelector('img').alt
}));

function openLightbox(index) {
  currentGalleryIndex = index;
  const data = galleryData[index];
  lightboxImg.src = data.src;
  lightboxImg.alt = data.alt;
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  lightboxImg.style.opacity = '0';
  setTimeout(() => { lightboxImg.style.opacity = '1'; }, 50);
  lightboxImg.style.transition = 'opacity 0.3s ease';
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
}

function navigateLightbox(direction) {
  currentGalleryIndex = (currentGalleryIndex + direction + galleryData.length) % galleryData.length;
  const data = galleryData[currentGalleryIndex];
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src = data.src;
    lightboxImg.alt = data.alt;
    lightboxImg.style.opacity = '1';
  }, 200);
}

galleryItems.forEach((item, index) => {
  item.addEventListener('click', () => openLightbox(index));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
lightboxNext.addEventListener('click', () => navigateLightbox(1));

document.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);

document.addEventListener('keydown', (e) => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);
});

// ── Smooth scroll for anchor links ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Parallax on Hero Orbs ─────────────
const orbs = document.querySelectorAll('.hero-orb');
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  orbs.forEach((orb, i) => {
    const speed = (i + 1) * 0.15;
    orb.style.transform = `translateY(${sy * speed}px)`;
  });
}, { passive: true });

// ── Active nav link on scroll ─────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) current = section.id;
  });
  navAnchors.forEach(a => {
    a.classList.remove('active-link');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active-link');
  });
}, { passive: true });

// ── Set min date for reservation ──────
const resDate = document.getElementById('res-date');
if (resDate) {
  const today = new Date().toISOString().split('T')[0];
  resDate.min = today;
}

// ── Console Easter Egg ────────────────
console.log(
  '%c🔴 MARS BILYARD',
  'font-size:24px; font-weight:bold; color:#E8440A; text-shadow: 0 0 10px #E8440A;'
);
console.log('%cPremium Entertainment · Hövsan · Baku', 'color:#888; font-size:12px;');
console.log('%cPowered by Magify', 'color:#555; font-size:11px;');
