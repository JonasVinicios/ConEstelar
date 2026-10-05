const constellations = {
    pegasus: {
        name: "Pegasus",
        query: ["pegasus", "pégaso", "pegaso"],
        description:
            "O cavalo alado da mitologia grega galopa pelo céu de outono, formando um dos quadriláteros mais reconhecíveis da noite.",
        stats: [
            { value: "17", label: "Estrelas principais" },
            { value: "Enif", label: "Estrela mais brilhante" },
            { value: "Não", label: "Constelação zodiacal" },
            { value: "Norte", label: "Visível principalmente no" },
            { value: "Outono", label: "Melhor época para observar" }
        ],
        stars: [
            [70, 150],
            [118, 92],
            [168, 68],
            [228, 92],
            [250, 148],
            [278, 168],
            [176, 176],
            [128, 168]
        ],
        lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 5],
            [4, 6],
            [6, 7],
            [7, 0],
            [1, 7],
            [2, 6]
        ]
    },
    orion: {
        name: "Órion",
        query: ["orion", "órion", "orión"],
        description:
            "O caçador do céu de inverno, marcado pelo cinturão de três estrelas alinhadas — um dos desenhos mais fáceis de reconhecer.",
        stats: [
            { value: "7", label: "Estrelas principais" },
            { value: "Rigel", label: "Estrela mais brilhante" },
            { value: "Não", label: "Constelação zodiacal" },
            { value: "Equador", label: "Visível principalmente no" },
            { value: "Inverno", label: "Melhor época para observar" }
        ],
        stars: [
            [150, 70],
            [210, 90],
            [130, 150],
            [160, 158],
            [190, 166],
            [120, 230],
            [210, 240]
        ],
        lines: [
            [0, 1],
            [0, 2],
            [1, 4],
            [2, 3],
            [3, 4],
            [2, 5],
            [4, 6]
        ]
    }
};

const homeView = document.querySelector('[data-view="home"]');
const resultView = document.querySelector('[data-view="result"]');
const form = document.querySelector("#search-form");
const input = document.querySelector("#search-input");
const nameEl = document.querySelector("#constellation-name");
const descEl = document.querySelector("#constellation-desc");
const statsEl = document.querySelector("#constellation-stats");
const mapEl = document.querySelector("#map-drawing");
const mapLabel = document.querySelector("#map-label");

function normalize(text) {
    return text
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function findConstellation(term) {
    const q = normalize(term);
    return Object.values(constellations).find((item) =>
        item.query.some((alias) => normalize(alias) === q || normalize(alias).includes(q))
    );
}

function drawMap(data) {
    const lines = data.lines
        .map(([a, b]) => {
            const [x1, y1] = data.stars[a];
            const [x2, y2] = data.stars[b];
            return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
        })
        .join("");

    const dots = data.stars
        .map(
            ([x, y], i) =>
                `<circle cx="${x}" cy="${y}" r="${i === 2 || i === 5 ? 4.2 : 3.1}" />`
        )
        .join("");

    mapEl.innerHTML = `
        <g stroke="rgba(232,224,210,0.45)" stroke-width="1" stroke-dasharray="2 3" fill="none">
            ${lines}
        </g>
        <g fill="#f4eee4">
            ${dots}
        </g>
        <g fill="rgba(244,238,228,0.55)">
            <circle cx="92" cy="248" r="1.4"/>
            <circle cx="102" cy="254" r="1.1"/>
            <circle cx="84" cy="256" r="1"/>
            <circle cx="96" cy="260" r="0.9"/>
        </g>
    `;
}

function showHome() {
    homeView.hidden = false;
    resultView.hidden = true;
    document.body.classList.remove("is-result");
    input.value = "";
    input.placeholder = "Pesquisar constelação";
}

function showConstellation(data) {
    homeView.hidden = true;
    resultView.hidden = false;
    document.body.classList.add("is-result");
    nameEl.textContent = data.name;
    descEl.textContent = data.description;
    mapLabel.textContent = data.name;
    input.value = data.name;
    statsEl.innerHTML = data.stats
        .map(
            (item) => `<div>
                <dt>${item.value}</dt>
                <dd>${item.label}</dd>
            </div>`
        )
        .join("");
    drawMap(data);
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const found = findConstellation(input.value);
    if (found) {
        showConstellation(found);
        return;
    }
    input.placeholder = "Tente Pegasus ou Órion";
    input.value = "";
});

document.querySelector("[data-explore]").addEventListener("click", () => {
    showConstellation(constellations.pegasus);
});

document.querySelectorAll("[data-go-home]").forEach((el) => {
    el.addEventListener("click", (event) => {
        event.preventDefault();
        showHome();
    });
});
