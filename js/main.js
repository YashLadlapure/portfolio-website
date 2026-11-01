(() => {
    const root = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const menuToggle = document.querySelector('.menu-toggle-btn');
    const navLinks = document.getElementById('nav-links');

    // Theme: the saved choice is applied to <html> before first paint by the
    // inline script in <head>. This only handles the toggle button.
    themeToggle?.addEventListener('click', () => {
        const isLight = root.classList.toggle('light-mode');
        try {
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        } catch (error) {
            // Storage can be blocked (private mode, strict settings). The toggle still works for this visit.
        }
    });

    // Mobile menu: opens the link list below the header on small screens.
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
})();
