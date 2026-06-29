/* ================================================================
   KAUSTUV POKHAREL — PORTFOLIO SCRIPT
   script.js

   HOW TO READ THIS FILE
   ---------------------
   Each feature is wrapped in its own clearly-named function.
   At the very bottom, one "init()" function calls them all.
   If something breaks, you can comment out individual function
   calls in init() to isolate the problem.

   TABLE OF CONTENTS
   -----------------
   1.  Smooth Scrolling  (Lenis)
   2.  Page Loader
   3.  Navigation (scroll-aware + mobile menu)
   4.  Custom Cursor
   5.  Scroll Progress Bar
   6.  Hero Canvas (particle background)
   7.  Hero Text Reveal
   8.  Rotating Word in Hero
   9.  Scroll Reveal (all [data-reveal] elements)
  10.  Parallax (portrait image)
  11.  Magnetic Buttons
  12.  Counters (animated numbers)
  13.  Photography Lightbox
  14.  Design Section Tabs (filter)
  15.  Contact Form (Formspree)
  16.  Footer Year + Signature
  17.  init() — runs everything
================================================================ */

'use strict';


/* ================================================================
   1. SMOOTH SCROLLING (Lenis)
================================================================ */
function initSmoothScrolling() {
  if (typeof Lenis === 'undefined') return;

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });

  // Run Lenis on every animation frame
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) lenis.scrollTo(target, { offset: -80 });
    });
  });
}


/* ================================================================
   2. PAGE LOADER
================================================================ */
function initLoader() {
  const loader   = document.getElementById('loader');
  const progress = document.querySelector('.loader__progress');
  if (!loader || !progress) return;

  let currentProgress = 0;

  const interval = setInterval(() => {
    currentProgress += Math.random() * 15;
    if (currentProgress >= 100) {
      currentProgress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        triggerHeroEntrance();
      }, 400);
    }
    progress.style.width = currentProgress + '%';
  }, 80);
}


/* ================================================================
   3. NAVIGATION
================================================================ */
function initNavigation() {
  const nav       = document.getElementById('nav');
  const navLinks  = document.querySelectorAll('.nav__link');
  const hamburger = document.getElementById('nav-hamburger');
  const navMenu   = document.getElementById('nav-links');
  if (!nav) return;

  // Scroll-aware background
  function updateNav() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // Active link highlighting
  const sections = document.querySelectorAll('section[id]');
  function updateActiveLink() {
    const scrollY = window.scrollY + 120;
    sections.forEach((section) => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // Mobile hamburger
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
}


/* ================================================================
   4. CUSTOM CURSOR
================================================================ */
function initCursor() {
  const cursor         = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursor-follower');
  if (!cursor || !cursorFollower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function lerpFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top  = followerY + 'px';
    requestAnimationFrame(lerpFollower);
  }
  lerpFollower();

  const interactiveEls = 'a, button, [role="button"], .photo-item, .skill-card, .project-card';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveEls)) document.body.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveEls)) document.body.classList.remove('cursor-hover');
  });
}


/* ================================================================
   5. SCROLL PROGRESS BAR
================================================================ */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width  = (scrollTop / docHeight) * 100 + '%';
  }, { passive: true });
}


