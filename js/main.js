// main.js

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Toggle mobile navigation menu
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when a link is clicked (for smooth scrolling)
    const navAnchors = navLinks.querySelectorAll('a');
    navAnchors.forEach(anchor => {
        anchor.addEventListener('click', () => {
            // Check if the menu is open (on mobile)
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });

    // Optional: Highlight active section in navbar (more complex, but good practice)
    // For simplicity, this is often done with an Intersection Observer, but for this basic setup,
    // we'll just handle the mobile menu toggle.
});