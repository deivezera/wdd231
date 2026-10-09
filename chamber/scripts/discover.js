import { places } from "../data/places.mjs";

const grid = document.querySelector("#interest-grid");
const modal = document.querySelector("#place-modal");
const modalTitle = document.querySelector("#place-modal-title");
const modalAddress = document.querySelector("#place-modal-address");
const modalDetails = document.querySelector("#place-modal-details");
const modalClose = document.querySelector("#place-modal-close");
const notice = document.querySelector("#visit-notice");
const noticeMessage = document.querySelector("#visit-message");
const noticeClose = document.querySelector("#visit-close");

const VISIT_KEY = "chamber-last-visit";
const DISMISS_KEY = "chamber-visit-dismissed";
const DAY_MS = 24 * 60 * 60 * 1000;

function buildCard(place, index) {
    return `
        <article class="interest-card area-${index + 1}">
            <h2>${place.name}</h2>
            <figure>
                <img src="images/${place.image}" alt="${place.name}" width="300" height="200" loading="lazy">
            </figure>
            <address>${place.address}</address>
            <p class="card-text">${place.description}</p>
            <button type="button" class="card-link" data-index="${index}">Learn more &rarr;</button>
        </article>
    `;
}

function renderCards() {
    grid.innerHTML = places.map(buildCard).join("");
}

function openModal(index) {
    const place = places[index];
    if (!place) {
        return;
    }
    modalTitle.textContent = place.name;
    modalAddress.textContent = place.address;
    modalDetails.textContent = place.details;
    modal.showModal();
}

function showVisitMessage() {
    const stored = localStorage.getItem(VISIT_KEY);
    let message;

    if (!stored) {
        message = "Welcome! Let us know if you have any questions.";
    } else {
        const days = Math.floor((Date.now() - Number(stored)) / DAY_MS);
        if (days < 1) {
            message = "Back so soon! Awesome!";
        } else if (days === 1) {
            message = "You last visited 1 day ago.";
        } else {
            message = `You last visited ${days} days ago.`;
        }
    }

    localStorage.setItem(VISIT_KEY, String(Date.now()));
    noticeMessage.textContent = message;

    if (!sessionStorage.getItem(DISMISS_KEY)) {
        notice.hidden = false;
    }
}

grid.addEventListener("click", (event) => {
    const button = event.target.closest(".card-link");
    if (button) {
        openModal(Number(button.dataset.index));
    }
});

modalClose.addEventListener("click", () => modal.close());

modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.close();
    }
});

noticeClose.addEventListener("click", () => {
    notice.hidden = true;
    sessionStorage.setItem(DISMISS_KEY, "true");
});

renderCards();
showVisitMessage();
