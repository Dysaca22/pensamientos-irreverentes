import { addMarker } from "./marker.js";

const state = {
    markers: new Set(),
};

/**
 * Initializes the map with the first city and locations
 * @param {Object} firstCity - Initial city object with coordinates
 * @param {Array} locations - Array of locations to mark on the map
 * @returns {Object} Map and tile layer instances
 */
export function initMap(firstCity, locations) {
    if (!firstCity?.coords || !Array.isArray(locations)) {
        throw new Error("Invalid parameters provided to initMap");
    }

    const mapConfig = {
        minZoom: 12,
        maxZoom: 18,
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    };

    const map = L.map("map").setView(firstCity.coords, 13);
    const tileLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        mapConfig
    ).addTo(map);

    setViewWithAnimation(map, firstCity.coords, 13);
    addMarkersMap(map, locations);

    return { map, tileLayer };
}

/**
 * Adds markers to the map for given locations
 * @param {L.Map} map - Leaflet map instance
 * @param {Array} locations - Array of locations to mark
 */
export const addMarkersMap = (map, locations) => {
    try {
        // Clear existing markers
        state.markers.forEach((marker) => map.removeLayer(marker));
        state.markers.clear();

        // Add new markers
        locations.forEach((location) => {
            const marker = addMarker(map, location);
            if (marker) {
                state.markers.add(marker);
            }
        });
    } catch (error) {
        console.error("Error adding markers to map:", error);
    }
};

/**
 * Animates the map view transition
 * @param {L.Map} map - Leaflet map instance
 * @param {L.LatLng} newCenter - New center coordinates
 * @param {number} newZoom - New zoom level
 */
export function setViewWithAnimation(map, newCenter, newZoom) {
    if (!map || !newCenter || typeof newZoom !== "number") {
        throw new Error("Invalid parameters for view animation");
    }

    const originalCenter = map.getCenter();
    const originalZoom = map.getZoom();
    const intermediateZoom = Math.max(map.getMinZoom(), originalZoom - 3);

    const initialAnimation = {
        animate: true,
        duration: 0.5,
    };

    const finalAnimation = {
        duration: 2,
        easeLinearity: 0.25,
    };

    map.setView(originalCenter, intermediateZoom, initialAnimation);

    map.once("moveend", () => {
        map.flyTo(newCenter, newZoom, finalAnimation);
    });
}
