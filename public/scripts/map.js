export function initMap(firstCity, locations) {
    if (!firstCity?.coords || !Array.isArray(locations)) {
        throw new Error("Invalid parameters provided to initMap");
    }
    const coords = firstCity.coords.split(",");

    const mapConfig = {
        minZoom: 12,
        maxZoom: 18,
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    };

    const map = L.map("map").setView(coords, 13);
    const tileLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        mapConfig
    ).addTo(map);

    setViewWithAnimation(map, coords, 13);
    return { map, tileLayer };
}

function setViewWithAnimation(map, newCenter, newZoom) {
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
