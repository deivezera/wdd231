const themeToggle = document.querySelector("#theme-toggle");
const root = document.documentElement;

themeToggle.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    root.setAttribute("data-theme", isDark ? "light" : "dark");
    localStorage.setItem("curitiba-theme", isDark ? "light" : "dark");
    themeToggle.setAttribute("aria-pressed", String(!isDark));
});