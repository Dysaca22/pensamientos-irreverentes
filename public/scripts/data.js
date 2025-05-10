async function getCities() {
    const response = await fetch("/data/cities.json");
    const { cities } = await response.json();
    return cities;
}

export async function getLocations(pais, ciudad) {
    const response = await fetch(
        `/api/locations?pais=${pais}&ciudad=${ciudad}`
    );
    const locations = await response.json();
    return locations;
}

export const ciudades = await getCities();