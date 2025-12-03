import { getWeapons, getArmors, getTalismans, getShields } from './api.js';

// Current build state
let currentBuild = {
    name: '',
    weapons: {
        'right-hand-1': null,
        'right-hand-2': null,
        'left-hand-1': null,
        'left-hand-2': null
    },
    armor: {
        head: null,
        chest: null,
        arms: null,
        legs: null
    },
    talismans: {
        'talisman-1': null,
        'talisman-2': null,
        'talisman-3': null,
        'talisman-4': null
    }
};

let currentCategory = '';
let currentSlot = '';

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadSavedBuilds();
    updateDateTime();
});

// Setup event listeners
function setupEventListeners() {
    // Item selection buttons
    document.querySelectorAll('.select-item').forEach(button => {
        button.addEventListener('click', (e) => {
            currentCategory = e.target.dataset.category;
            currentSlot = e.target.dataset.slot;
            openItemSelector(currentCategory);
        });
    });

    // Save build button
    document.getElementById('save-build').addEventListener('click', saveBuild);

    // Load build button
    document.getElementById('load-build').addEventListener('click', () => {
        document.querySelector('.saved-builds').classList.toggle('show');
    });

    // Clear build button
    document.getElementById('clear-build').addEventListener('click', clearBuild);

    // Modal close button
    document.getElementById('close-modal').addEventListener('click', closeModal);

    // Item search
    document.getElementById('item-search').addEventListener('input', (e) => {
        filterItems(e.target.value);
    });
}

// Open item selector modal
async function openItemSelector(category) {
    const modal = document.getElementById('item-selector');
    const itemList = document.getElementById('item-list');

    // Show loading
    itemList.innerHTML = '<p class="loading">Loading items...</p>';
    modal.showModal();

    try {
        let items = [];

        // Fetch items based on category
        if (category === 'weapons') {
            const [weapons, shields] = await Promise.all([getWeapons(100), getShields(100)]);
            items = [...weapons, ...shields];
        } else if (category === 'armors') {
            const allArmors = await getArmors(600);  // Increased limit to get all armor pieces

            // Filter armors based on the slot (head, chest, arms, legs)
            const slot = currentSlot;
            items = allArmors.filter(armor => {
                const armorCategory = armor.category || '';

                if (slot === 'head') {
                    return armorCategory === 'Helm' || armorCategory === 'Head Armor';
                } else if (slot === 'chest') {
                    return armorCategory === 'Chest Armor';
                } else if (slot === 'arms') {
                    return armorCategory === 'Gauntlets' || armorCategory === 'Arm Armor';
                } else if (slot === 'legs') {
                    return armorCategory === 'Leg Armor';
                }
                return false; // Don't show if doesn't match any category
            });
        } else if (category === 'talismans') {
            items = await getTalismans(100);
        }

        displayItems(items);
    } catch (error) {
        itemList.innerHTML = '<p class="error">Error loading items. Please try again.</p>';
        console.error('Error loading items:', error);
    }
}

// Display items in the modal
function displayItems(items) {
    const itemList = document.getElementById('item-list');
    itemList.innerHTML = '';

    if (!items || items.length === 0) {
        itemList.innerHTML = '<p>No items found.</p>';
        return;
    }

    items.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        itemCard.innerHTML = `
      <img src="${item.image || 'images/placeholder.png'}" alt="${item.name}" loading="lazy" width="60" height="60">
      <h4>${item.name}</h4>
      <p class="item-category">${item.category || ''}</p>
    `;

        itemCard.addEventListener('click', () => selectItem(item));
        itemList.appendChild(itemCard);
    });
}

// Filter items based on search
function filterItems(searchTerm) {
    const itemCards = document.querySelectorAll('.item-card');
    const search = searchTerm.toLowerCase();

    itemCards.forEach(card => {
        const itemName = card.querySelector('h4').textContent.toLowerCase();
        card.style.display = itemName.includes(search) ? 'block' : 'none';
    });
}

// Select an item and add to build
function selectItem(item) {
    const slot = currentSlot;

    // Determine which build section to update
    if (slot.includes('hand')) {
        currentBuild.weapons[slot] = item;
    } else if (slot.includes('talisman')) {
        currentBuild.talismans[slot] = item;
    } else {
        currentBuild.armor[slot] = item;
    }

    displaySelectedItem(slot, item);
    updateBuildStats();
    closeModal();
}

