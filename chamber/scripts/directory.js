const directory = document.querySelector("#directory");
const memberCount = document.querySelector("#member-count");
const gridBtn = document.querySelector("#grid-view");
const listBtn = document.querySelector("#list-view");
const IMG_PATH = "images/";

const levelClass = { 1: "member", 2: "silver", 3: "gold" };
const levelLabel = { 1: "Member", 2: "Silver", 3: "Gold Member" };

let members = [];
let view = "grid";

async function getMembers() {
    const response = await fetch("data/members.json");
    if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
    }
    return response.json();
}

function buildCard(member) {
    const phoneDigits = member.phone.replace(/\D/g, "");
    const membershipClass = levelClass[member.membership] || "member";

    return `
        <article class="card">
            <h3>${member.name}</h3>
            <p class="tagline">${member.tagline}</p>
            <span class="membership ${membershipClass}">${levelLabel[member.membership] || "Member"}</span>
            <hr>
            <div class="card-body">
                <img src="${IMG_PATH}${member.image}" alt="${member.name} logo" loading="lazy">
                <ul class="contact">
                    <li><span class="label">EMAIL:</span> <a href="mailto:${member.email}">${member.email}</a></li>
                    <li><span class="label">PHONE:</span> <a href="tel:+${phoneDigits}">${member.phone}</a></li>
                    <li><span class="label">URL:</span> <a href="https://${member.url}" target="_blank" rel="noopener">${member.url}</a></li>
                </ul>
            </div>
        </article>
    `;
}

function buildTableRows() {
    return members.map((member) => {
        const phoneDigits = member.phone.replace(/\D/g, "");
        const membershipClass = levelClass[member.membership] || "member";
        return `
            <tr>
                <td data-label="Business">
                    <strong>${member.name}</strong>
                    <span class="tagline">${member.tagline}</span>
                </td>
                <td data-label="Category">${member.category}</td>
                <td data-label="Membership"><span class="membership ${membershipClass}">${levelLabel[member.membership] || "Member"}</span></td>
                <td data-label="Phone"><a href="tel:+${phoneDigits}">${member.phone}</a></td>
                <td data-label="Website"><a href="https://${member.url}" target="_blank" rel="noopener">${member.url}</a></td>
            </tr>
        `;
    }).join("");
}

function buildTable() {
    return `
        <table class="member-table">
            <thead>
                <tr>
                    <th scope="col">Business</th>
                    <th scope="col">Category</th>
                    <th scope="col">Membership</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Website</th>
                </tr>
            </thead>
            <tbody>
                ${buildTableRows()}
            </tbody>
        </table>
    `;
}

function render() {
    if (view === "grid") {
        directory.className = "directory-grid";
        directory.innerHTML = members.map(buildCard).join("");
    } else {
        directory.className = "directory-list";
        directory.innerHTML = buildTable();
    }
    const count = members.length;
    memberCount.textContent =
        count === 1
            ? `1 local business supports the Curitiba Chamber of Commerce`
            : `${count} local businesses support the Curitiba Chamber of Commerce`;
}

function setView(next) {
    view = next;
    const isGrid = view === "grid";
    gridBtn.classList.toggle("active", isGrid);
    listBtn.classList.toggle("active", !isGrid);
    gridBtn.setAttribute("aria-pressed", String(isGrid));
    listBtn.setAttribute("aria-pressed", String(!isGrid));
    render();
}

gridBtn.addEventListener("click", () => setView("grid"));
listBtn.addEventListener("click", () => setView("list"));

getMembers()
    .then((data) => {
        members = data;
        render();
    })
    .catch((error) => {
        console.error("Members could not be loaded:", error);
        directory.className = "directory-grid";
        directory.innerHTML =
            `<p>We could not load the member directory. Please open this page through a web server (for example, GitHub Pages) so the data file can be read.</p>`;
        memberCount.textContent = "";
    });