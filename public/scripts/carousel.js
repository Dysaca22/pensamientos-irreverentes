import { convertirATextoSeguro } from "./utils.js";

function createCard(card_template, place = {}) {
    if (!place) return;

    const card = card_template.content.cloneNode(true);
    const cardElements = {
        cardTitle: card.querySelector("[card-title]"),
        cardCategory: card.querySelector("[card-category]"),
        cardImage: card.querySelector("[card-image]"),
        cardLink: card.querySelector("[card-link]"),
    };

    cardElements.cardTitle.textContent = place.nombre;
    cardElements.cardCategory.textContent = place.tipo;
    cardElements.cardImage.src = `public/images/${
        place.nombre_imagen
            ? "places/" + place.nombre_imagen
            : place.tipo
            ? "categories/" + convertirATextoSeguro(place.tipo)
            : "default"
    }.jpg`;
    cardElements.cardLink.href = `busqueda?ciudadId=${place.id_ciudad}&lugarId=${place.id}`;

    return card;
}

export function createCarousel(swiper_carousel, swiper_wrapper, card_template, places = []) {
    places.forEach((place) => {
        const card = createCard(card_template, place);
        swiper_wrapper.appendChild(card);
    });

    new Swiper(swiper_carousel, {
        direction: "horizontal",
        slidesPerView: "auto",
        centeredSlides: true,
        spaceBetween: 80,
        loop: true,
        navigation: {
            nextEl: ".carousel-right-btn",
            prevEl: ".carousel-left-btn",
        },
    });
}
