/**
 * Mount Crumpit & Whoville Live Weather Engine
 * Includes:
 * - City Search via Open-Meteo Geocoding API
 * - Live Current + 6-Hour Forecast via Open-Meteo Forecast API
 * - Grinch-themed weather descriptions, icons, & falling rain/snow animations
 * - °F / °C Unit Toggle & Raw JSON Toggle (querySelector + addEventListener)
 * - Accessible Whoville Alert Form Validation with live error clearing
 */

let currentLocation = {
  name: "New Castle, DE (Whoville Outpost)",
  latitude: 39.6621,
  longitude: -75.5666
};

let isFahrenheit = true;
let liveTempF = 34;
let liveHourlyForecast = [];
let liveWeatherData = null;

function formatTemp(tempF) {
  if (isFahrenheit) {
    return `${Math.round(tempF)}°F`;
  }
  return `${Math.round(((tempF - 32) * 5) / 9)}°C`;
}

// Grinch movie-themed weather labels, icons, themes, and particle effects
function getWeatherVisuals(code) {
  if (code === 0 || code === 1) {
    return {
      label: "Grinch's Heart Grew 3 Sizes (Clear & Bright)",
      icon: "💚",
      theme: "grinch-clear",
      effect: "none"
    };
  }
  if (code === 2 || code === 3 || code === 45 || code === 48) {
    return {
      label: "Gloomy Mount Crumpit Cave Clouds",
      icon: "☁️",
      theme: "grinch-cloudy",
      effect: "none"
    };
  }
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return {
      label: "Slushy Grinch Rain Showers",
      icon: "🌧️",
      theme: "grinch-rain",
      effect: "rain"
    };
  }
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    return {
      label: "Whoville Christmas Snowfall!",
      icon: "❄️",
      theme: "grinch-snow",
      effect: "snow"
    };
  }
  if (code >= 95 && code <= 99) {
    return {
      label: "Mount Crumpit Sleigh Thunderstorm!",
      icon: "⛈️",
      theme: "grinch-rain",
      effect: "heavy-rain"
    };
  }
  return {
    label: "Crisp Whoville Air",
    icon: "🎄",
    theme: "grinch-clear",
    effect: "none"
  };
}

// Dynamically generate falling rain drops or snowflakes in the DOM
function renderWeatherParticles(effectType) {
  const container = document.querySelector("#weather-particles");
  if (!container) return;

  container.innerHTML = "";
  if (effectType === "none") return;

  const count = effectType === "heavy-rain" ? 80 : 45;
  const particleClass = effectType === "snow" ? "snowflake" : "raindrop";

  for (let i = 0; i < count; i++) {
    const particle = document.createElement("span");
    particle.classList.add(particleClass);
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDuration =
      effectType === "snow"
        ? `${2.4 + Math.random() * 2}s`
        : `${0.45 + Math.random() * 0.4}s`;
    particle.style.animationDelay = `${Math.random() * 2}s`;
    container.appendChild(particle);
  }
}

function renderHourlyCards() {
  const hourlyGrid = document.querySelector("#hourly-grid");
  if (!hourlyGrid) return;

  hourlyGrid.innerHTML = "";

  liveHourlyForecast.forEach((slot) => {
    const visuals = getWeatherVisuals(slot.code);
    const card = document.createElement("div");
    card.classList.add("hour-card");

    const timeEl = document.createElement("p");
    timeEl.classList.add("hour-time");
    timeEl.textContent = slot.timeLabel;

    const iconEl = document.createElement("div");
    iconEl.classList.add("hour-icon");
    iconEl.setAttribute("aria-hidden", "true");
    iconEl.textContent = visuals.icon;

    const tempEl = document.createElement("p");
    tempEl.classList.add("hour-temp");
    tempEl.textContent = formatTemp(slot.tempF);

    card.appendChild(timeEl);
    card.appendChild(iconEl);
    card.appendChild(tempEl);
    hourlyGrid.appendChild(card);
  });
}

function updateTemperatureDisplays() {
  const tempDisplay = document.querySelector("#temp-display");
  if (tempDisplay) {
    tempDisplay.textContent = formatTemp(liveTempF);
  }
  renderHourlyCards();
}

function applyWeatherState(weatherCode, tempF, windMph) {
  const card = document.querySelector("#weather-widget");
  const cityHeading = document.querySelector("#city-heading");
  const iconEl = document.querySelector("#weather-icon");
  const conditionEl = document.querySelector("#condition-text");
  const windEl = document.querySelector("#wind-display");

  liveTempF = tempF;
  updateTemperatureDisplays();

  const visuals = getWeatherVisuals(weatherCode);

  if (cityHeading) cityHeading.textContent = currentLocation.name;
  if (card) {
    card.classList.remove("grinch-clear", "grinch-cloudy", "grinch-rain", "grinch-snow");
    card.classList.add(visuals.theme);
  }
  if (iconEl) iconEl.textContent = visuals.icon;
  if (conditionEl) conditionEl.textContent = visuals.label;
  if (windEl) windEl.textContent = `Sleigh Wind: ${Math.round(windMph)} mph`;

  renderWeatherParticles(visuals.effect);
}

