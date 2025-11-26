// Hamburger Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav-bar');

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Visitor tracking with localStorage
function displayVisitorMessage() {
    const visitorMessageElement = document.getElementById('visitor-message');
    const lastVisit = localStorage.getItem('lastVisit');
    const currentVisit = Date.now();

    if (!lastVisit) {
        // First visit
        visitorMessageElement.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const timeDifference = currentVisit - parseInt(lastVisit);
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        if (daysDifference < 1) {
            // Less than a day
            visitorMessageElement.textContent = "Back so soon! Awesome!";
        } else if (daysDifference === 1) {
            // Exactly 1 day
            visitorMessageElement.textContent = "You last visited 1 day ago.";
        } else {
            // More than 1 day
            visitorMessageElement.textContent = `You last visited ${daysDifference} days ago.`;
        }
    }

    // Store current visit date
    localStorage.setItem('lastVisit', currentVisit.toString());
}

// Footer - Current Year and Last Modified
function updateFooter() {
    const currentYearElement = document.getElementById('current-year');
    const lastModifiedElement = document.getElementById('last-modified');

    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    if (lastModifiedElement) {
        lastModifiedElement.textContent = document.lastModified;
    }
}

// Run on page load
displayVisitorMessage();
updateFooter();
