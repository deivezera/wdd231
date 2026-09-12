const root = document.documentElement;
const themeToggle = document.querySelector("#theme-toggle");
const savedTheme = localStorage.getItem("curitiba-theme");

if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    root.setAttribute("data-theme", "dark");
}

themeToggle.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    root.setAttribute("data-theme", isDark ? "light" : "dark");
    localStorage.setItem("curitiba-theme", isDark ? "light" : "dark");
    themeToggle.setAttribute("aria-pressed", String(!isDark));
});