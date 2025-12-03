// Shared functionality across all pages

// Update date and time in footer
function updateDateTime() {
    const currentYear = document.getElementById('current-year');
    const lastModified = document.getElementById('last-modified');

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    if (lastModified) {
        lastModified.textContent = document.lastModified;
    }
}

// Mobile menu toggle (hamburger menu)
function setupMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navBar = document.getElementById('nav-bar');

    if (menuToggle && navBar) {
        menuToggle.addEventListener('click', () => {
            navBar.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Close menu when clicking a link
        const navLinks = navBar.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navBar.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }
}

// Wayfinding - highlight current page in navigation
function setupWayfinding() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        const parentLi = link.parentElement;

        // Remove any existing current class
        parentLi.classList.remove('current');

        // Add current class to matching page
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            parentLi.classList.add('current');
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    setupMobileMenu();
    setupWayfinding();
});