// Display selected item in the slot
function displaySelectedItem(slot, item) {
    const slotElement = document.getElementById(slot);

    // Don't show remove button for talismans
    const showRemoveButton = !slot.includes('talisman');

    slotElement.innerHTML = `
    <div class="item-display">
      <img src="${item.image || 'images/placeholder.png'}" alt="${item.name}" width="80" height="80" loading="lazy">
      <div class="item-info">
        <h4>${item.name}</h4>
        ${item.weight ? `<p>Weight: ${item.weight}</p>` : ''}
        ${item.attack ? `<p>Attack: ${formatAttackDefense(item.attack)}</p>` : ''}
        ${item.defence ? `<p>Defense: ${formatAttackDefense(item.defence)}</p>` : ''}
        ${item.requiredAttributes ? `<p>Requirements: ${formatRequirements(item.requiredAttributes)}</p>` : ''}
      </div>
      ${showRemoveButton ? `<button class="remove-item" data-slot="${slot}">Remove</button>` : ''}
    </div>
  `;

    // Add event listener to remove button if it exists
    const removeButton = slotElement.querySelector('.remove-item');
    if (removeButton) {
        removeButton.addEventListener('click', (e) => {
            removeItem(e.target.dataset.slot);
        });
    }
}

// Format attack or defense for display
function formatAttackDefense(data) {
    if (!data) return 'None';

    // Handle array format
    if (Array.isArray(data)) {
        const stats = data
            .filter(stat => stat.amount && stat.amount !== '0')
            .map(stat => `${stat.name}: ${stat.amount}`);
        return stats.join(', ') || 'None';
    }

    // Handle object format
    const stats = [];
    for (let [key, value] of Object.entries(data)) {
        if (value && value !== '0') {
            stats.push(`${key}: ${value}`);
        }
    }
    return stats.join(', ') || 'None';
}

// Format requirements for display
function formatRequirements(requirements) {
    if (!requirements) return 'None';

    // Handle array format
    if (Array.isArray(requirements)) {
        const reqs = requirements
            .filter(req => req.amount && req.amount !== '0')
            .map(req => `${req.name.toUpperCase()} ${req.amount}`);
        return reqs.join(', ') || 'None';
    }

    // Handle object format
    const reqs = [];
    if (requirements.str) reqs.push(`STR ${requirements.str}`);
    if (requirements.dex) reqs.push(`DEX ${requirements.dex}`);
    if (requirements.int) reqs.push(`INT ${requirements.int}`);
    if (requirements.fai) reqs.push(`FAI ${requirements.fai}`);
    if (requirements.arc) reqs.push(`ARC ${requirements.arc}`);

    return reqs.join(', ') || 'None';
}

// Remove item from build
function removeItem(slot) {
    if (slot.includes('hand')) {
        currentBuild.weapons[slot] = null;
    } else if (slot.includes('talisman')) {
        currentBuild.talismans[slot] = null;
    } else {
        currentBuild.armor[slot] = null;
    }

    document.getElementById(slot).innerHTML = '';
    updateBuildStats();
}

// Update build statistics
function updateBuildStats() {
    let totalWeight = 0;
    let maxStr = 0, maxDex = 0, maxInt = 0, maxFai = 0, maxArc = 0;

    // Calculate from all equipped items
    const allItems = [
        ...Object.values(currentBuild.weapons),
        ...Object.values(currentBuild.armor),
        ...Object.values(currentBuild.talismans)
    ].filter(item => item !== null);

    allItems.forEach(item => {
        if (item.weight) totalWeight += parseFloat(item.weight) || 0;

        if (item.requiredAttributes) {
            // Handle array format
            if (Array.isArray(item.requiredAttributes)) {
                item.requiredAttributes.forEach(req => {
                    const amount = parseInt(req.amount) || 0;
                    const name = req.name.toLowerCase();
                    if (name === 'str' || name === 'strength') maxStr = Math.max(maxStr, amount);
                    else if (name === 'dex' || name === 'dexterity') maxDex = Math.max(maxDex, amount);
                    else if (name === 'int' || name === 'intelligence') maxInt = Math.max(maxInt, amount);
                    else if (name === 'fai' || name === 'faith') maxFai = Math.max(maxFai, amount);
                    else if (name === 'arc' || name === 'arcane') maxArc = Math.max(maxArc, amount);
                });
            } else {
                // Handle object format
                maxStr = Math.max(maxStr, item.requiredAttributes.str || 0);
                maxDex = Math.max(maxDex, item.requiredAttributes.dex || 0);
                maxInt = Math.max(maxInt, item.requiredAttributes.int || 0);
                maxFai = Math.max(maxFai, item.requiredAttributes.fai || 0);
                maxArc = Math.max(maxArc, item.requiredAttributes.arc || 0);
            }
        }
    });

    // Update display
    document.getElementById('total-weight').textContent = totalWeight.toFixed(1);
    document.getElementById('req-str').textContent = maxStr;
    document.getElementById('req-dex').textContent = maxDex;
    document.getElementById('req-int').textContent = maxInt;
    document.getElementById('req-fai').textContent = maxFai;
    document.getElementById('req-arc').textContent = maxArc;
}