// Fetch Live Weather Data
async function fetchWeatherData() {
  const outputElement = document.querySelector("#json-output");
  const badgeElement = document.querySelector(".status-badge");

  const apiUrl = `https://open-meteo.com{currentLocation.latitude}&longitude=${currentLocation.longitude}&current=temperature_2m,wind_speed_10m,weather_code&hourly=temperature_2m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`;

  if (badgeElement) {
    badgeElement.textContent = "Grinch Radar: Scanning skies...";
  }

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Server responded with code: ${response.status}`);
    }

    const data = await response.json();
    liveWeatherData = data;

    const currentHourIso = data.current.time.slice(0, 13);
    let startIndex = data.hourly.time.findIndex((t) => t.startsWith(currentHourIso));
    if (startIndex === -1) startIndex = 0;

    liveHourlyForecast = [];
    for (let i = startIndex; i < startIndex + 6 && i < data.hourly.time.length; i++) {
      const hourNum = Number(data.hourly.time[i].slice(11, 13));
      const ampm = hourNum >= 12 ? "PM" : "AM";
      const hour12 = hourNum % 12 === 0 ? 12 : hourNum % 12;

      liveHourlyForecast.push({
        timeLabel: `${hour12} ${ampm}`,
        tempF: data.hourly.temperature_2m[i],
        code: data.hourly.weather_code[i]
      });
    }

    applyWeatherState(
      data.current.weather_code,
      data.current.temperature_2m,
      data.current.wind_speed_10m
    );

    if (outputElement) {
      outputElement.textContent = JSON.stringify(
        {
          outpost: currentLocation.name,
          coordinates: `${currentLocation.latitude}, ${currentLocation.longitude}`,
          current: data.current,
          next6Hours: liveHourlyForecast
        },
        null,
        2
      );
    }

    if (badgeElement) {
      badgeElement.textContent = "Grinch Radar: Live & Stealing Data!";
      badgeElement.style.color = "#fef08a";
    }
  } catch (error) {
    console.error("API Pipeline Error:", error);
    if (badgeElement) {
      badgeElement.textContent = "Grinch Radar: Offline (Using Mount Crumpit Backup)";
      badgeElement.style.color = "#fecaca";
    }
    liveHourlyForecast = [
      { timeLabel: "Now", tempF: 32, code: 73 },
      { timeLabel: "+1h", tempF: 31, code: 73 },
      { timeLabel: "+2h", tempF: 30, code: 61 },
      { timeLabel: "+3h", tempF: 29, code: 3 },
      { timeLabel: "+4h", tempF: 28, code: 1 },
      { timeLabel: "+5h", tempF: 27, code: 0 }
    ];
    applyWeatherState(73, 32, 14);
  }
}

// Search any city using Open-Meteo Geocoding API
async function searchCityWeather(cityQuery) {
  const searchFeedback = document.querySelector("#search-feedback");
  const previewSelect = document.querySelector("#weather-preview-select");

  if (searchFeedback) searchFeedback.textContent = `Max is sniffing out "${cityQuery}"...`;

  try {
    const geoUrl = `https://open-meteo.com{encodeURIComponent(cityQuery)}&count=1&language=en&format=json`;
    const response = await fetch(geoUrl);
    if (!response.ok) throw new Error("Geocoding service unavailable");

    const geoData = await response.json();
    if (!geoData.results || geoData.results.length === 0) {
      if (searchFeedback) {
        searchFeedback.textContent = `Even the Grinch couldn't find "${cityQuery}". Try another town!`;
      }
      return;
    }

    const place = geoData.results[0];
    const region = place.admin1 ? `, ${place.admin1}` : `, ${place.country}`;
    currentLocation = {
      name: `${place.name}${region}`,
      latitude: place.latitude,
      longitude: place.longitude
    };

    if (searchFeedback) searchFeedback.textContent = "";
    if (previewSelect) previewSelect.value = "live";
    await fetchWeatherData();
  } catch (error) {
    console.error("City Search Error:", error);
    if (searchFeedback) {
      searchFeedback.textContent = "Radar jammed! Unable to search cities right now.";
    }
  }
}

function setupDomInteractions() {
  const searchForm = document.querySelector("#city-search-form");
  const cityInput = document.querySelector("#city-input");
  const searchFeedback = document.querySelector("#search-feedback");
  const unitBtn = document.querySelector("#unit-toggle-btn");
  const toggleJsonBtn = document.querySelector("#toggle-json-btn");
  const jsonOutput = document.querySelector("#json-output");
  const refreshBtn = document.querySelector("#refresh-weather-btn");
  const previewSelect = document.querySelector("#weather-preview-select");

  if (searchForm && cityInput) {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = cityInput.value.trim();
      if (query === "") {
        if (searchFeedback) searchFeedback.textContent = "Type a town name first, you Who!";
        cityInput.focus();
        return;
      }
      searchCityWeather(query);
    });
  }

  if (unitBtn) {
    unitBtn.addEventListener("click", () => {
