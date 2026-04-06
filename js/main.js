/* ============================================================
   MAIN.JS — Shared across all pages
   Gwensi Koekie Spensie
   ============================================================ */

'use strict';

/* ── Scroll Header ──────────────────────────────────────────── */
(function initScrollHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const THRESHOLD = 80;

  function onScroll() {
    header.classList.toggle('site-header--scrolled', window.scrollY > THRESHOLD);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();

/* ── Mobile Nav ─────────────────────────────────────────────── */
(function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('main-nav');
  if (!hamburger || !nav) return;

  function openNav() {
    nav.classList.add('nav--open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    nav.classList.remove('nav--open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.contains('nav--open');
    isOpen ? closeNav() : openNav();
  });

  // Close when a nav link is clicked
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeNav();
  });

  // Close on outside click (backdrop tap)
  document.addEventListener('click', e => {
    if (nav.classList.contains('nav--open') &&
        !nav.contains(e.target) &&
        !hamburger.contains(e.target)) {
      closeNav();
    }
  });
})();

/* ── Active Nav Link ────────────────────────────────────────── */
(function markActiveNav() {
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-list a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage ||
        (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ── Smooth Scroll for In-page Anchors ─────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ── Scroll Reveal (IntersectionObserver) ───────────────────── */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    // Fallback: show all immediately
    elements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();

/* ── Hero Ken Burns Effect ──────────────────────────────────── */
(function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  // Small delay then add class to trigger scale transition
  requestAnimationFrame(() => {
    setTimeout(() => hero.classList.add('hero--loaded'), 100);
  });
})();

/* ── Staggered Reveal for Chip Groups ───────────────────────── */
(function initChipStagger() {
  const groups = document.querySelectorAll('[data-stagger]');
  groups.forEach(group => {
    const children = group.querySelectorAll('.flavour-chip');
    children.forEach((chip, i) => {
      chip.style.transitionDelay = `${i * 45}ms`;
      chip.classList.add('reveal');
    });
  });
})();

/* ── FAQ Accordion ──────────────────────────────────────────── */
(function initFAQ() {
  const questions = document.querySelectorAll('.faq-question');
  if (!questions.length) return;

  questions.forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all
      questions.forEach(q => {
        q.setAttribute('aria-expanded', 'false');
        const a = q.nextElementSibling;
        if (a) a.style.maxHeight = null;
      });

      // Open clicked if it was closed
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
})();

/* ── Lazy Image Load Observer ───────────────────────────────── */
(function initLazyImages() {
  const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
  if (!lazyImgs.length) return;
  lazyImgs.forEach(img => {
    if (img.complete) {
      img.classList.add('img--loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('img--loaded'));
    }
  });
})();

/* ── Scroll-to-top Button ───────────────────────────────────── */
(function initScrollToTop() {
  const btn = document.getElementById('scroll-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
