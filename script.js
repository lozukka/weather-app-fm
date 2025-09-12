let openDropdown = document.getElementById("open-units-dropdown");
let dropdown = document.getElementById("dropdown");
let searchBtn = document.getElementById("search-btn");

openDropdown.addEventListener("click", () => {
  if (dropdown.style.display === "block") {
    dropdown.style.display = "none";
  } else {
    dropdown.style.display = "block";
  }
});

searchBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  let city = document.getElementById("city").value;

  try {
    // Vaihe 1: hae koordinaatit
    const { latitude, longitude, name, country } = await getCoordinates(city);

    // Vaihe 2: hae sää
    const data = await getWeather(latitude, longitude);

    // Vaihe 3: näytä päivämäärä
    renderDate();

    // Tyhjennä syötekenttä
    document.getElementById("city").value = "";

    //Vaihe 4: renderöi sää
    renderWeather(data);
  } catch (err) {
    console.error("Virhe haussa:", err);
  }
});

// --- Funktio koordinaattien hakuun ---
async function getCoordinates(city) {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    city
  )}&count=1&language=fi&format=json`;

  const response = await fetch(geoUrl);
  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("Kaupunkia ei löytynyt!");
  }

  const { latitude, longitude, name, country } = data.results[0];

  let resultCityDisplay = document.getElementById("search-result-city");
  resultCityDisplay.textContent = `${name}, ${country}`;

  return { latitude, longitude, name, country };
}

// --- Funktio sään hakuun ---
async function getWeather(latitude, longitude) {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,apparent_temperature,relativehumidity_2m,windspeed_10m,precipitation,weather_code&timezone=auto`;

  const response = await fetch(weatherUrl);
  return response.json();
}
// --- Funktio sään renderöintiin ---
function renderWeather(data) {
  const now = new Date();
  const times = data.hourly.time;
  const startIndex = times.findIndex((t) => new Date(t) >= now);

  let resultTemperature = document.getElementById("search-result-temperature");
  resultTemperature.textContent = `${Math.trunc(
    data.hourly.temperature_2m[startIndex]
  )}°`;
  let resultFeelsLike = document.getElementById("feels-like-p");
  resultFeelsLike.textContent = `${Math.trunc(
    data.hourly.apparent_temperature[startIndex]
  )}°`;
  let resultHumidity = document.getElementById("humidity-p");
  resultHumidity.textContent = `${Math.trunc(
    data.hourly.relativehumidity_2m[startIndex]
  )}%`;
  let resultWind = document.getElementById("wind-p");
  resultWind.textContent = `${Math.trunc(
    data.hourly.windspeed_10m[startIndex]
  )}km/h`;
  let resultPrecipitation = document.getElementById("precipitation-p");
  resultPrecipitation.textContent = `${Math.trunc(
    data.hourly.precipitation[startIndex]
  )}mm`;
  let resultIcon = document.getElementById("search-forecast");
  let icon = document.createElement("img");
  icon.src = renderWeatherIcon(data.hourly.weather_code[startIndex]);
  icon.alt = "Weather icon";
  resultIcon.prepend(icon);

  console.log(data);
  console.log(
    resultTemperature.textContent,
    resultFeelsLike.textContent,
    resultHumidity.textContent,
    resultWind.textContent,
    resultPrecipitation.textContent,
    data.hourly.weather_code[startIndex]
  );
}
// --- Funktio päivämäärän renderöintiin ---
function renderDate() {
  let searchDate = new Date();
  let options = {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  let formatted = searchDate.toLocaleDateString("en-US", options);
  let resultDateDisplay = document.getElementById("search-result-date");
  resultDateDisplay.textContent = formatted;
}
// --- Funktio sääikonin renderöintiin ---
function renderWeatherIcon(code) {
  const icons = {
    0: "../assets/images/icon-sunny.webp",
    1: "../assets/images/icon-partly-cloudy.webp",
    2: "../assets/images/icon-partly-cloudy.webp",
    3: "../assets/images/icon-overcast.webp",
    45: "../assets/images/icon-fog.webp",
    48: "../assets/images/icon-fog.webp",
    51: "../assets/images/icon-drizzle.webp",
    53: "../assets/images/icon-drizzle.webp",
    55: "../assets/images/icon-drizzle.webp",
    56: "../assets/images/icon-drizzle.webp",
    57: "../assets/images/icon-drizzle.webp",
    61: "../assets/images/icon-rain.webp",
    63: "../assets/images/icon-rain.webp",
    65: "../assets/images/icon-rain.webp",
    66: "../assets/images/icon-rain.webp",
    67: "../assets/images/icon-rain.webp",
    71: "../assets/images/icon-snow.webp",
    73: "../assets/images/icon-snow.webp",
    75: "../assets/images/icon-snow.webp",
    77: "../assets/images/icon-snow.webp",
    80: "../assets/images/icon-rain.webp",
    81: "../assets/images/icon-rain.webp",
    82: "../assets/images/icon-rain.webp",
    85: "../assets/images/icon-rain.webp",
    86: "../assets/images/icon-rain.webp",
    95: "../assets/images/icon-storm.webp",
    96: "../assets/images/icon-storm.webp",
    99: "../assets/images/icon-storm.webp",
  };

  return icons[code] || "../assets/images/icon-sunny.webp";
}