/* ================================================================
   6. HERO CANVAS (Particle Background)
================================================================ */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x      = Math.random() * canvas.width;
      this.y      = Math.random() * canvas.height;
      this.vx     = (Math.random() - 0.5) * 0.3;
      this.vy     = (Math.random() - 0.5) * 0.3;
      this.radius = Math.random() * 1.5 + 0.5;
      this.alpha  = Math.random() * 0.4 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 169, 126, ${this.alpha})`;
      ctx.fill();
    }
  }

  const particleCount = window.innerWidth < 640 ? 40 : 80;
  const particles = Array.from({ length: particleCount }, () => new Particle());
  const CONNECTION_DISTANCE = 120;

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DISTANCE) {
          const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(200, 169, 126, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function drawGradient() {
    const grd = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.width * 0.6
    );
    grd.addColorStop(0,   'rgba(200, 169, 126, 0.04)');
    grd.addColorStop(0.5, 'rgba(10, 10, 10, 0.0)');
    grd.addColorStop(1,   'rgba(10, 10, 10, 0.5)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGradient();
    drawConnections();
    particles.forEach((p) => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}


/* ================================================================
   7. HERO TEXT REVEAL
   Called by initLoader() once the loading screen hides.
================================================================ */
function triggerHeroEntrance() {
  const heroReveals = document.querySelectorAll('#hero [data-reveal]');
  heroReveals.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('revealed');
    }, index * 180);
  });
}


/* ================================================================
   8. ROTATING WORD IN HERO
================================================================ */
function initRotatingWord() {
  const wordEl = document.getElementById('rotating-word');
  if (!wordEl) return;

  const words = ['DESIGNING', 'DIRECTING', 'WRITING', 'CODING', 'PHOTOGRAPHY'];
  let currentIndex = 0;

  wordEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

  function swapWord() {
    wordEl.style.opacity   = '0';
    wordEl.style.transform = 'translateY(-8px)';
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % words.length;
      wordEl.textContent     = words[currentIndex];
      wordEl.style.opacity   = '1';
      wordEl.style.transform = 'translateY(0)';
    }, 300);
  }

  setInterval(swapWord, 2500);
}


/* ================================================================
   9. SCROLL REVEAL
   Uses IntersectionObserver to add .revealed to elements
   when they enter the viewport. CSS handles the animation.
   
   NOTE: GSAP is NOT used here to avoid conflicts with the
   CSS opacity/transform on [data-reveal] elements.
================================================================ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('[data-reveal]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // only animate once
        }
      });
    },
    {
      threshold:  0.08,                   // trigger when 8% is visible
      rootMargin: '0px 0px -10px 0px',   // trigger just before fully in view
    }
  );

  revealEls.forEach((el) => observer.observe(el));
}


/* ================================================================
   10. PARALLAX (Portrait Image)
================================================================ */
function initParallax() {
  const portrait = document.querySelector('.about__portrait-img');
  if (!portrait) return;

  function updateParallax() {
    const section = document.getElementById('about');
    if (!section) return;
    const rect     = section.getBoundingClientRect();
    const progress = -rect.top / window.innerHeight;
    portrait.style.transform = `translateY(${progress * 40}px)`;
  }

  window.addEventListener('scroll', updateParallax, { passive: true });
}


/* ================================================================
   11. MAGNETIC BUTTONS
================================================================ */
function initMagneticButtons() {
  const magnetics = document.querySelectorAll('.magnetic');

  magnetics.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect    = el.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;
      const deltaX  = e.clientX - centerX;
      const deltaY  = e.clientY - centerY;
      el.style.transform = `translate(${deltaX * 0.25}px, ${deltaY * 0.25}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
}


/* ================================================================
   12. COUNTERS (Animated Numbers)
================================================================ */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start    = performance.now();

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
}


/* ================================================================
   13. PHOTOGRAPHY LIGHTBOX
================================================================ */
/* ================================================================
   13. LIGHTBOX (Photography + Design)
   Clicking a photo OR a design item opens the full-screen viewer.
================================================================ */
function initLightbox() {
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-image');
  const closeBtn    = document.getElementById('lightbox-close');
  const prevBtn     = document.getElementById('lightbox-prev');
  const nextBtn     = document.getElementById('lightbox-next');
  if (!lightbox || !lightboxImg) return;

  // We collect BOTH photo items and design items into one array
  // so the left/right arrows work across all of them
  let allItems = [];
  let currentIndex = 0;

  // Gets the image src from either a .photo-item or .design-item
  function getSrc(item) {
    const img = item.querySelector('img');
    return img ? img.src : '';
  }

  function openLightbox(index, items) {
    // Store whichever group was clicked (photos or designs)
    allItems = items;
    currentIndex = index;
    const src = getSrc(allItems[currentIndex]);
    if (!src) return;
    lightboxImg.src = src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + allItems.length) % allItems.length;
    lightboxImg.src = getSrc(allItems[currentIndex]);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % allItems.length;
    lightboxImg.src = getSrc(allItems[currentIndex]);
  }

  // --- Photography items ---
  const photoItems = Array.from(document.querySelectorAll('.photo-item'));
  photoItems.forEach((item, index) => {
    item.style.cursor = 'zoom-in';
    item.addEventListener('click', () => openLightbox(index, photoItems));
  });

  // --- Design items ---
  const designItems = Array.from(document.querySelectorAll('.design-item'));
  designItems.forEach((item, index) => {
    item.style.cursor = 'zoom-in';
    item.addEventListener('click', () => openLightbox(index, designItems));
  });

  // Controls
  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  // Click outside image to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
}

/* ================================================================
   14. DESIGN SECTION TABS
================================================================ */
function initDesignTabs() {
  const tabs        = document.querySelectorAll('.design__tab');
  const designItems = document.querySelectorAll('.design-item');
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('design__tab--active'));
      tab.classList.add('design__tab--active');

      const filter = tab.dataset.filter;
      designItems.forEach((item) => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('hidden', !show);
      });
    });
  });
}


