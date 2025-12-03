import { getWeapons, getArmors, getShields, getTalismans, getSorceries, getIncantations } from './api.js';

let currentItems = [];
let filteredItems = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updateDateTime();
});

// Setup event listeners
function setupEventListeners() {
    document.getElementById('load-items').addEventListener('click', loadItems);
    document.getElementById('search-input').addEventListener('input', handleSearch);
    document.getElementById('close-detail-modal').addEventListener('click', closeDetailModal);
}

// Load items based on selected category
async function loadItems() {
    const category = document.getElementById('category-filter').value;
    const container = document.getElementById('items-container');

    // Show loading state
    container.innerHTML = '<p class="loading">Loading items...</p>';

    try {
        let items = [];

        // Fetch items from API based on category
        switch (category) {
            case 'weapons':
                items = await getWeapons(100);
                break;
            case 'armors':
                items = await getArmors(100);
                break;
            case 'shields':
                items = await getShields(100);
                break;
            case 'talismans':
                items = await getTalismans(100);
                break;
            case 'sorceries':
                items = await getSorceries(100);
                break;
            case 'incantations':
                items = await getIncantations(100);
                break;
            case 'items':
                // Fetch general items
                const response = await fetch('https://eldenring.fanapis.com/api/items?limit=100');
                const data = await response.json();
                items = data.data;
                break;
            default:
                items = await getWeapons(100);
        }

        currentItems = items;
        filteredItems = items;
        displayItems(items);
    } catch (error) {
        container.innerHTML = '<p class="error">Error loading items. Please try again.</p>';
        console.error('Error loading items:', error);
    }
}

// Display items in the grid
function displayItems(items) {
    const container = document.getElementById('items-container');

    if (!items || items.length === 0) {
        container.innerHTML = '<p class="info-message">No items found.</p>';
        return;
    }

    container.innerHTML = items.map(item => `
    <div class="item-card" data-id="${item.id}">
      <div class="item-image">
        <img src="${item.image || 'images/placeholder.png'}" alt="${item.name}" loading="lazy" width="60" height="60">
      </div>
      <div class="item-info">
        <h3>${item.name}</h3>
        ${item.category ? `<p class="item-category">${item.category}</p>` : ''}
        ${item.weight ? `<p class="item-weight">Weight: ${item.weight}</p>` : ''}
        ${item.type ? `<p class="item-type">${item.type}</p>` : ''}
      </div>
      <button class="view-details-btn" data-item-id="${item.id}">View Details</button>
    </div>
  `).join('');

    // Add click event listeners to view details buttons
    container.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = e.target.dataset.itemId;
            const item = items.find(i => i.id === itemId);
            if (item) showItemDetails(item);
        });
    });
}

// Handle search input
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();

    if (!searchTerm) {
        filteredItems = currentItems;
        displayItems(currentItems);
        return;
    }

    filteredItems = currentItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm) ||
        (item.description && item.description.toLowerCase().includes(searchTerm))
    );

    displayItems(filteredItems);
}

