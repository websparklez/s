/* ============================================================
   WEBSPARKLEZ — main.js (Redesigned)
   Features:
   – Hamburger / mobile nav toggle
   – Smooth section scroll (nav links + footer links)
   – Sticky header shadow on scroll
   – Scroll-to-top button
   – Typed.js auto-typing
   – Intersection Observer scroll-reveal
   – Animated stat counters
   – Active nav link highlighting
   ============================================================ */

/* ────────────────────────────────────
   ELEMENT REFERENCES
──────────────────────────────────── */
const hamBurger = document.querySelector('.hamBurger');
const mainMenu  = document.querySelector('.mainMenu');
const header    = document.querySelector('.header');
const scrollBtn = document.querySelector('.scrollTo');
const yearEl    = document.getElementById('year');

/* ────────────────────────────────────
   YEAR — footer copyright
──────────────────────────────────── */
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ────────────────────────────────────
   HAMBURGER MENU
──────────────────────────────────── */
if (hamBurger && mainMenu) {
    hamBurger.addEventListener('click', () => {
        const isOpen = hamBurger.classList.toggle('active');
        mainMenu.classList.toggle('active', isOpen);
        hamBurger.setAttribute('aria-expanded', String(isOpen));
        // Prevent body scroll when nav is open on mobile
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close nav when any menu link is clicked
    document.querySelectorAll('.menuLinks, #freequotes').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

function closeMobileMenu() {
    hamBurger.classList.remove('active');
    mainMenu.classList.remove('active');
    hamBurger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

/* Close menu on outside click */
document.addEventListener('click', (e) => {
    if (mainMenu && mainMenu.classList.contains('active')) {
        if (!mainMenu.contains(e.target) && !hamBurger.contains(e.target)) {
            closeMobileMenu();
        }
    }
});

/* ────────────────────────────────────
   SMOOTH SECTION SCROLL HELPERS
──────────────────────────────────── */
function scrollToSection(selectorId) {
    const el = document.querySelector(selectorId);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Primary nav links
const navMap = {
    '#work_link':    '#work',
    '#about_link':   '#about',
    '#contact_link': '#contact',
    '#hero_work_link': '#work',
};

Object.entries(navMap).forEach(([btnSel, sectionSel]) => {
    const btn = document.querySelector(btnSel);
    if (btn) {
        btn.addEventListener('click', () => {
            closeMobileMenu();
            scrollToSection(sectionSel);
        });
    }
});

// Footer nav links
const footerNavMap = {
    '#footer_work_link':    '#work',
    '#footer_about_link':   '#about',
    '#footer_contact_link': '#contact',
};

Object.entries(footerNavMap).forEach(([btnSel, sectionSel]) => {
    const btn = document.querySelector(btnSel);
    if (btn) {
        btn.addEventListener('click', () => scrollToSection(sectionSel));
    }
});

/* ────────────────────────────────────
   STICKY HEADER SHADOW ON SCROLL
──────────────────────────────────── */
function handleHeaderScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 20);
}

window.addEventListener('scroll', handleHeaderScroll, { passive: true });

/* ────────────────────────────────────
   SCROLL-TO-TOP BUTTON
──────────────────────────────────── */
function handleScrollBtn() {
    if (!scrollBtn) return;
    scrollBtn.classList.toggle('active', window.scrollY > 500);
}

window.addEventListener('scroll', handleScrollBtn, { passive: true });

if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ────────────────────────────────────
   TYPED.JS AUTO-TYPE
──────────────────────────────────── */
if (document.querySelector('.auto-type') && typeof Typed !== 'undefined') {
    new Typed('.auto-type', {
        strings: [
            'A Digital Strategist',
            'A WordPress Expert',
            'A Wix Expert',
            'A Frontend Developer',
        ],
        typeSpeed:  100,
        backSpeed:  65,
        backDelay:  1800,
        startDelay: 400,
        loop:       true,
        smartBackspace: true,
    });
}

/* ────────────────────────────────────
   SCROLL REVEAL — Intersection Observer
──────────────────────────────────── */
const revealObserver = new IntersectionObserver(
    (entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('scroll-animation');
            // Also handle .reveal class
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
        });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);

// Animate general elements (legacy)
document.querySelectorAll('h2, h3, p, hr, img, figure').forEach(el => {
    revealObserver.observe(el);
});

// Animate .reveal elements
document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
    revealObserver.observe(el);
});

// Service cards (stagger within their container)
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
    revealObserver.observe(card);
});

/* ────────────────────────────────────
   ANIMATED STAT COUNTERS
──────────────────────────────────── */
function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    const duration = 1800; // ms
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    // Ease out cubic
    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

    const counter = setInterval(() => {
        frame++;
        const progress = easeOutCubic(frame / totalFrames);
        el.textContent = Math.round(progress * target);

        if (frame === totalFrames) {
            el.textContent = target;
            clearInterval(counter);
        }
    }, frameDuration);
}

const counterObserver = new IntersectionObserver(
    (entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target);
            obs.unobserve(entry.target);
        });
    },
    { threshold: 0.5 }
);

document.querySelectorAll('.stats__number[data-target]').forEach(el => {
    counterObserver.observe(el);
});

/* ────────────────────────────────────
   ACTIVE NAV HIGHLIGHTING
──────────────────────────────────── */
const sections = document.querySelectorAll('section[id], main > section');
const navLinks = document.querySelectorAll('.menuLinks');

const sectionObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                const linkId = link.getAttribute('id') || '';
                // Match "work_link" → section id "work"
                const matches = linkId.replace('_link', '') === id;
                link.classList.toggle('menuLinks--active', matches);
            });
        });
    },
    { threshold: 0.4 }
);

sections.forEach(section => {
    if (section.id) sectionObserver.observe(section);
});

/* ────────────────────────────────────
   PROJECT IMAGE — subtle parallax on scroll
   (desktop only, reduced motion respected)
──────────────────────────────────── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && window.innerWidth >= 1024) {
    const projectImages = document.querySelectorAll('.project__img');

    window.addEventListener('scroll', () => {
        projectImages.forEach(img => {
            const rect = img.closest('.project__image-wrap').getBoundingClientRect();
            const viewH = window.innerHeight;
            if (rect.bottom < 0 || rect.top > viewH) return;
            const progress = (viewH - rect.top) / (viewH + rect.height);
            const offset = (progress - 0.5) * 30; // max ±15px
            img.style.transform = `translateY(${offset}px) scale(1)`;
        });
    }, { passive: true });
}

/* ────────────────────────────────────
   WA QUOTE BUTTON — close nav on click
──────────────────────────────────── */
const waBtn = document.querySelector('#freequotes');
if (waBtn) {
    waBtn.addEventListener('click', () => {
        closeMobileMenu();
    });
}
