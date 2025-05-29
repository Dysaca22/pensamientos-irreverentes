import { getCities, getPlacesByCity } from "./data.js";
import { createOption } from "./utils.js";
import { addMarker } from "./marker.js";
import { createCard } from "./card.js";
import { initMap } from "./map.js";

const HTML_ELEMENTS = {
    cities_select: document.querySelector("#cities-select"),
    map_style_select: document.querySelector("#map-style-select"),
    special_select: document.querySelector("#special-select"),
};

const DEFAULT_DATA = {
    style_map: localStorage.getItem("style_map") || "",
};

const MARKERS = [];

function createSelectCitiesOptions(cities, selectedCityId) {
    const defaultOption = createOption(
        "",
        "Busquemos en tu ciudad...",
        true,
        true,
        true
    );
    HTML_ELEMENTS.cities_select.appendChild(defaultOption);
    cities.forEach((city) => {
        const option = createOption(
            city.id,
            city.nombre,
            city.id == selectedCityId
        );
        HTML_ELEMENTS.cities_select.appendChild(option);
    });
}

function specialSelectFilter(places, special) {
    HTML_ELEMENTS.special_select.value = special;

    switch (special) {
        case "ST":
            return places.filter((place) =>
                place["especial"].includes("Turista")
            );
        case "EG":
            return places.filter((place) =>
                place["especial"].includes("Comida")
            );
        case "EJ":
            return places.filter((place) =>
                place["especial"].includes("Espantajopo")
            );
        case "TL":
            return places.filter((place) =>
                place["especial"].includes("Evento")
            );
        case "HP":
            return places;
        case "":
            return places.filter((place) => place["especial"] === "");
    }
    return places;
}

async function _init() {
    const cities = await getCities();
    cities.sort((a, b) => a.nombre.localeCompare(b.nombre));

    const urlParams = new URLSearchParams(window.location.search);
    const ciudadParam = urlParams.get("ciudadId");

    if (!cities.some((city) => city.id == ciudadParam)) {
        const firstCityId = cities[0].id;
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set("ciudadId", firstCityId);
        window.location.href = newUrl.toString();
    }

    createSelectCitiesOptions(cities, ciudadParam);

    const city = cities.find((city) => city.id == ciudadParam);
    let places = await getPlacesByCity(city.id);
    places = specialSelectFilter(places, urlParams.get("special") || "");
    const { map, tileLayer } = initMap(city, places);

    HTML_ELEMENTS.map_style_select.addEventListener("change", (event) => {
        if (!event?.target?.value || !tileLayer) return;
        tileLayer.setUrl(event.target.value);
        localStorage.setItem("style_map", event.target.value);
    });

    if (DEFAULT_DATA.style_map) {
        HTML_ELEMENTS.map_style_select.value = DEFAULT_DATA.style_map;
        tileLayer.setUrl(DEFAULT_DATA.style_map);
    }

    places.forEach((place) => {
        const marker = addMarker(map, place);
        if (marker) {
            MARKERS.push(marker);
        }
        createCard(place);
    });

    const card = urlParams.get("lugarId");
    if (card) {
        const cardElement = document.querySelector(`#card-${card}`);
        if (cardElement) {
            cardElement?.classList.add("show");
            cardElement?.focus();
        }
    }
}

await _init();
