/**
 * Fetches cities data from JSON file
 * @returns {Promise<Array<Object>>} Array of city objects
 * @throws {Error} If fetch or parsing fails
 */
async function getCities() {
    const BASE_PATH = window.location.pathname.replace(/\/?$/, '/');
    const CITIES_ENDPOINT = `${BASE_PATH}public/data/cities.json`;

    try {
        const response = await fetch(CITIES_ENDPOINT);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch cities: ${response.status} ${response.statusText}`);
        }

        const { cities = [] } = await response.json();
        return Array.isArray(cities) ? cities : [];
        
    } catch (error) {
        console.error('Error fetching cities:', error.message);
        return [];
    }
}

/**
 * Fetches and parses data from Google Sheet
 * @returns {Promise<Array>} Data in JSON format
 * @throws {Error} If fetch or parsing fails
 */
async function getSheetData() {
    const SHEET_URL =
        "https://docs.google.com/spreadsheets/d/1Q1U1PVQQ0gxLnVgQkx2YpqZX67N__P02Tn5E-gp_DDk/export?format=tsv&gid=0";

    try {
        const response = await fetch(SHEET_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        return parseTSV(text);
    } catch (error) {
        console.error("Error reading Google Sheet:", error);
        return [];
    }
}

/**
 * Converts TSV to JSON
 * @param {string} tsv - TSV formatted string
 * @returns {Array<Object>} Array of objects with header keys
 * @throws {Error} If TSV parsing fails
 */
function parseTSV(tsv) {
    if (!tsv?.trim()) {
        return [];
    }

    const lines = tsv.split(/\r?\n/).filter(Boolean);
    if (!lines.length) {
        return [];
    }

    const headers = lines[0].split("\t").map((header) => header.trim());

    return lines.slice(1).map((line) => {
        const values = line.split("\t");
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index]?.trim() || null;
            return obj;
        }, {});
    });
}

/**
 * Filters locations by country and city
 * @param {string} [country] - Optional country filter
 * @param {string} [city] - Optional city filter
 * @returns {Promise<Array>} Filtered locations
 */
export async function getLocations(country, city) {
    const data = await getSheetData();

    return data.filter((location) => {
        const [locationCity, locationCountry] =
            location["Ciudad, País"]?.split(", ") ?? [];

        const countryMatch =
            !country ||
            locationCountry?.toLowerCase() === country.toLowerCase();
        const cityMatch =
            !city || locationCity?.toLowerCase() === city.toLowerCase();

        return countryMatch && cityMatch;
    });
}

// Cache cities data to avoid unnecessary fetches
export const ciudades = await getCities().catch((error) => {
    console.error("Failed to initialize cities:", error);
    return [];
});
