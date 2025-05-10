import { initMap, addMarkersMap, setViewWithAnimation } from "./map.js";
import { ciudades, getLocations } from "./data.js";

const elements = {
    mapStyle: document.querySelector("#mapStyleSelector"),
    citySelector: document.querySelector("#mapCitySelector"),
    map: document.querySelector("#map"),
    loader: document.querySelector(".custom-loader"),
};

const initializeCityOptions = (cities) => {
    const fragment = document.createDocumentFragment();
    cities.forEach(({ coords, name, country }) => {
        const option = document.createElement("option");
        option.value = coords;
        option.textContent = `${name}, ${country}`;
        fragment.appendChild(option);
    });
    elements.citySelector.appendChild(fragment);
};

const handleMapStyleChange = (event, tileLayer) => {
    if (!event?.target?.value || !tileLayer) return;
    tileLayer.setUrl(event.target.value);
};

const handleCityChange = async (event, map, cities) => {
    if (!event?.target?.value || !map || !Array.isArray(cities)) return;

    try {
        elements.loader.classList.remove("hidden");
        elements.map.classList.add("hidden");

        const coordinates = event.target.value.split(",");
        if (coordinates.length !== 2)
            throw new Error("Invalid coordinates format");

        const [latitude, longitude] = coordinates.map((coord) => {
            const num = Number(coord);
            if (isNaN(num)) throw new Error("Invalid coordinate value");
            return num;
        });

        const selectedCity = cities.find(
            (city) =>
                city.coords[0] === latitude && city.coords[1] === longitude
        );

        if (!selectedCity) {
            throw new Error("City not found");
        }

        const locations = await getLocations(
            selectedCity.country,
            selectedCity.name
        );

        if (!Array.isArray(locations)) {
            throw new Error("Invalid locations data");
        }

        elements.loader.classList.add("hidden");
        elements.map.classList.remove("hidden");
        setViewWithAnimation(map, [latitude, longitude], 13);
        addMarkersMap(map, locations);
    } catch (error) {
        console.error("Error handling city change:", error);
        elements.loader.classList.add("hidden");
        elements.map.classList.remove("hidden");
    }
};

const init = async () => {
    if (!Array.isArray(ciudades) || ciudades.length === 0) {
        throw new Error("Cities data is invalid or empty");
    }

    try {
        initializeCityOptions(ciudades);
        const defaultCity = ciudades[0];

        const initialLocations = await getLocations(
            defaultCity.country,
            defaultCity.name
        );

        if (!Array.isArray(initialLocations)) {
            throw new Error("Invalid initial locations data");
        }

        elements.loader.classList.add("hidden");
        elements.map.classList.remove("hidden");

        const { map, tileLayer } = initMap(defaultCity, initialLocations);

        if (!map || !tileLayer) {
            throw new Error("Map initialization failed");
        }

        elements.mapStyle.addEventListener("change", (event) =>
            handleMapStyleChange(event, tileLayer)
        );

        elements.citySelector.addEventListener("change", (event) =>
            handleCityChange(event, map, ciudades)
        );
    } catch (error) {
        console.error("Error initializing map:", error);
        elements.loader.classList.add("hidden");
    }
};

(async () => {
    try {
        await init();
    } catch (error) {
        console.error("Failed to initialize application:", error);
        elements.loader.classList.add("hidden");
    }
})();
