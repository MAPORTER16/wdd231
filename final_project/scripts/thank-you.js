// Get URL parameters and display form data
document.addEventListener('DOMContentLoaded', () => {
    displayFormData();
    updateDateTime();
});

function displayFormData() {
    const urlParams = new URLSearchParams(window.location.search);
    const detailsContainer = document.getElementById('submission-details');

    if (!urlParams.has('name')) {
        detailsContainer.innerHTML = '<p>No form data available.</p>';
        return;
    }

    // Field labels mapping
    const fieldLabels = {
        'name': 'Name',
        'email': 'Email',
        'messageType': 'Message Type',
        'message': 'Message',
        'subscribe': 'Subscribe to Updates'
    };

    let htmlContent = '';

    // Display each form field
    for (const [key, value] of urlParams.entries()) {
        const label = fieldLabels[key] || key;
        const displayValue = key === 'subscribe' ? 'Yes' : decodeURIComponent(value);

        htmlContent += `
            <dt>${label}:</dt>
            <dd>${displayValue}</dd>
        `;
    }

    detailsContainer.innerHTML = htmlContent;
}

function updateDateTime() {
    const currentYear = document.getElementById('current-year');
    const lastModified = document.getElementById('last-modified');

    if (currentYear) currentYear.textContent = new Date().getFullYear();
    if (lastModified) lastModified.textContent = document.lastModified;
}
