let openDropdown = document.getElementById("open-units-dropdown");
let dropdown = document.getElementById("dropdown");
let searchBtn = document.getElementById("search-btn");

openDropdown.addEventListener("click", (event) => {
  if (dropdown.style.display === "block") {
    dropdown.style.display = "none";
  } else {
    dropdown.style.display = "block";
  }
});

searchBtn.addEventListener("click", (event) => {
  event.preventDefault();
  let city = document.getElementById("city").value;
  getCordinates(city);
  let resultCityDisplay = document.getElementById("search-result-city");
  resultCityDisplay.textContent = city;

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
});

function getCordinates(city) {
  //const city = "Helsinki";
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

      // Tässä kohtaa voit käyttää koordinaatteja säähaussa
    })
    .catch((err) => console.error(err));
}