/* ================================================================
   15. CONTACT FORM (Formspree)
================================================================ */
function initContactForm() {
  const form      = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  if (!form || !submitBtn) return;

  const textDefault = submitBtn.querySelector('.submit-btn__text');
  const textSending = submitBtn.querySelector('.submit-btn__sending');
  const textSent    = submitBtn.querySelector('.submit-btn__sent');

  function resetButton() {
    textDefault.hidden  = false;
    textSending.hidden  = true;
    textSent.hidden     = true;
    submitBtn.disabled  = false;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    textDefault.hidden = true;
    textSending.hidden = false;
    textSent.hidden    = true;

    try {
      const response = await fetch(form.action, {
        method:  'POST',
        body:    new FormData(form),
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        textSending.hidden = true;
        textSent.hidden    = false;
        form.reset();
        setTimeout(resetButton, 4000);
      } else {
        const json = await response.json();
        const msg  = json.errors ? json.errors.map((e) => e.message).join(', ') : 'Something went wrong.';
        alert('Error: ' + msg);
        resetButton();
      }
    } catch (err) {
      alert('Could not send message. Please try again.');
      resetButton();
    }
  });
}


/* ================================================================
   16. FOOTER
================================================================ */
function initFooter() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const signature = document.getElementById('footer-signature');
  if (signature) {
    signature.style.opacity    = '0';
    signature.style.transform  = 'translateY(10px)';
    signature.style.transition = 'opacity 1s ease, transform 1s ease';

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          signature.style.opacity   = '1';
          signature.style.transform = 'translateY(0)';
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(signature);
  }
}


/* ================================================================
   12.5 TOOLBOX — CURSOR-REACTIVE LOGOS
   Each logo drifts toward the cursor when it's nearby, tilts
   slightly, and eases back to rest when the cursor moves away.
   Falls back to the plain floating bob on touch devices.
================================================================ */
function initToolboxMagnetism() {
  const grid = document.getElementById('toolbox-grid');
  if (!grid) return;

  // Skip on touch-only devices — there's no hover/cursor to react to
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (isTouch) return;

  // Respect reduced-motion preference
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const items = Array.from(grid.querySelectorAll('.tool-item'));
  const RADIUS = 140;       // px — how far away the pull starts being felt
  const MAX_PULL = 16;      // px — how far an icon can drift toward the cursor
  const MAX_TILT = 10;      // deg — max rotation at closest range

  // Track current + target offsets per item for smooth easing
  const state = items.map(() => ({ x: 0, y: 0, rot: 0, tx: 0, ty: 0, trot: 0 }));

  let mouseX = -9999;
  let mouseY = -9999;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // If the cursor leaves the window entirely, let everything drift back to rest
  window.addEventListener('mouseleave', () => {
    mouseX = -9999;
    mouseY = -9999;
  });

  function tick() {
    items.forEach((item, i) => {
      const rect    = item.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;
      const dx      = mouseX - centerX;
      const dy      = mouseY - centerY;
      const dist    = Math.sqrt(dx * dx + dy * dy);

      const s = state[i];

      if (dist < RADIUS) {
        const strength = 1 - dist / RADIUS; // 0 (far) → 1 (right on top of it)
        s.tx   = (dx / (dist || 1)) * MAX_PULL * strength;
        s.ty   = (dy / (dist || 1)) * MAX_PULL * strength;
        s.trot = (dx / RADIUS) * MAX_TILT * strength;
        item.classList.add('tool-item--active');
      } else {
        s.tx = 0;
        s.ty = 0;
        s.trot = 0;
        item.classList.remove('tool-item--active');
      }

      // Ease current values toward targets for a smooth, springy feel
      s.x   += (s.tx   - s.x)   * 0.15;
      s.y   += (s.ty   - s.y)   * 0.15;
      s.rot += (s.trot - s.rot) * 0.15;

      item.style.transform = `translate(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px) rotate(${s.rot.toFixed(2)}deg)`;
    });

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}


/* ================================================================
   INIT — Run Everything
================================================================ */
function init() {
  initSmoothScrolling();  // 1. Smooth scroll
  initLoader();           // 2. Loading screen
  initNavigation();       // 3. Nav
  initCursor();           // 4. Custom cursor
  initScrollProgress();   // 5. Progress bar
  initHeroCanvas();       // 6. Particle background
  initRotatingWord();     // 7. Cycling word
  initScrollReveal();     // 8. Fade-in on scroll — CSS only, no GSAP conflict
  initParallax();         // 9. Portrait parallax
  initMagneticButtons();  // 10. Magnetic buttons
  initCounters();         // 11. Animated numbers
  initLightbox();         // 12. Photo lightbox
  initToolboxMagnetism(); // 12.5 Cursor-reactive tool logos
  initDesignTabs();       // 13. Design filter tabs
  initContactForm();      // 14. Contact form
  initFooter();           // 15. Footer year + signature
  // NOTE: initGSAPAnimations() removed — was conflicting with CSS reveals
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}