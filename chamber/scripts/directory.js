// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Set last modified date
document.getElementById('last-modified').textContent = document.lastModified;

// Global variables
let companies = [];
let currentView = 'grid';

// Fetch company data
async function fetchCompanyData() {
    const container = document.querySelector('.container');

    // Show loading indicator
    container.innerHTML = '<div class="loading">Loading business directory...</div>';

    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        companies = data.companies;
        displayCompanies(companies);
    } catch (error) {
        console.error('Error fetching company data:', error);
        container.innerHTML = `
            <div class="error-message">
                <h3>Unable to load business directory</h3>
                <p>Please try again later or contact support if the problem persists.</p>
            </div>
        `;
    }
}

// Display companies based on current view
function displayCompanies(companiesData) {
    const container = document.querySelector('.container');
    container.innerHTML = '';

    companiesData.forEach(company => {
        const memberCard = createMemberCard(company);
        container.appendChild(memberCard);
    });
}

// Create member card HTML
function createMemberCard(company) {
    const card = document.createElement('div');
    card.className = `business-card ${currentView === 'list' ? 'list-view' : ''}`;

    const membershipBadge = getMembershipBadge(company.membershipLevel);

    card.innerHTML = `
        <div class="business-image">
            <img src="${company.image}" alt="${company.name}" loading="lazy">
        </div>
        <div class="business-info">
            <h3>${company.name} ${membershipBadge}</h3>
            <p><strong>Category:</strong> ${company.category}</p>
            <p>${company.description}</p>
            <p><strong>Address:</strong> ${company.address}</p>
            <p><strong>Phone:</strong> ${company.phone}</p>
            <p><strong>Website:</strong> <a href="${company.website}" target="_blank">${company.website}</a></p>
            <p><strong>Established:</strong> ${company.yearEstablished}</p>
            <p><strong>Services:</strong> ${company.services.join(', ')}</p>
        </div>
    `;

    return card;
}

// Get membership badge based on level
function getMembershipBadge(level) {
    switch (level) {
        case 1:
            return '<span class="membership-badge member">★ Member</span>';
        case 2:
            return '<span class="membership-badge silver">★★ Silver</span>';
        case 3:
            return '<span class="membership-badge gold">★★★ Gold</span>';
        default:
            return '';
    }
}

// Toggle between grid and list view
function toggleView(view) {
    currentView = view;
    const container = document.querySelector('.container');
    const gridBtn = document.getElementById('grid-btn');
    const listBtn = document.getElementById('list-btn');

    if (view === 'grid') {
        container.classList.remove('list-view');
        container.classList.add('grid-view');
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
    } else {
        container.classList.remove('grid-view');
        container.classList.add('list-view');
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
    }

    displayCompanies(companies);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    fetchCompanyData();

    // Add event listeners for toggle buttons
    const gridBtn = document.getElementById('grid-btn');
    const listBtn = document.getElementById('list-btn');

    if (gridBtn) gridBtn.addEventListener('click', () => toggleView('grid'));
    if (listBtn) listBtn.addEventListener('click', () => toggleView('list'));
});