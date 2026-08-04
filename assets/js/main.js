/* =========================================================
   ELEVAR PILATES — main.js
   ========================================================= */
(function () {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- preloader ---------- */
  const preloader = $('#preloader');
  const hidePreloader = () => preloader && preloader.classList.add('is-done');
  window.addEventListener('load', () => setTimeout(hidePreloader, 500));
  setTimeout(hidePreloader, 2600); // fallback

  /* ---------- ano no rodapé ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- header + progresso de scroll + botão flutuante ---------- */
  const header   = $('#header');
  const progress = $('#scrollProgress');
  const waFloat  = $('#waFloat');
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;

    header.classList.toggle('is-stuck', y > 40);
    if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (waFloat) waFloat.classList.toggle('is-visible', y > window.innerHeight * 0.6);

    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- menu mobile ---------- */
  const burger = $('#burger');
  const nav = $('#nav');
  if (burger && nav) {
    const toggleNav = (open) => {
      burger.classList.toggle('is-open', open);
      nav.classList.toggle('is-open', open);
      header.classList.toggle('is-nav-open', open);
      document.body.classList.toggle('is-locked', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    };
    burger.addEventListener('click', () => toggleNav(!nav.classList.contains('is-open')));
    $$('a', nav).forEach(a => a.addEventListener('click', () => toggleNav(false)));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) toggleNav(false);
    });
  }

  /* ---------- reveal on scroll ---------- */
  const revealables = $$('.reveal, .reveal-left, .reveal-right');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealables.forEach(el => io.observe(el));
  } else {
    revealables.forEach(el => el.classList.add('is-in'));
  }

  /* ---------- link ativo na navegação ---------- */
  const sections = $$('main section[id]');
  const navLinks = $$('.nav a');
  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + id));
      });
    }, { threshold: 0.35, rootMargin: '-20% 0px -55% 0px' });
    sections.forEach(s => spy.observe(s));
  }

  /* ---------- glow que segue o mouse nos cards ---------- */
  if (!reducedMotion && window.matchMedia('(hover: hover)').matches) {
    $$('.bcard').forEach(card => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  /* ---------- parallax leve nas molduras ---------- */
  if (!reducedMotion && window.matchMedia('(min-width: 901px)').matches) {
    const parallaxItems = $$('.frame--tilt, .cta__bg img');
    let rafId = null;
    const runParallax = () => {
      parallaxItems.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const progress = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
        el.style.transform = `translate3d(0, ${(progress * -22).toFixed(2)}px, 0)`;
      });
      rafId = null;
    };
    window.addEventListener('scroll', () => {
      if (rafId === null) rafId = window.requestAnimationFrame(runParallax);
    }, { passive: true });
    runParallax();
  }

  /* ---------- carrossel de depoimentos ---------- */
  const track = $('#quotesTrack');
  const dotsBox = $('#quotesDots');
  if (track && dotsBox) {
    const slides = $$('.quote', track);
    let index = 0;
    let timer = null;

    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `Depoimento ${i + 1}`);
      b.addEventListener('click', () => { go(i); restart(); });
      dotsBox.appendChild(b);
    });
    const dots = $$('button', dotsBox);

    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, di) => d.classList.toggle('is-active', di === index));
    }
    function restart() {
      clearInterval(timer);
      if (!reducedMotion) timer = setInterval(() => go(index + 1), 6000);
    }

    go(0);
    restart();

    const quotes = $('#quotes');
    quotes.addEventListener('mouseenter', () => clearInterval(timer));
    quotes.addEventListener('mouseleave', restart);

    // swipe no mobile
    let startX = 0, dragging = false;
    quotes.addEventListener('touchstart', e => { startX = e.touches[0].clientX; dragging = true; }, { passive: true });
    quotes.addEventListener('touchend', e => {
      if (!dragging) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) { go(index + (dx < 0 ? 1 : -1)); restart(); }
      dragging = false;
    }, { passive: true });
  }

  /* ---------- lightbox da galeria ---------- */
  const lightbox = $('#lightbox');
  const lbImg = $('#lbImg');
  const galleryImgs = $$('#gallery .gitem img');

  if (lightbox && lbImg && galleryImgs.length) {
    let current = 0;

    const open = (i) => {
      current = (i + galleryImgs.length) % galleryImgs.length;
      lbImg.src = galleryImgs[current].src;
      lbImg.alt = galleryImgs[current].alt;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
    };
    const close = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
    };

    galleryImgs.forEach((img, i) => {
      const fig = img.closest('.gitem');
      fig.setAttribute('tabindex', '0');
      fig.setAttribute('role', 'button');
      fig.addEventListener('click', () => open(i));
      fig.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
      });
    });

    $('#lbClose').addEventListener('click', close);
    $('#lbPrev').addEventListener('click', e => { e.stopPropagation(); open(current - 1); });
    $('#lbNext').addEventListener('click', e => { e.stopPropagation(); open(current + 1); });
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') open(current + 1);
      if (e.key === 'ArrowLeft') open(current - 1);
    });
  }

  /* ---------- garante o autoplay do vídeo do hero ---------- */
  const heroVideo = $('.hero__video');
  if (heroVideo) {
    const tryPlay = () => {
      const p = heroVideo.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };
    heroVideo.addEventListener('canplay', tryPlay);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) tryPlay(); });
    ['touchstart', 'click'].forEach(ev =>
      document.addEventListener(ev, tryPlay, { once: true, passive: true })
    );
    tryPlay();
  }
})();
