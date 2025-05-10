async function getCities() {
    const response = await fetch("/data/cities.json");
    const { cities } = await response.json();
    return cities;
}

/**
 * Obtiene y parsea datos del Google Sheet
 * @returns {Promise<Array>} Datos en formato JSON
 */
async function getSheetData() {
    try {
        const response = await fetch(
            "https://docs.google.com/spreadsheets/d/1Q1U1PVQQ0gxLnVgQkx2YpqZX67N__P02Tn5E-gp_DDk/export?format=tsv&gid=0"
        );
        const text = await response.text();
        return parseTSV(text);
    } catch (error) {
        console.error("Error leyendo Google Sheet:", error);
        return [];
    }
}

/**
 * Convierte TSV a JSON
 * @param {string} tsv
 * @returns {Array}
 */
function parseTSV(tsv) {
    const lines = tsv.split(/\r?\n/);
    const headers = lines[0].split("\t");
    return lines.slice(1).map((line) => {
        const values = line.split("\t");
        return headers.reduce((obj, header, i) => {
            obj[header] = values[i] || null;
            return obj;
        }, {});
    });
}

/**
 * Filtra las ubicaciones por país y ciudad
 * @param {string} country
 * @param {string} city
 * @returns {Promise<Array>} Ubicaciones filtradas
 */
export async function getLocations(country, city) {
    const data = await getSheetData();
    return data.filter((location) => {
        const [locationCity, locationCountry] =
            location["Ciudad, País"].split(", ");
        return (
            (!country ||
                locationCountry.toLowerCase() === country.toLowerCase()) &&
            (!city || locationCity.toLowerCase() === city.toLowerCase())
        );
    });
}

export const ciudades = await getCities();
