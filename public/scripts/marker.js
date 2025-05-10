const MARKER_ICON = L.divIcon({
    className: "text-seagull-800 marker-icon",
    html: `
      <svg width="40" height="40" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill="currentColor" stroke="#e1f4fd" stroke-width="4"/>
        <path d="M32 18a14 14 0 1 1 0 28 14 14 0 0 1 0-28z" fill="#e1f4fd"/>
        <circle cx="32" cy="32" r="7" fill="currentColor"/>
        <circle cx="32" cy="32" r="3" fill="#e1f4fd"/>
      </svg>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
});

/**
 * Adds a marker to the map and sets up its click event handler
 * @param {L.Map} map - The Leaflet map instance
 * @param {Object} lugar - Place data object containing coordinates and details
 * @returns {L.Marker} The created marker instance
 */
export function addMarker(map, lugar) {
    const [lat, lng] = lugar["Coordenadas"].split(",").map(Number);

    const marker = L.marker([lat, lng], {
        icon: MARKER_ICON,
        title: lugar["Nombre"],
    }).addTo(map);

    marker.on("click", () => {
        updateModalContent(lugar);
        document.querySelectorAll(".marker-icon").forEach((icon) => {
            icon.classList.remove("text-seagull-300");
        });
        marker.getElement().classList.add("text-seagull-300");
    });
    return marker;
}

/**
 * Updates the modal content with place details
 * @param {Object} lugar - Place data object containing details to display
 */
function updateModalContent(lugar) {
    const modalContent = document.getElementById("modal-content");
    const modalElements = {
        "modal-type": lugar["Tipo"],
        "modal-title": lugar["Nombre"],
        "modal-image": "./images/" + lugar["Nombre"] + ".jpg",
        "modal-description": lugar["Descripción"],
        "modal-location": lugar["Dirección"],
        "modal-link": lugar["Sitio Web"],
    };

    Object.entries(modalElements).forEach(([elementId, value]) => {
        const element = modalContent.querySelector(`#${elementId}`);
        if (elementId === "modal-image") {
            element.src = value;
        } else if (elementId === "modal-link") {
            element.href = value;
        } else {
            element.textContent = value;
        }
    });

    document.getElementById("modal").classList.add("active");
}
