// Elden Ring API Base URL
const API_BASE = 'https://eldenring.fanapis.com/api';

/**
 * Generic fetch function with error handling
 */
async function fetchFromAPI(endpoint) {
    try {
        const response = await fetch(`${API_BASE}/${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

/**
 * Fetch all weapons
 */
export async function getWeapons(limit = 100) {
    const data = await fetchFromAPI(`weapons?limit=${limit}`);
    return data.data;
}

/**
 * Fetch a specific weapon by ID
 */
export async function getWeaponById(id) {
    const data = await fetchFromAPI(`weapons/${id}`);
    return data.data;
}

/**
 * Fetch all armor pieces (handles pagination to get all items)
 */
export async function getArmors(limit = 100) {
    let allArmors = [];
    let page = 0;
    let hasMore = true;

    // API max limit is 100 per page, so fetch multiple pages if needed
    while (hasMore && allArmors.length < limit) {
        const data = await fetchFromAPI(`armors?limit=100&page=${page}`);
        allArmors = allArmors.concat(data.data);

        // Check if there are more pages
        hasMore = data.count === 100 && allArmors.length < data.total;
        page++;

        // Stop if we've reached the desired limit
        if (allArmors.length >= limit) {
            allArmors = allArmors.slice(0, limit);
            break;
        }
    }

    return allArmors;
}

/**
 * Fetch a specific armor by ID
 */
export async function getArmorById(id) {
    const data = await fetchFromAPI(`armors/${id}`);
    return data.data;
}

/**
 * Fetch all talismans
 */
export async function getTalismans(limit = 100) {
    const data = await fetchFromAPI(`talismans?limit=${limit}`);
    return data.data;
}

/**
 * Fetch a specific talisman by ID
 */
export async function getTalismanById(id) {
    const data = await fetchFromAPI(`talismans/${id}`);
    return data.data;
}

/**
 * Fetch all shields
 */
export async function getShields(limit = 100) {
    const data = await fetchFromAPI(`shields?limit=${limit}`);
    return data.data;
}

/**
 * Fetch all sorceries
 */
export async function getSorceries(limit = 100) {
    const data = await fetchFromAPI(`sorceries?limit=${limit}`);
    return data.data;
}

/**
 * Fetch all incantations
 */
export async function getIncantations(limit = 100) {
    const data = await fetchFromAPI(`incantations?limit=${limit}`);
    return data.data;
}

/**
 * Search items by name
 */
export async function searchByName(name, category = 'weapons') {
    const data = await fetchFromAPI(`${category}?name=${encodeURIComponent(name)}`);
    return data.data;
}

/**
 * Get all available categories
 */
export function getAvailableCategories() {
    return [
        'weapons',
        'armors',
        'shields',
        'talismans',
        'sorceries',
        'incantations',
        'classes',
        'bosses',
        'npcs',
        'locations',
        'items'
    ];
}