// Show detailed information about an item
function showItemDetails(item) {
    const modal = document.getElementById('item-detail-modal');
    const modalName = document.getElementById('modal-item-name');
    const modalContent = document.getElementById('item-detail-content');

    modalName.textContent = item.name;

    let detailsHTML = `
    <div class="item-detail-container">
      <div class="item-detail-image">
        <img src="${item.image || 'images/placeholder.png'}" alt="${item.name}" loading="lazy" width="150" height="150">
      </div>
      <div class="item-detail-info">
  `;

    // Description
    if (item.description) {
        detailsHTML += `<div class="detail-section">
      <h3>Description</h3>
      <p>${item.description}</p>
    </div>`;
    }

    // Category/Type
    if (item.category || item.type) {
        detailsHTML += `<div class="detail-section">
      <h3>Type</h3>
      <p>${item.category || item.type || 'Unknown'}</p>
    </div>`;
    }

    // Weight
    if (item.weight) {
        detailsHTML += `<div class="detail-section">
      <h3>Weight</h3>
      <p>${item.weight}</p>
    </div>`;
    }

    // Attack stats (for weapons)
    if (item.attack) {
        detailsHTML += `<div class="detail-section">
      <h3>Attack</h3>
      <ul>`;

        // Handle both array and object formats
        if (Array.isArray(item.attack)) {
            item.attack.forEach(attackStat => {
                if (attackStat.name && attackStat.amount && attackStat.amount !== '0') {
                    detailsHTML += `<li><strong>${attackStat.name}:</strong> ${attackStat.amount}</li>`;
                }
            });
        } else {
            for (let [key, value] of Object.entries(item.attack)) {
                if (value && value !== '0') {
                    detailsHTML += `<li><strong>${formatStatName(key)}:</strong> ${value}</li>`;
                }
            }
        }
        detailsHTML += `</ul></div>`;
    }

    // Defense stats (for armor/shields)
    if (item.defence) {
        detailsHTML += `<div class="detail-section">
      <h3>Defense</h3>
      <ul>`;

        // Handle both array and object formats
        if (Array.isArray(item.defence)) {
            item.defence.forEach(defenceStat => {
                if (defenceStat.name && defenceStat.amount && defenceStat.amount !== '0') {
                    detailsHTML += `<li><strong>${defenceStat.name}:</strong> ${defenceStat.amount}</li>`;
                }
            });
        } else {
            for (let [key, value] of Object.entries(item.defence)) {
                if (value && value !== '0') {
                    detailsHTML += `<li><strong>${formatStatName(key)}:</strong> ${value}</li>`;
                }
            }
        }
        detailsHTML += `</ul></div>`;
    }

    // Damage negation (for armor)
    if (item.dmgNegation) {
        detailsHTML += `<div class="detail-section">
      <h3>Damage Negation</h3>
      <ul>`;
        for (let [key, value] of Object.entries(item.dmgNegation)) {
            if (value && value !== '0') {
                detailsHTML += `<li><strong>${formatStatName(key)}:</strong> ${value}</li>`;
            }
        }
        detailsHTML += `</ul></div>`;
    }

    // Resistance (for armor)
    if (item.resistance) {
        detailsHTML += `<div class="detail-section">
      <h3>Resistance</h3>
      <ul>`;
        for (let [key, value] of Object.entries(item.resistance)) {
            if (value && value !== '0') {
                detailsHTML += `<li><strong>${formatStatName(key)}:</strong> ${value}</li>`;
            }
        }
        detailsHTML += `</ul></div>`;
    }

    // Required attributes
    if (item.requiredAttributes) {
        detailsHTML += `<div class="detail-section">
      <h3>Requirements</h3>
      <ul>`;

        // Handle both array and object formats
        if (Array.isArray(item.requiredAttributes)) {
            item.requiredAttributes.forEach(req => {
                if (req.name && req.amount && req.amount !== '0') {
                    detailsHTML += `<li><strong>${req.name.toUpperCase()}:</strong> ${req.amount}</li>`;
                }
            });
        } else {
            for (let [key, value] of Object.entries(item.requiredAttributes)) {
                if (value && value !== '0') {
                    detailsHTML += `<li><strong>${formatStatName(key).toUpperCase()}:</strong> ${value}</li>`;
                }
            }
        }
        detailsHTML += `</ul></div>`;
    }

    // Scaling
    if (item.scalesWith) {
        detailsHTML += `<div class="detail-section">
      <h3>Attribute Scaling</h3>
      <ul>`;

        // Handle both array and object formats
        if (Array.isArray(item.scalesWith)) {
            item.scalesWith.forEach(scaling => {
                if (scaling.name && scaling.scaling && scaling.scaling !== '-') {
                    detailsHTML += `<li><strong>${scaling.name.toUpperCase()}:</strong> ${scaling.scaling}</li>`;
                }
            });
        } else {
            for (let [key, value] of Object.entries(item.scalesWith)) {
                if (value && value !== '-') {
                    detailsHTML += `<li><strong>${formatStatName(key).toUpperCase()}:</strong> ${value}</li>`;
                }
            }
        }
        detailsHTML += `</ul></div>`;
    }

    // Effect
    if (item.effect) {
        detailsHTML += `<div class="detail-section">
      <h3>Effect</h3>
      <p>${item.effect}</p>
    </div>`;
    }

    // Cost (for spells)
    if (item.cost) {
        detailsHTML += `<div class="detail-section">
      <h3>FP Cost</h3>
      <p>${item.cost}</p>
    </div>`;
    }

    // Slots (for spells)
    if (item.slots) {
        detailsHTML += `<div class="detail-section">
      <h3>Slots Required</h3>
      <p>${item.slots}</p>
    </div>`;
    }

    detailsHTML += `</div></div>`;
    modalContent.innerHTML = detailsHTML;
    modal.showModal();
}

// Format stat names for better display
function formatStatName(name) {
    const nameMap = {
        'str': 'Strength',
        'dex': 'Dexterity',
        'int': 'Intelligence',
        'fai': 'Faith',
        'arc': 'Arcane',
        'physical': 'Physical',
        'magic': 'Magic',
        'fire': 'Fire',
        'lightning': 'Lightning',
        'holy': 'Holy',
        'immunity': 'Immunity',
        'robustness': 'Robustness',
        'focus': 'Focus',
        'vitality': 'Vitality',
        'poise': 'Poise'
    };

    return nameMap[name.toLowerCase()] || name.charAt(0).toUpperCase() + name.slice(1);
}

// Close the detail modal
function closeDetailModal() {
    document.getElementById('item-detail-modal').close();
}

// Update date/time in footer
function updateDateTime() {
    const currentYear = document.getElementById('current-year');
    const lastModified = document.getElementById('last-modified');

    if (currentYear) currentYear.textContent = new Date().getFullYear();
    if (lastModified) lastModified.textContent = document.lastModified;
}
