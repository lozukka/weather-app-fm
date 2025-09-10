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
    await getWeather(latitude, longitude, name);

    // Vaihe 3: näytä päivämäärä
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

    // Tyhjennä syötekenttä
    document.getElementById("city").value = "";
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
async function getWeather(latitude, longitude, cityName) {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,apparent_temperature,relativehumidity_2m,windspeed_10m,precipitation&timezone=auto`;

  const response = await fetch(weatherUrl);
  const data = await response.json();

  const now = new Date();
  const times = data.hourly.time;
  const startIndex = times.findIndex((t) => new Date(t) >= now);

  let resultTemperature = document.getElementById("search-result-temperature");
  resultTemperature.textContent = `${Math.trunc(
    data.hourly.temperature_2m[startIndex]
  )}°`;

  console.log(data);

  console.log(
    `Lämpötila ${cityName}-kaupungissa: ${data.hourly.temperature_2m[startIndex]}°C`
  );
}
