/* ==========================================================================
   WEBSPARKLEZ main.js
   No frameworks, no dependencies. Everything here works on GitHub Pages.
   ========================================================================== */
(() => {
    'use strict';

    /* ---------- Settings you might want to change ---------- */
    const WHATSAPP_NUMBER = '2348130815443';
    const EMAIL = 'websparklez@gmail.com';
    // Leave empty on GitHub Pages: the brief form opens WhatsApp instead.
    // If you move to hosting that runs PHP, set this to 'contact.php'.
    const FORM_ENDPOINT = '';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
    const waLink = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

    /* ---------- Footer year ---------- */
    $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

    /* ---------- Sticker: "Now booking for <month>" ---------- */
    const stickerText = $('[data-sticker-text]');
    if (stickerText) {
        const now = new Date();
        const target = now.getDate() >= 15 ? new Date(now.getFullYear(), now.getMonth() + 1, 1) : now;
        stickerText.textContent = `Now booking for ${target.toLocaleString('en-GB', { month: 'long' })}`;
    }

    /* ---------- Back to top ---------- */
    $$('[data-to-top]').forEach((link) => link.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        // Move keyboard focus back to the top too, without a second jump
        const logo = $('.site-header__logo');
        if (logo) logo.focus({ preventScroll: true });
        history.replaceState(null, '', window.location.pathname + window.location.search);
    }));

    /* ---------- Header: border on scroll ---------- */
    const header = $('.site-header');
    const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Mobile navigation ---------- */
    const nav = $('#primary-nav');
    const toggle = $('.menu-toggle');

    const setNav = (open) => {
        if (!nav || !toggle) return;
        nav.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        document.body.classList.toggle('nav-open', open);
    };

    if (toggle) {
        toggle.addEventListener('click', () => setNav(toggle.getAttribute('aria-expanded') !== 'true'));
        $$('a', nav).forEach((a) => a.addEventListener('click', () => setNav(false)));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('is-open')) {
                setNav(false);
                toggle.focus();
            }
        });
        window.matchMedia('(min-width: 961px)').addEventListener('change', (e) => { if (e.matches) setNav(false); });
    }

    /* ---------- Highlight the nav link for the section in view ---------- */
    const navLinks = $$('.primary-nav a[href^="#"]');
    if ('IntersectionObserver' in window && navLinks.length) {
        const byId = new Map(navLinks.map((a) => [a.getAttribute('href').slice(1), a]));
        const spy = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                navLinks.forEach((a) => a.classList.remove('is-current'));
                const link = byId.get(entry.target.id);
                if (link) link.classList.add('is-current');
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        byId.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
        // Sections without a nav link clear the highlight (hero, website check, contact...)
        $$('main > section').forEach((s) => { if (!byId.has(s.id)) spy.observe(s); });
    }

    /* ---------- Hero showcase: cycles through real client sites ---------- */
    const showcase = $('[data-showcase]');
    if (showcase) {
        const sites = [
            { name: 'Jessica Lobalu', meta: 'Creative and financial advisory, built on Wix', url: 'jessicalobalu.com', href: 'https://www.jessicalobalu.com/' },
            { name: 'T&L Painting & Decorating', meta: 'Painting and decorating in Bedfordshire, built on Wix', url: 'tlpaintingservices.co.uk', href: 'https://www.tlpaintingservices.co.uk/' },
            { name: 'Joshygroup', meta: 'Business formation and funding, built on WordPress', url: 'joshygroup.com', href: 'https://joshygroup.com/' },
            { name: 'ÆTHER', meta: 'Audio and tech store, built on Wix', url: 'joshygroup.wixsite.com/aether', href: 'https://joshygroup.wixsite.com/aether' },
            { name: 'Shine Cleaners', meta: 'Cleaning company, hand-coded', url: 'websparklez.github.io/cleaningwebsite', href: 'https://websparklez.github.io/cleaningwebsite/' },
        ];
        const imgs = $$('.browser__screen img', showcase);
        const urlEl = $('[data-showcase-url]', showcase);
        const nameEl = $('[data-showcase-name]', showcase);
        const metaEl = $('[data-showcase-meta]', showcase);
        const linkEl = $('[data-showcase-link]', showcase);
        const toggleBtn = $('[data-showcase-toggle]', showcase);
        let index = 0;
        let timer = null;
        let typing = null;
        let userPaused = reduceMotion;
        let hovered = false;
        let inView = true;

        const typeUrl = (text) => {
            clearInterval(typing);
            if (reduceMotion) { urlEl.textContent = text; return; }
            let i = 0;
            urlEl.textContent = '';
            typing = setInterval(() => {
                i += 1;
                urlEl.textContent = text.slice(0, i);
                if (i >= text.length) clearInterval(typing);
            }, 32);
        };

        const go = (n) => {
            index = (n + sites.length) % sites.length;
            const site = sites[index];
            imgs.forEach((img, i) => img.classList.toggle('is-active', i === index));
            typeUrl(site.url);
            nameEl.textContent = site.name;
            metaEl.textContent = site.meta;
            linkEl.href = site.href;
            linkEl.setAttribute('aria-label', `Visit the ${site.name} website`);
        };

        const stop = () => { clearInterval(timer); timer = null; };
        const start = () => {
            stop();
            if (userPaused || hovered || !inView || document.hidden) return;
            timer = setInterval(() => go(index + 1), 5200);
        };

        const syncToggle = () => {
            showcase.classList.toggle('is-paused', userPaused);
            toggleBtn.setAttribute('aria-label', userPaused ? 'Play slideshow' : 'Pause slideshow');
        };

        $('[data-showcase-next]', showcase).addEventListener('click', () => { go(index + 1); start(); });
        $('[data-showcase-prev]', showcase).addEventListener('click', () => { go(index - 1); start(); });
        toggleBtn.addEventListener('click', () => { userPaused = !userPaused; syncToggle(); start(); });

        showcase.addEventListener('mouseenter', () => { hovered = true; stop(); });
        showcase.addEventListener('mouseleave', () => { hovered = false; start(); });
        showcase.addEventListener('focusin', () => { hovered = true; stop(); });
        showcase.addEventListener('focusout', (e) => { if (!showcase.contains(e.relatedTarget)) { hovered = false; start(); } });
        document.addEventListener('visibilitychange', start);

        if ('IntersectionObserver' in window) {
            new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; start(); }, { threshold: 0.2 }).observe(showcase);
        }

        syncToggle();
        start();
    }

    /* ---------- Client name marquee: duplicate list for a seamless loop ---------- */
    const marquee = $('[data-marquee]');
    if (marquee && !reduceMotion) {
        const list = $('.clients__list', marquee);
        const clone = list.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        marquee.appendChild(clone);
    }

    /* ---------- Website check ---------- */
    const check = $('[data-check]');
    if (check) {
        const boxes = $$('input[type="checkbox"]', check);
        const result = $('.check-result', check);
        const countEl = $('[data-check-count]', check);
        const verdictEl = $('[data-check-verdict]', check);
        const cta = $('[data-check-cta]', check);

        const verdicts = [
            'Tick what applies and your result shows up here.',
            'A couple of focused fixes could make a real difference. I can tell you which ones are worth paying for.',
            'A couple of focused fixes could make a real difference. I can tell you which ones are worth paying for.',
            'Your site is probably costing you enquiries every week. I\'d start with speed and how people contact you.',
            'Your site is probably costing you enquiries every week. I\'d start with speed and how people contact you.',
            'Honestly, a rebuild will likely cost you less than patching all of this.',
            'Honestly, a rebuild will likely cost you less than patching all of this.',
        ];

        const update = () => {
            const ticked = boxes.filter((b) => b.checked);
            const n = ticked.length;
            result.dataset.level = String(n);
            countEl.textContent = String(n);
            verdictEl.textContent = verdicts[n];

            let msg = 'Hi Sparkle, I\'d like a free website check.\n\nMy website: ';
            if (n) msg += `\n\nWhat I ticked:\n${ticked.map((b) => `- ${b.value}`).join('\n')}`;
            cta.href = waLink(msg);
        };

        boxes.forEach((b) => b.addEventListener('change', update));
        check.addEventListener('submit', (e) => e.preventDefault());
        update();
    }

    /* ---------- Services: preview follows the open service ---------- */
    const services = $('[data-services]');
    const preview = $('.service-preview');
    if (services && preview) {
        const projects = {
            jessica: { img: 'work-jessica-lobalu-640.webp', h: 400, name: 'Jessica Lobalu', meta: 'built on Wix' },
            joshygroup: { img: 'work-joshygroup-640.webp', h: 470, name: 'Joshygroup', meta: 'built on WordPress' },
            aether: { img: 'work-aether-640.webp', h: 447, name: 'ÆTHER', meta: 'an online store on Wix' },
            tl: { img: 'work-tl-painting-640.webp', h: 345, name: 'T&L Painting & Decorating', meta: 'local SEO for Bedfordshire' },
            shine: { img: 'work-shine-cleaners-640.webp', h: 397, name: 'Shine Cleaners', meta: 'hand-coded HTML, CSS and JavaScript' },
            temgap: { img: 'work-temgap-640.webp', h: 525, name: 'Temgap Staffing', meta: 'healthcare staffing in Canada' },
        };
        const img = $('[data-preview-img]', preview);
        const nameEl = $('[data-preview-name]', preview);
        const metaEl = $('[data-preview-meta]', preview);
        let current = 'jessica';
        let swapTimer = null;

        const show = (key) => {
            const p = projects[key];
            if (!p || key === current) return;
            current = key;
            preview.classList.add('is-swapping');
            clearTimeout(swapTimer);
            swapTimer = setTimeout(() => {
                img.src = `./images/${p.img}`;
                img.height = p.h;
                nameEl.textContent = p.name;
                metaEl.textContent = p.meta;
                preview.classList.remove('is-swapping');
            }, reduceMotion ? 0 : 180);
        };

        const items = $$('.service', services);
        items.forEach((item) => {
            item.addEventListener('toggle', () => {
                if (!item.open) return;
                // Fallback for browsers without exclusive <details name="">
                items.forEach((other) => { if (other !== item) other.open = false; });
                show(item.dataset.preview);
            });
            item.querySelector('summary').addEventListener('mouseenter', () => show(item.dataset.preview));
        });

        services.addEventListener('mouseleave', () => {
            const open = items.find((i) => i.open);
            if (open) show(open.dataset.preview);
        });

        // Warm the cache so swaps are instant
        window.addEventListener('load', () => {
            Object.values(projects).forEach((p) => { const i = new Image(); i.src = `./images/${p.img}`; });
        });
    }

    /* ---------- FAQ: one answer open at a time (fallback) ---------- */
    const faqs = $$('.qa');
    faqs.forEach((qa) => qa.addEventListener('toggle', () => {
        if (qa.open) faqs.forEach((o) => { if (o !== qa) o.open = false; });
    }));

    /* ---------- Work filters + staggered layout ---------- */
    const projectsGrid = $('.projects');
    if (projectsGrid) {
        const cards = $$(':scope > [data-tags]', projectsGrid);
        const chips = $$('[data-filter]');

        const layout = () => {
            cards.filter((c) => !c.hidden).forEach((c, i) => c.classList.toggle('is-offset', i % 2 === 1));
        };

        chips.forEach((chip) => chip.addEventListener('click', () => {
            const f = chip.dataset.filter;
            chips.forEach((c) => {
                const on = c === chip;
                c.classList.toggle('is-active', on);
                c.setAttribute('aria-pressed', String(on));
            });
            cards.forEach((card) => {
                const tags = card.dataset.tags.split(' ');
                card.hidden = !(f === 'all' || tags.includes(f) || tags.includes('all'));
            });
            layout();
        }));

        layout();
    }

    /* ---------- "More sites" rail buttons ---------- */
    const rail = $('[data-rail]');
    if (rail) {
        const step = () => Math.max(rail.clientWidth * 0.8, 280);
        $('[data-scroll-next]').addEventListener('click', () => rail.scrollBy({ left: step(), behavior: reduceMotion ? 'auto' : 'smooth' }));
        $('[data-scroll-prev]').addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    }

    /* ---------- Lighthouse rings fill once when seen ---------- */
    const rings = $('[data-rings]');
    if (rings) {
        if ('IntersectionObserver' in window && !reduceMotion) {
            const io = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) { rings.classList.add('is-in'); io.disconnect(); }
            }, { threshold: 0.4 });
            io.observe(rings);
        } else {
            rings.classList.add('is-in');
        }
    }

    /* ---------- Project brief form ---------- */
    const brief = $('[data-brief]');
    if (brief) {
        const statusEl = $('[data-brief-status]', brief);
        const submitBtn = $('[data-brief-submit]', brief);
        const label = $('[data-brief-label]', brief);
        const fields = {
            name: $('#f-name', brief),
            contact: $('#f-contact', brief),
            when: $('#f-when', brief),
            message: $('#f-msg', brief),
            company: $('#f-company', brief),
        };

        const setStatus = (text, isError = false) => {
            statusEl.textContent = text;
            statusEl.classList.toggle('is-error', isError);
        };

        const validate = () => {
            let firstBad = null;
            ['name', 'contact'].forEach((key) => {
                const input = fields[key];
                const ok = input.value.trim().length > 1;
                input.closest('.field').classList.toggle('is-invalid', !ok);
                input.setAttribute('aria-invalid', String(!ok));
                if (!ok && !firstBad) firstBad = input;
            });
            if (firstBad) firstBad.focus();
            return !firstBad;
        };

        ['name', 'contact'].forEach((key) => {
            fields[key].addEventListener('input', () => {
                if (fields[key].value.trim().length > 1) {
                    fields[key].closest('.field').classList.remove('is-invalid');
                    fields[key].setAttribute('aria-invalid', 'false');
                }
            });
        });

        const getData = () => ({
            name: fields.name.value.trim(),
            contact: fields.contact.value.trim(),
            need: (brief.querySelector('input[name="need"]:checked') || {}).value || 'Not sure yet',
            when: fields.when.value,
            message: fields.message.value.trim(),
        });

        const composeBrief = (d) => {
            const lines = [
                'Hi Sparkle, here is my project brief.',
                '',
                `Name: ${d.name}`,
                `Contact: ${d.contact}`,
                `I need: ${d.need}`,
                `Launch: ${d.when}`,
            ];
            if (d.message) lines.push(`Details: ${d.message}`);
            return lines.join('\n');
        };

        brief.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (fields.company.value) return; // bot filled the honeypot
            if (!validate()) { setStatus('Please fill in the two highlighted fields.', true); return; }

            const data = getData();

            if (FORM_ENDPOINT) {
                submitBtn.disabled = true;
                label.textContent = 'Sending...';
                try {
                    const res = await fetch(FORM_ENDPOINT, { method: 'POST', body: new FormData(brief), headers: { Accept: 'application/json' } });
                    const json = await res.json().catch(() => ({}));
                    if (!res.ok || !json.ok) throw new Error(json.error || 'Send failed');
                    brief.reset();
                    setStatus(`Thanks ${data.name.split(' ')[0]}, your brief is on its way. I'll reply soon.`);
                } catch (err) {
                    setStatus('That didn\'t send. Opening WhatsApp instead so your brief isn\'t lost.', true);
                    window.open(waLink(composeBrief(data)), '_blank', 'noopener');
                } finally {
                    submitBtn.disabled = false;
                    label.textContent = 'Send my brief';
                }
                return;
            }

            window.open(waLink(composeBrief(data)), '_blank', 'noopener');
            setStatus('WhatsApp should now be open with your brief filled in. Tap send and I\'ll reply soon.');
        });

        $('[data-brief-email]', brief).addEventListener('click', () => {
            if (!validate()) { setStatus('Please fill in the two highlighted fields.', true); return; }
            const data = getData();
            const subject = `Website brief from ${data.name}`;
            window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(composeBrief(data))}`;
            setStatus('Your email app should open with the brief filled in.');
        });

        if (FORM_ENDPOINT) label.textContent = 'Send my brief';
    }

    /* ---------- Mobile quick-contact bar ---------- */
    const quickbar = $('[data-quickbar]');
    const hero = $('.hero');
    const contact = $('#contact');
    if (quickbar && hero && contact && 'IntersectionObserver' in window) {
        let pastHero = false;
        let atContact = false;
        const sync = () => quickbar.classList.toggle('is-visible', pastHero && !atContact);
        new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting && e.boundingClientRect.top < 0; sync(); }).observe(hero);
        new IntersectionObserver(([e]) => { atContact = e.isIntersecting; sync(); }, { threshold: 0.15 }).observe(contact);
    }
})();
