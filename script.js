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

searchBtn.addEventListener("click", (event) => {
  event.preventDefault();
  let city = document.getElementById("city").value;
  getCoordinates(city);

  let searchDate = new Date();
  let options = {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  let formatted = searchDate.toLocaleDateString("en-US", options);
  console.log(formatted);
  let resultDateDisplay = document.getElementById("search-result-date");
  resultDateDisplay.textContent = formatted;
  document.getElementById("city").value = ``;
});

function getCoordinates(city) {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    city
  )}&count=1&language=fi&format=json`;

  fetch(geoUrl)
    .then((response) => response.json())
    .then((data) => {
      if (!data.results || data.results.length === 0) {
        throw new Error("Kaupunkia ei löytynyt!");
      }
      const { latitude, longitude, name, country } = data.results[0];
      console.log(`Kaupunki: ${name}, ${country} (${latitude}, ${longitude})`);
      let resultCityDisplay = document.getElementById("search-result-city");
      resultCityDisplay.textContent = `${city}, ${country}`;
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,apparent_temperature,relativehumidity_2m,windspeed_10m,precipitation&timezone=auto`;

      fetch(weatherUrl)
        .then((response) => response.json())
        .then((data) => {
          const temp = data.hourly.temperature_2m;
          console.log(`Lämpötila ${name}-kaupungissa: ${temp}°C`);
          console.log(data);
          let resultTemperature = document.getElementById(
            "search-result-temperature"
          );
          //resultTemperature.textContent = `${Math.trunc(temp)}°`;
          const now = new Date();
          const times = data.hourly.time;
          const startIndex = times.findIndex((t) => new Date(t) >= now);

          console.log(
            times[startIndex],
            data.hourly.temperature_2m[startIndex]
          );
        });
    })
    .catch((err) => console.error(err));
}
