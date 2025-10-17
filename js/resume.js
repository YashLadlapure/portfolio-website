<<<<<<< Updated upstream
<<<<<<< Updated upstream
// resume.js
// Basic dark mode toggle (optional)
const darkToggle = document.getElementById('theme-toggle');
if (darkToggle) {
  darkToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark');
  });
}

// Add in your own enhancements—animations, etc—as needed!
=======
=======
>>>>>>> Stashed changes
<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', () => {
    // Get the theme toggle button and the body element
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    /**
     * 1. Load saved theme preference from local storage on page load.
     */
    // Default to 'dark' if no preference is saved, to match screenshot
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') { // Check for 'light' explicitly
        body.classList.add('light-mode'); // Add light-mode class
    } else {
        // If no saved theme or saved as 'dark', ensure dark-mode is default
        // No class needed as :root sets dark by default now.
        // If a 'dark-mode' class were used, it would be added here.
    }

    /**
     * 2. Handle theme toggle on button click.
     */
    themeToggle.addEventListener('click', () => {
        // Toggle between 'light-mode' and no class (which defaults to dark)
        body.classList.toggle('light-mode');
        
        // Save the new preference to local storage
        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.setItem('theme', 'dark'); // Save as dark
        }
    });
    
    // The scrolling header effect from previous versions isn't explicitly in the screenshot,
    // so I've simplified it to be a fixed, opaque header from the start.
    // If a subtle scroll effect is still desired, it can be re-added here.
});
=======
// resume.js
// Basic dark mode toggle (optional)
const darkToggle = document.getElementById('theme-toggle');
if (darkToggle) {
  darkToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark');
  });
}

// Add in your own enhancements—animations, etc—as needed!
>>>>>>> ad02d0900d504d2fde2a7318fd2b562fe4bd83d0
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
