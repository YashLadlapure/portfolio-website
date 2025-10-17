// Download resume as PDF
const pdfBtn = document.getElementById('downloadPdf');
if (pdfBtn) {
    pdfBtn.addEventListener('click', function() {
        window.print();
    });
}

// Show full profile in alert
const infoBtn = document.getElementById('infoBtn');
if (infoBtn) {
    infoBtn.addEventListener('click', function() {
        alert("I'm Yash Santosh Ladlapure, 3rd year BTech Computer Science student (MIT WPU Pune), skilled in C, C++, Python, SQL, HTML, CSS, Git, and more. Projects: Football Player System, InternSetu (SIH prototype, Team Sspark), active coder and system design enthusiast. Contact: yash.ladlapure@gmail.com | GitHub/YashLadlapure");
    });
}

// Animate skills/progress bars
document.querySelectorAll('.skill-bar').forEach(function(bar){
    const value = bar.getAttribute('data-value');
    bar.style.width = value;
});
