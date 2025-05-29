import { getCities, getLastPlacesAdded } from "./data.js";
import { createParticles } from "./particles.js";
import { createCarousel } from "./carousel.js";
import { createOption } from "./utils.js";

const HTML_ELEMENTS = {
    canvas_particles: document.querySelector("#particles"),
    cities_select: document.querySelector("#cities-select"),
    card_template: document.querySelector("#card-template"),
    swiper_wrapper: document.querySelector("#swiper-wrapper"),
    swiper_carousel: document.querySelector("#swiper-container"),
};

function loopParticles() {
    setTimeout(() => {
        createParticles(HTML_ELEMENTS.canvas_particles);
        loopParticles();
    }, Math.random() * 3000);
}

function createSelectCitiesOptions(cities) {
    const defaultOption = createOption(
        "",
        "Busquemos en tu ciudad...",
        true,
        true,
        true
    );
    HTML_ELEMENTS.cities_select.appendChild(defaultOption);
    cities.forEach((city) => {
        const option = createOption(city.id, city.nombre);
        HTML_ELEMENTS.cities_select.appendChild(option);
    });
}

async function _init() {
    loopParticles();

    const cities = await getCities();
    cities.sort((a, b) => a.nombre.localeCompare(b.nombre));
    createSelectCitiesOptions(cities);

    const lastPlaces = await getLastPlacesAdded();
    createCarousel(
        HTML_ELEMENTS.swiper_carousel,
        HTML_ELEMENTS.swiper_wrapper,
        HTML_ELEMENTS.card_template,
        lastPlaces
    );
}

await _init();
