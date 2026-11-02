(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

    setupTheme();
    setupMenu();

    // Motion is an enhancement. If GSAP fails to load, or the visitor prefers reduced
    // motion, the page keeps its normal layout and nothing animates.
    if (!window.gsap || !window.ScrollTrigger || reduceMotion.matches) return;

    gsap.registerPlugin(ScrollTrigger);
    setupMotion();

    function setupTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle?.addEventListener('click', () => {
            const isLight = root.classList.toggle('light-mode');
            try {
                localStorage.setItem('theme', isLight ? 'light' : 'dark');
            } catch (error) {
                // Storage can be blocked. The toggle still works for this visit.
            }
        });
    }

    function setupMenu() {
        const menuToggle = document.querySelector('.menu-toggle-btn');
        const navLinks = document.getElementById('nav-links');

        const setMenu = (open) => {
            navLinks.classList.toggle('open', open);
            menuToggle.setAttribute('aria-expanded', String(open));
            menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        };

        menuToggle?.addEventListener('click', () => {
            setMenu(!navLinks.classList.contains('open'));
        });

        navLinks?.addEventListener('click', (event) => {
            if (event.target.closest('a')) setMenu(false);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') setMenu(false);
        });
    }

    function setupMotion() {
        const loader = createLoader();
        const heroChars = splitChars(document.querySelector('.about-name'));

        // Intro: the loader (first visit only), then the header and hero rise in.
        const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
        if (loader) {
            intro
                .fromTo(loader.letters, { yPercent: 110 }, { yPercent: 0, duration: 0.8, stagger: 0.09 })
                .fromTo(loader.bar, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, '<0.1')
                .to(loader.root, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '+=0.2')
                .call(() => loader.root.remove());
        }
        intro.addLabel('reveal', loader ? '-=0.2' : 0);
        intro
            .fromTo('.header', { yPercent: -100 }, { yPercent: 0, duration: 0.8 }, 'reveal')
            .fromTo(heroChars, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.03 }, 'reveal')
            .fromTo('.section-title-about', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 }, 'reveal+=0.1')
            .fromTo('.status-badge', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.6 }, 'reveal+=0.5')
            .fromTo(['.about-bio', '.about-education', '.link-resume'], { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 }, 'reveal+=0.4')
            .fromTo('.about-image', { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 1.4 }, 'reveal')
            .fromTo('.social-sidebar a', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, clearProps: 'transform' }, 'reveal+=0.6');

        // Scroll-linked: the hero image drifts as the hero leaves the screen.
        gsap.to('.about-image', {
            yPercent: -10,
            ease: 'none',
            scrollTrigger: { trigger: '#about', start: 'top top', end: 'bottom top', scrub: true },
        });

        // Section titles and the contact line rise word by word.
        gsap.utils.toArray('.section-title, .contact-prompt').forEach((element) => {
            const words = splitWords(element);
            gsap.fromTo(words, { yPercent: 110 }, {
                yPercent: 0,
                duration: 0.9,
                stagger: 0.06,
                scrollTrigger: { trigger: element, start: 'top 88%' },
            });
        });

        // Skill chips pop in per category.
        gsap.utils.toArray('.skills-category').forEach((category) => {
            gsap.fromTo(category.querySelectorAll('.skill-card'), { opacity: 0, y: 24, scale: 0.9 }, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                stagger: 0.05,
                ease: 'back.out(1.6)',
                clearProps: 'transform',
                scrollTrigger: { trigger: category, start: 'top 88%' },
            });
        });

        // Project cards rise in, and each image drifts inside its frame.
        const cards = gsap.utils.toArray('.project-card');
        const grid = document.querySelector('.projects-grid');

        cards.forEach((card) => {
            gsap.fromTo(card, { opacity: 0, y: 70 }, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: { trigger: card, start: 'top 88%' },
            });
        });

        gsap.utils.toArray('.project-image').forEach((image) => {
            gsap.set(image, { scale: 1.18 });
            gsap.fromTo(image, { yPercent: -8 }, {
                yPercent: 8,
                ease: 'none',
                scrollTrigger: { trigger: image.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
            });
        });

        // On desktop, cards stick and shrink slightly as the next card covers them.
        gsap.matchMedia().add('(min-width: 768px)', () => {
            grid.classList.add('is-stacked');
            cards.forEach((card, index) => {
                card.style.setProperty('--stack', index);
                const next = cards[index + 1];
                if (!next) return;
                gsap.to(card, {
                    scale: 0.92,
                    ease: 'none',
                    scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 160px', scrub: true },
                });
            });
            return () => {
                grid.classList.remove('is-stacked');
                cards.forEach((card) => card.style.removeProperty('--stack'));
            };
        });

        // Skills marquee: it speeds up with scroll velocity and reverses with scroll direction.
        const marquee = document.querySelector('.marquee');
        const marqueeTween = gsap.to('.marquee-track', { xPercent: -50, ease: 'none', duration: 28, repeat: -1 });
        marquee.addEventListener('pointerenter', () => marqueeTween.pause());
        marquee.addEventListener('pointerleave', () => marqueeTween.play());
        ScrollTrigger.create({
            onUpdate: (self) => {
                const boost = Math.min(Math.abs(self.getVelocity()) / 1500, 2.5);
                marqueeTween.timeScale(1 + boost);
                marqueeTween.reversed(self.direction === -1);
            },
        });

        gsap.fromTo('.contact-details-row p', { opacity: 0, x: -28 }, {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.12,
            scrollTrigger: { trigger: '.contact-details-row', start: 'top 88%' },
        });

        ScrollTrigger.create({
            start: 'top -20px',
            onToggle: (self) => root.classList.toggle('is-scrolled', self.isActive),
        });

        gsap.to('.scroll-progress', {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
        });

        if (finePointer.matches) {
            setupHeroTilt();
            setupMagnetic();
            setupCursor();
        }
    }

    function createLoader() {
        if (readFlag('intro-seen')) return null;
        writeFlag('intro-seen');

        const loaderRoot = document.createElement('div');
        loaderRoot.className = 'loader';
        loaderRoot.setAttribute('aria-hidden', 'true');

        const mark = document.createElement('div');
        mark.className = 'loader-mark';
        ['Y', 'L'].forEach((letter) => {
            const span = document.createElement('span');
            span.textContent = letter;
            mark.appendChild(span);
        });

        const bar = document.createElement('div');
        bar.className = 'loader-bar';

        loaderRoot.append(mark, bar);
        document.body.prepend(loaderRoot);
        return { root: loaderRoot, letters: [...mark.children], bar };
    }

    // Split an element's text into characters, keeping the full text for screen readers.
    function splitChars(element) {
        const text = element.textContent.trim();
        element.setAttribute('aria-label', text);
        element.textContent = '';
        return [...text].map((character) => {
            const span = document.createElement('span');
            span.className = 'char';
            span.setAttribute('aria-hidden', 'true');
            span.textContent = character === ' ' ? ' ' : character;
            element.appendChild(span);
            return span;
        });
    }

    // Split an element's text into words, each inside a mask so it can rise into view.
    function splitWords(element) {
        const words = element.textContent.trim().split(/\s+/);
        element.setAttribute('aria-label', words.join(' '));
        element.textContent = '';
        return words.map((word, index) => {
            const mask = document.createElement('span');
            mask.className = 'word-mask';
            mask.setAttribute('aria-hidden', 'true');
            const inner = document.createElement('span');
            inner.className = 'word';
            inner.textContent = word;
            mask.appendChild(inner);
            element.appendChild(mask);
            if (index < words.length - 1) element.appendChild(document.createTextNode(' '));
            return inner;
        });
    }

    function setupHeroTilt() {
        const frame = document.querySelector('.about-image-wrapper');
        gsap.set(frame, { transformPerspective: 900 });
        const tiltX = gsap.quickTo(frame, 'rotationX', { duration: 0.6, ease: 'power3.out' });
        const tiltY = gsap.quickTo(frame, 'rotationY', { duration: 0.6, ease: 'power3.out' });

        frame.addEventListener('pointermove', (event) => {
            const box = frame.getBoundingClientRect();
            tiltX(-((event.clientY - box.top) / box.height - 0.5) * 10);
            tiltY(((event.clientX - box.left) / box.width - 0.5) * 10);
        });

        frame.addEventListener('pointerleave', () => {
            tiltX(0);
            tiltY(0);
        });
    }

    // Buttons and links lean slightly toward the pointer.
    function setupMagnetic() {
        gsap.utils.toArray('.btn-secondary, .link-resume, .contact-details-row a').forEach((element) => {
            const moveX = gsap.quickTo(element, 'x', { duration: 0.4, ease: 'power3.out' });
            const moveY = gsap.quickTo(element, 'y', { duration: 0.4, ease: 'power3.out' });

            element.addEventListener('pointermove', (event) => {
                const box = element.getBoundingClientRect();
                moveX((event.clientX - box.left - box.width / 2) * 0.2);
                moveY((event.clientY - box.top - box.height / 2) * 0.3);
            });

            element.addEventListener('pointerleave', () => {
                moveX(0);
                moveY(0);
            });
        });
    }

    // A ring follows the pointer and grows over links and cards. The native cursor stays visible.
    function setupCursor() {
        root.classList.add('has-cursor');
        const cursor = document.createElement('div');
        cursor.className = 'cursor';
        cursor.setAttribute('aria-hidden', 'true');
        document.body.appendChild(cursor);
        gsap.set(cursor, { xPercent: -50, yPercent: -50 });

        const moveX = gsap.quickTo(cursor, 'x', { duration: 0.25, ease: 'power3.out' });
        const moveY = gsap.quickTo(cursor, 'y', { duration: 0.25, ease: 'power3.out' });
        const hoverTargets = 'a, button, .project-card, .skill-card';

        window.addEventListener('pointermove', (event) => {
            moveX(event.clientX);
            moveY(event.clientY);
            cursor.classList.add('is-visible');
        }, { passive: true });

        document.addEventListener('pointerover', (event) => {
            if (event.target.closest(hoverTargets)) gsap.to(cursor, { scale: 1.8, duration: 0.3 });
        });

        document.addEventListener('pointerout', (event) => {
            const leaving = event.target.closest(hoverTargets);
            const entering = event.relatedTarget?.closest?.(hoverTargets);
            if (leaving && leaving !== entering) gsap.to(cursor, { scale: 1, duration: 0.3 });
        });

        root.addEventListener('mouseleave', () => cursor.classList.remove('is-visible'));
    }

    function readFlag(name) {
        try {
            return sessionStorage.getItem(name) === '1';
        } catch (error) {
            return false;
        }
    }

    function writeFlag(name) {
        try {
            sessionStorage.setItem(name, '1');
        } catch (error) {
            // Storage blocked: the intro may replay on the next visit.
        }
    }
})();
