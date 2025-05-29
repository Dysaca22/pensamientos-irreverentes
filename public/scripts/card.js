import { convertirATextoSeguro, parseGoogleSheetDate } from "./utils.js";

const HTML_ELEMENTS = {
    card_template: document.querySelector("#card-template"),
    cards: document.querySelector("#cards"),
};

async function shareCard(id) {
    const urlParams = new URLSearchParams(window.location.search);
    const ciudadParam = urlParams.get("ciudadId");

    if (navigator.share) {
        const shareData = {
            title: "¡Un pensamiento irreverente!",
            text: `¡Encuentra este lugar!`,
            url: `?ciudadId=${ciudadParam}?lugarId=${id}`,
        };
        try {
            await navigator.share(shareData);
        } catch (error) {
            console.error("Error al compartir:", error);
        }
    }
}

export function createCard(place) {
    const card = HTML_ELEMENTS.card_template.content.cloneNode(true);
    card.firstElementChild.id = `card-${place.id}`;

    card.querySelector("[card-image]").src = `public/images/${
        place.nombre_imagen
            ? "places/" + place.nombre_imagen
            : place.tipo
            ? "categories/" + convertirATextoSeguro(place.tipo)
            : "default"
    }.jpg`;
    card.querySelector("[card-category]").textContent = place.tipo;
    card.querySelector("[card-title]").textContent = place.nombre;
    card.querySelector("[card-description]").textContent = place.descripcion;
    card.querySelector("[card-address]").textContent = place.direccion;
    card.querySelector("[card-share]").addEventListener("click", () => {
        shareCard(place.id);
    });
    const cardLink = card.querySelector("[card-link]");
    cardLink.href = place.sitio_web;
    cardLink.querySelector("span").textContent = place.sitio_web.includes(
        "instagram"
    )
        ? "Instagram"
        : place.sitio_web.includes("facebook")
        ? "Facebook"
        : place.sitio_web.includes("tiktok")
        ? "TikTok"
        : place.sitio_web.includes("youtube")
        ? "YouTube"
        : "Sitio Web";

    if (place.fecha_inicio) {
        card.querySelector("[card-date]").classList.remove("hidden");
        const startDate = parseGoogleSheetDate(place.fecha_inicio);
        const cardStartDate = card.querySelector("[card-date-start]");
        cardStartDate.textContent = startDate.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
        cardStartDate.value = startDate;
        const endDate = parseGoogleSheetDate(place.fecha_fin);
        const cardEndDate = card.querySelector("[card-date-end]");
        cardEndDate.textContent = endDate.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
        cardEndDate.value = startDate;
    }

    HTML_ELEMENTS.cards.appendChild(card);
}