// Save build to localStorage
function saveBuild() {
    const buildName = document.getElementById('build-name').value.trim();

    if (!buildName) {
        alert('Please enter a build name');
        return;
    }

    currentBuild.name = buildName;

    // Get existing builds
    const savedBuilds = JSON.parse(localStorage.getItem('eldenBuilds') || '[]');

    // Check if build name already exists
    const existingIndex = savedBuilds.findIndex(b => b.name === buildName);

    if (existingIndex >= 0) {
        if (confirm('A build with this name already exists. Overwrite?')) {
            savedBuilds[existingIndex] = { ...currentBuild };
        } else {
            return;
        }
    } else {
        savedBuilds.push({ ...currentBuild });
    }

    localStorage.setItem('eldenBuilds', JSON.stringify(savedBuilds));
    loadSavedBuilds();
    alert('Build saved successfully!');
}

// Load and display saved builds
function loadSavedBuilds() {
    const savedBuilds = JSON.parse(localStorage.getItem('eldenBuilds') || '[]');
    const buildsList = document.getElementById('saved-builds-list');

    if (savedBuilds.length === 0) {
        buildsList.innerHTML = '<p>No saved builds yet.</p>';
        return;
    }

    buildsList.innerHTML = savedBuilds.map((build, index) => `
    <div class="saved-build-card">
      <h4>${build.name}</h4>
      <button class="btn-load" data-index="${index}">Load</button>
      <button class="btn-delete" data-index="${index}">Delete</button>
    </div>
  `).join('');

    // Add event listeners
    buildsList.querySelectorAll('.btn-load').forEach(btn => {
        btn.addEventListener('click', (e) => {
            loadBuildByIndex(e.target.dataset.index);
        });
    });

    buildsList.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            deleteBuildByIndex(e.target.dataset.index);
        });
    });
}

// Load a specific build
function loadBuildByIndex(index) {
    const savedBuilds = JSON.parse(localStorage.getItem('eldenBuilds') || '[]');
    currentBuild = { ...savedBuilds[index] };

    document.getElementById('build-name').value = currentBuild.name;

    // Display all items
    Object.entries(currentBuild.weapons).forEach(([slot, item]) => {
        if (item) displaySelectedItem(slot, item);
    });

    Object.entries(currentBuild.armor).forEach(([slot, item]) => {
        if (item) displaySelectedItem(slot, item);
    });

    Object.entries(currentBuild.talismans).forEach(([slot, item]) => {
        if (item) displaySelectedItem(slot, item);
    });

    updateBuildStats();
    alert('Build loaded successfully!');
}

// Delete a specific build
function deleteBuildByIndex(index) {
    if (!confirm('Are you sure you want to delete this build?')) return;

    const savedBuilds = JSON.parse(localStorage.getItem('eldenBuilds') || '[]');
    savedBuilds.splice(index, 1);
    localStorage.setItem('eldenBuilds', JSON.stringify(savedBuilds));
    loadSavedBuilds();
}

// Clear current build
function clearBuild() {
    if (!confirm('Clear all equipment from current build?')) return;

    currentBuild = {
        name: '',
        weapons: {
            'right-hand-1': null,
            'right-hand-2': null,
            'left-hand-1': null,
            'left-hand-2': null
        },
        armor: {
            head: null,
            chest: null,
            arms: null,
            legs: null
        },
        talismans: {
            'talisman-1': null,
            'talisman-2': null,
            'talisman-3': null,
            'talisman-4': null
        }
    };

    document.getElementById('build-name').value = '';
    document.querySelectorAll('.selected-item').forEach(el => el.innerHTML = '');
    updateBuildStats();
}

// Close modal
function closeModal() {
    document.getElementById('item-selector').close();
    document.getElementById('item-search').value = '';
}

// Update date/time in footer
function updateDateTime() {
    const currentYear = document.getElementById('current-year');
    const lastModified = document.getElementById('last-modified');

    if (currentYear) currentYear.textContent = new Date().getFullYear();
    if (lastModified) lastModified.textContent = document.lastModified;
}
