document.addEventListener('DOMContentLoaded', () => {
    // Get the theme toggle button and the body element
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check if the toggle button exists before proceeding
    if (!themeToggle) {
        console.error("Theme toggle button with ID 'theme-toggle' not found.");
        return;
    }

    /**
     * 1. Load saved theme preference from local storage on page load.
     * The default theme (dark) is applied via CSS/root variables, so 
     * we only need to add 'light-mode' if that preference is saved.
     */
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
    }

    /**
     * 2. Handle theme toggle on button click.
     */
    themeToggle.addEventListener('click', () => {
        // Toggle the 'light-mode' class on the body
        body.classList.toggle('light-mode');
        
        // Save the new preference to local storage
        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.setItem('theme', 'dark');
        }
    });
});

// Add in your own enhancements—animations, etc—as needed!