const MARKER_ICON = L.divIcon({
    className: "marker-icon",
    html: `
        <lord-icon
            src="https://cdn.lordicon.com/bpmglzll.json"
            trigger="loop"
            delay="3700"
            colors="primary:#874f79"
            style="width:50px;height:50px">
        </lord-icon>
    `,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
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
        resetMarkerIcons();
        const lordIcon = marker.getElement().querySelector("lord-icon");
        lordIcon.setAttribute("colors", "primary:#c799c1");
        lordIcon.setAttribute("delay", "0");
    });
    return marker;
}

/**
 * Resets the marker icons to their default state
 */
function resetMarkerIcons() {
    document.querySelectorAll(".marker-icon").forEach((icon) => {
        const lordIcon = icon.querySelector("lord-icon");
        lordIcon.setAttribute("colors", "primary:#874f79");
        lordIcon.setAttribute("delay", "3700");
        lordIcon.playerInstance.playFromBeginning();
    });
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
        "modal-image": "./public/images/" + lugar["Nombre"] + ".jpg",
        "modal-description": lugar["Descripción"],
        "modal-location": lugar["Dirección"],
        "modal-link": lugar["Sitio Web"],
    };

    Object.entries(modalElements).forEach(([elementId, value]) => {
        const element = modalContent.querySelector(`#${elementId}`);
        if (elementId === "modal-image") {
            const img = new Image();
            img.onload = () => {
                element.src = value;
            };
            img.onerror = () => {
                element.src = "./public/images/default.jpg";
            };
            img.src = value;
        } else if (elementId === "modal-link") {
            element.href = value;
            switch (true) {
                case value.includes("facebook"):
                    element.querySelector("span").textContent = "Facebook";
                    break;
                case value.includes("instagram"):
                    element.querySelector("span").textContent = "Instagram";
                    break;
                case value.includes("tiktok"):
                    element.querySelector("span").textContent = "TikTok";
                    break;
                default:
                    element.querySelector("span").textContent = "Sitio Web";
                    break;
            }
        } else {
            element.textContent = value;
        }
    });

    document.getElementById("modal").classList.add("active");
}