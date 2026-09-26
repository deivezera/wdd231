const spotlightGrid = document.querySelector("#spotlight-cards");
const IMG_PATH = "images/";

const levelClass = { 2: "silver", 3: "gold" };
const levelLabel = { 2: "Silver Member", 3: "Gold Member" };

function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function buildSpotlight(member) {
    const phoneDigits = member.phone.replace(/\D/g, "");
    return `
        <article class="spotlight-card">
            <img src="${IMG_PATH}${member.image}" alt="${member.name} logo" loading="lazy">
            <h3>${member.name}</h3>
            <p class="tagline">${member.tagline}</p>
            <span class="membership ${levelClass[member.membership]}">${levelLabel[member.membership]}</span>
            <ul class="spotlight-details">
                <li>${member.address}</li>
                <li><a href="tel:+${phoneDigits}">${member.phone}</a></li>
                <li><a href="https://${member.url}" target="_blank" rel="noopener">${member.url}</a></li>
            </ul>
        </article>
    `;
}

async function loadSpotlights() {
    const response = await fetch("data/members.json");
    if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
    }
    const members = await response.json();

    const eligible = members.filter((member) => member.membership >= 2);
    const picked = shuffle(eligible).slice(0, 3);

    spotlightGrid.innerHTML = picked.map(buildSpotlight).join("");
}

loadSpotlights().catch((error) => {
    console.error("Spotlights could not be loaded:", error);
    spotlightGrid.innerHTML =
        `<p class="weather-error">Member spotlights could not be loaded. Please open this page through a web server so the data file can be read.</p>`;
});