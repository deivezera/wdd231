const API_KEY = "ab91eb9eb66ba0ef17d3aaf50887fb7f";
const LAT = -25.4284;
const LON = -49.2733;
const UNITS = "metric";

const currentEl = document.querySelector("#weather-current");
const forecastEl = document.querySelector("#weather-forecast");

async function fetchJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
    }
    return response.json();
}

function buildDailyForecast(list) {
    const days = new Map();
    for (const item of list) {
        const date = new Date(item.dt * 1000);
        const key = date.toLocaleDateString();
        if (!days.has(key)) {
            days.set(key, {
                date,
                high: item.main.temp,
                description: item.weather[0].description,
                icon: item.weather[0].icon,
            });
        } else {
            const day = days.get(key);
            if (item.main.temp > day.high) {
                day.high = item.main.temp;
                day.description = item.weather[0].description;
                day.icon = item.weather[0].icon;
            }
        }
    }
    return Array.from(days.values()).slice(0, 3);
}

function labelDay(date) {
    const today = new Date();
    if (date.toLocaleDateString() === today.toLocaleDateString()) {
        return "Today";
    }
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (date.toLocaleDateString() === tomorrow.toLocaleDateString()) {
        return "Tomorrow";
    }
    return date.toLocaleDateString("en-US", { weekday: "long" });
}

function renderCurrent(data) {
    const temp = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    currentEl.innerHTML = `
        <p class="weather-location">Curitiba, Paraná</p>
        <img class="weather-icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="">
        <p class="weather-temp">${temp}&deg;C</p>
        <p class="weather-desc">${description}</p>
    `;
}

function renderForecast(days) {
    forecastEl.innerHTML = days.map((day) => `
        <div class="forecast-day">
            <p class="forecast-label">${labelDay(day.date)}</p>
            <img class="forecast-icon" src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="">
            <p class="forecast-high">${Math.round(day.high)}&deg;C</p>
            <p class="forecast-desc">${day.description}</p>
        </div>
    `).join("");
}

async function getWeather() {
    const currentUrl =
        `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=${UNITS}`;
    const forecastUrl =
        `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=${UNITS}`;

    const current = await fetchJSON(currentUrl);
    const forecast = await fetchJSON(forecastUrl);

    renderCurrent(current);
    renderForecast(buildDailyForecast(forecast.list));
}

getWeather().catch((error) => {
    console.error("Weather could not be loaded:", error);
    currentEl.innerHTML =
        `<p class="weather-error">Weather is unavailable right now. Add your free OpenWeatherMap API key in <code>scripts/weather.js</code> (set <code>API_KEY</code>) and reload.</p>`;
});