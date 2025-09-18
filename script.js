let openDropdown = document.getElementById("open-units-dropdown");
let dropdown = document.getElementById("dropdown");
let searchBtn = document.getElementById("search-btn");
let weatherIconDisplay = document.getElementById("weather-icon");
let hourlyCards = document.getElementById("hourly-cards");
let dailyCards = document.getElementById("daily-cards");
let errorMessage = document.getElementById("error-message");
let cityInput = document.getElementById("city");

openDropdown.addEventListener("click", () => {
  if (dropdown.style.display === "block") {
    dropdown.style.display = "none";
  } else {
    dropdown.style.display = "block";
  }
});
 
searchBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  let city = cityInput.value;

    // Empty searched city
    cityInput.value = "";
    // Empty weather icon
    weatherIconDisplay.innerHTML ="";
    // Empty hourly forecast
    hourlyCards.innerHTML="";
    // Empty daily forecast
    dailyCards.innerHTML="";
    // Empty error message
    errorMessage.textContent = "";

  try {
    // Step 1: get coordinates
    const { latitude, longitude, name, country } = await getCoordinates(city);

    // Step 2: get weather
    const data = await getWeather(latitude, longitude);
    console.log(data);
    // Step 2.5: get daily weather
    const dailyData = await getDailyWeather (latitude, longitude);
    console.log(dailyData);

    // Step 3: Render date
    renderDate();

    // Step 4: render weather
    renderWeather(data);

    //Step 5: render hourly weather forecast
    renderHourlyWeather(data);
    //Step 6: render daily weather forecast
    renderDailyWeather(dailyData);
  } catch (err) {
    console.error("Virhe haussa:", err);
    errorMessage.textContent = err.message;
  }
});

// --- Function for getting the coordinates ---
async function getCoordinates(city) {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    city
  )}&count=1&language=en&format=json`;

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

// --- Function for getting the weathers ---
async function getWeather(latitude, longitude) {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,apparent_temperature,relativehumidity_2m,windspeed_10m,precipitation,weather_code&timezone=auto`;

  const response = await fetch(weatherUrl);
  return response.json();
}

async function getDailyWeather(latitude, longitude) {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

  const response = await fetch(weatherUrl);
  return response.json();
}
// --- Function for rendering the weather ---
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
    data.hourly.windspeed_10m[startIndex] * 0.277778
  )}m/s`;
  let resultPrecipitation = document.getElementById("precipitation-p");
  resultPrecipitation.textContent = `${Math.trunc(
    data.hourly.precipitation[startIndex]
  )}mm`;
  let icon = document.createElement("img");
  icon.src = renderWeatherIcon(data.hourly.weather_code[startIndex]);
  icon.alt = "Weather icon";
  weatherIconDisplay.appendChild(icon);

  console.log(
    resultTemperature.textContent,
    resultFeelsLike.textContent,
    resultHumidity.textContent,
    resultWind.textContent,
    resultPrecipitation.textContent,
    data.hourly.weather_code[startIndex]
  );
}
// --- Function for rendering the date ---
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
// --- Function for rendering the weather icon ---
function renderWeatherIcon(code) {
  const icons = {
    0: "./assets/images/icon-sunny.webp",
    1: "./assets/images/icon-partly-cloudy.webp",
    2: "./assets/images/icon-partly-cloudy.webp",
    3: "./assets/images/icon-overcast.webp",
    45: "./assets/images/icon-fog.webp",
    48: "./assets/images/icon-fog.webp",
    51: "./assets/images/icon-drizzle.webp",
    53: "./assets/images/icon-drizzle.webp",
    55: "./assets/images/icon-drizzle.webp",
    56: "./assets/images/icon-drizzle.webp",
    57: "./assets/images/icon-drizzle.webp",
    61: "./assets/images/icon-rain.webp",
    63: "./assets/images/icon-rain.webp",
    65: "./assets/images/icon-rain.webp",
    66: "./assets/images/icon-rain.webp",
    67: "./assets/images/icon-rain.webp",
    71: "./assets/images/icon-snow.webp",
    73: "./assets/images/icon-snow.webp",
    75: "./assets/images/icon-snow.webp",
    77: "./assets/images/icon-snow.webp",
    80: "./assets/images/icon-rain.webp",
    81: "./assets/images/icon-rain.webp",
    82: "./assets/images/icon-rain.webp",
    85: "./assets/images/icon-rain.webp",
    86: "./assets/images/icon-rain.webp",
    95: "./assets/images/icon-storm.webp",
    96: "./assets/images/icon-storm.webp",
    99: "./assets/images/icon-storm.webp",
  };

  return icons[code] || "./assets/images/icon-sunny.webp";
}

// --- Function for rendering the weathers ---

function renderHourlyWeather(data) {
  const now = new Date();

  const currentHourIndex = data.hourly.time.findIndex((t) => {
    const time = new Date(t);
    return time.getHours() === now.getHours();
  });

  const hours = data.hourly.time.slice(currentHourIndex, currentHourIndex + 8);

  hours.forEach((timeStr, i) => {
  
  let hourlyCard = document.createElement("div");
  hourlyCard.classList.add("hourly-card");

  let imageDiv = document.createElement("div");
  let image = document.createElement("img");
  image.src = renderWeatherIcon(data.hourly.weather_code[currentHourIndex + i]);
  image.alt = "Weather icon"; 
  imageDiv.appendChild(image);

  const pText = document.createElement("p");
  const time = new Date(timeStr);
  pText.textContent = time.toLocaleTimeString([], { hour: "numeric" });
  imageDiv.appendChild(pText);

  hourlyCard.appendChild(imageDiv);

  let temperatureText = document.createElement("p");
  temperatureText.textContent = `${Math.trunc(
    data.hourly.temperature_2m[currentHourIndex + i]
  )}°`;
  hourlyCard.appendChild(temperatureText);

  hourlyCards.appendChild(hourlyCard);
  });
}

function renderDailyWeather(dailyData){

  for (let i=0; i<dailyData.daily.time.length; i++){

  let dailyCard = document.createElement("div");
  dailyCard.classList.add("daily-card");
  let day = document.createElement("h4");
  day.textContent = renderWeekDays(dailyData.daily.time[i]);
  dailyCard.appendChild(day);
  const image= document.createElement("img");
  image.src = renderWeatherIcon(dailyData.daily.weather_code[i]);
  image.alt = "Weather icon"; 
  dailyCard.appendChild(image);

  let temperatures = document.createElement("div");
  temperatures.classList.add("daily-temperatures");
  let highest = document.createElement("p");
  highest.textContent = `${Math.trunc(dailyData.daily.temperature_2m_max[i])}°`;
  temperatures.appendChild(highest);
  let lowest = document.createElement("p");
  lowest.textContent = `${Math.trunc(dailyData.daily.temperature_2m_min[i])}°`;
  temperatures.appendChild(lowest);

  dailyCard.appendChild(temperatures);
  dailyCards.appendChild(dailyCard);
  console.log("done");}
}

function renderWeekDays(date){
  let weekday = new Date(date);
  let options = {
    weekday: "short"
  };
  return weekday.toLocaleDateString("en-US", options);
}