const ICONS = {
    Taller: {
        src: "https://cdn.lordicon.com/nwfpiryp.json",
        colors: "primary:#e4e4e4,secondary:#f9c9c0,tertiary:#ffc738,quaternary:#3a3347",
        state: "hover-line",
        anchor: [0, 40],
    },
    "Ñam Ñam": {
        src: "https://cdn.lordicon.com/tqvrfslk.json",
        colors: "primary:#ffc738;secondary:#f24c00",
        anchor: [20, 20],
    },
    "Resort/Playa": {
        src: "https://cdn.lordicon.com/yffasoye.json",
        colors: "primary:#2ca58d;secondary:#b26836;tertiary:#ffc738;quaternary:#4bb3fd",
        anchor: [20, 40],
    },
    Museo: {
        src: "https://cdn.lordicon.com/ilrifayj.json",
        colors: "primary:#646e78,secondary:#b4b4b4",
        anchor: [20, 20],
    },
    Cultura: {
        src: "https://cdn.lordicon.com/vxrlfgfi.json",
        colors: "primary:#ffc738,secondary:#f24c00,tertiary:#2ca58d,quaternary:#b26836,quinary:#e4e4e4",
        anchor: [20, 40],
    },
    "Juegos/Deporte": {
        src: "https://cdn.lordicon.com/qhsjyool.json",
        colors: "primary:#78d0bf,secondary:#aba08c,tertiary:#ffd700",
        anchor: [20, 20],
    },
    "Hotel": {
        src: "https://cdn.lordicon.com/dznelzdk.json",
        colors: "primary:#78d0bf,secondary:#aba08c,tertiary:#ffd700",
        anchor: [20, 20],
    },
    "Parranda": {
        src: "https://cdn.lordicon.com/iujnhzgo.json",
        colors: "primary:#78d0bf,secondary:#aba08c,tertiary:#ffd700",
        anchor: [20, 20],
    },
    Default: {
        src: "https://cdn.lordicon.com/bpmglzll.json",
        colors: "primary:#874f79",
        anchor: [20, 40],
    },
};

function getMarkerIcon(tipo) {
    const icon = ICONS[tipo] || ICONS["Default"];
    return L.divIcon({
        className: "marker-icon",
        html: `<lord-icon src="${icon.src}" trigger="loop" delay="10000" state="${icon.state}" colors="${icon.colors}" style="width:40px;height:40px"></lord-icon>`,
        iconSize: [40, 40],
        iconAnchor: icon.anchor,
    });
}

function setPhotoEffect() {
    const flash = document.getElementById("flashOverlay");
    const sound = document.getElementById("cameraSound");
    sound.currentTime = 0;
    sound.play();
    flash.classList.add("flash-effect");
    flash.addEventListener(
        "animationend",
        () => flash.classList.remove("flash-effect"),
        { once: true }
    );
}

export function addMarker(map, place) {
    const [lat, lng] = place["coords"].split(",").map(Number);
    const marker = L.marker([lat, lng], {
        icon: getMarkerIcon(place["tipo"]),
        title: place["nombre"],
    }).addTo(map);

    marker.on("click", () => {
        setPhotoEffect();
        const card = document.querySelector(`#card-${place["id"]}`);
        card?.classList.add("show");
        card?.focus();
    });
    return marker;
}
