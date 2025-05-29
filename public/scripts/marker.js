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

function setPhotoEffect() {
    const flash = document.getElementById("flashOverlay");
    const sound = document.getElementById("cameraSound");

    sound.currentTime = 0;
    sound.play();
    flash.classList.add("flash-effect");
    flash.addEventListener(
        "animationend",
        () => {
            flash.classList.remove("flash-effect");
        },
        { once: true }
    );
}

export function addMarker(map, place) {
    const [lat, lng] = place["coords"].split(",").map(Number);

    const marker = L.marker([lat, lng], {
        icon: MARKER_ICON,
        title: place["nombre"],
    }).addTo(map);

    marker.on("click", () => {
        const id = place['id'];
        setPhotoEffect();

        const card = document.querySelector(`#card-${id}`);
        card?.classList.add("show");
        card?.focus();
    });
    return marker;
}
