export function convertirATextoSeguro(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s.-]/g, "")
        .replace(/\s+/g, "_")
        .toLowerCase();
}

export function createOption(
    value,
    text,
    selected = false,
    disabled = false,
    hidden = false
) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = text;
    option.selected = selected;
    option.disabled = disabled;
    option.hidden = hidden;
    return option;
}

export function parseGoogleSheetDate(dateStr) {
    if (typeof dateStr === "string" && dateStr.startsWith("Date(")) {
        const parts = dateStr.match(/\d+/g);
        if (parts && parts.length >= 3) {
            return new Date(parts[0], parts[1], parts[2]);
        }
    }
    return new Date(dateStr);
}
