// ================= LIVE CLOCK =================
setInterval(() => {
  const now = new Date();
  document.getElementById("time").innerHTML =
    now.toLocaleDateString() + " | " + now.toLocaleTimeString();
}, 1000);

// ================= API KEY =================
const apiKey = "de63d744643ec85ff31ab90f4dd9ada9"; // OpenWeather API key

// ================= AUTO LOCATION ON LOAD =================
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        getWeatherByLocation(
          position.coords.latitude,
          position.coords.longitude,
        );
      },
      () => {
        document.getElementById("city").innerHTML = "Search a City";
      },
    );
  }
};

// ================= SEARCH CITY =================
function searchCity() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return;

  showLoader(true);

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`,
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.cod === 200) {
        updateUI(data);
      } else {
        alert("City not found");
        showLoader(false);
      }
    })
    .catch(() => showLoader(false));
}

// ================= USE MY LOCATION BUTTON =================
function getMyLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  showLoader(true);

  navigator.geolocation.getCurrentPosition((position) => {
    getWeatherByLocation(position.coords.latitude, position.coords.longitude);
  });
}

// ================= WEATHER BY LOCATION =================
function getWeatherByLocation(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
  )
    .then((res) => res.json())
    .then((data) => updateUI(data))
    .catch(() => showLoader(false));
}

// ================= UPDATE UI =================
function updateUI(data) {
  showLoader(false);

  document.getElementById("city").innerHTML =
    `${data.name}, ${data.sys.country}`;

  document.getElementById("temp").innerHTML = Math.round(data.main.temp) + "°C";

  document.getElementById("condition").innerHTML = data.weather[0].description;

  document.getElementById("humidity").innerHTML = data.main.humidity + "%";

  document.getElementById("wind").innerHTML =
    (data.wind.speed * 3.6).toFixed(1) + " km/h";

  // Weather Icon
  document.getElementById("icon").innerHTML = `
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
  `;

  // Map Update
  document.getElementById("map").src =
    `https://maps.google.com/maps?q=${data.coord.lat},${data.coord.lon}&z=10&output=embed`;

  setBackground(data.weather[0].main);
}

// ================= BACKGROUND BASED ON WEATHER =================
function setBackground(weather) {
  document.body.className = "";

  if (weather === "Clear") document.body.classList.add("sunnyBg");
  if (weather === "Clouds") document.body.classList.add("cloudyBg");
  if (weather === "Rain" || weather === "Drizzle")
    document.body.classList.add("rainBg");
  if (weather === "Snow") document.body.classList.add("snowBg");
}

// ================= DARK MODE =================
function darkMode() {
  document.body.classList.toggle("dark");
}

// ================= LOADER =================
function showLoader(show) {
  document.getElementById("loader").style.display = show ? "block" : "none";
}
