export const createParticles = (c) => {
    const x = Math.random() * c.clientWidth,
        y = Math.random() * c.clientHeight;
    for (let i = 0; i < 4 + Math.random() * 3; i++) {
        const p = document.createElement("div");
        p.className = "particle";
        const a = Math.random() * 2 * Math.PI,
            d = 10 + Math.random() * 15;
        p.style.left = x + "px";
        p.style.top = y + "px";
        p.style.setProperty("--x", `${Math.cos(a) * d}px`);
        p.style.setProperty("--y", `${Math.sin(a) * d}px`);
        c.appendChild(p);
        setTimeout(() => p.remove(), 1200);
    }
};
