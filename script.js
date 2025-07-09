const API_KEY = 'af99787ad8ddddbd13c496c8d2bf71be';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const weatherDisplay = document.getElementById('weatherDisplay');

const cityName = document.getElementById('cityName');
const weatherIcon = document.getElementById('weatherIcon');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weatherDescription');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');

searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') handleSearch();
});

function handleSearch() {
  const city = cityInput.value.trim();
  if (!city) return displayError('Please enter a city name.');
  clearUI();
  showLoading();
  fetchWeather(city);
}

async function fetchWeather(city) {
  try {
    const res = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    if (!res.ok) {
      if (res.status === 404) throw new Error('City not found.');
      if (res.status === 401) throw new Error('Invalid API key.');
      throw new Error('Error fetching data.');
    }
    const data = await res.json();
    renderWeather(data);
  } catch (err) {
    displayError(err.message);
  } finally {
    hideLoading();
  }
}

function renderWeather(data) {
  const { name, sys, main, weather, wind, timezone } = data;
  cityName.textContent = `${name}, ${sys.country}`;
  weatherIcon.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  weatherIcon.alt = weather[0].description;

  temperature.textContent = Math.round(main.temp);
  weatherDescription.textContent = weather[0].description;

  feelsLike.textContent = Math.round(main.feels_like);
  humidity.textContent = main.humidity;
  windSpeed.textContent = wind.speed.toFixed(1);

  sunrise.textContent = formatTime(sys.sunrise + timezone);
  sunset.textContent = formatTime(sys.sunset + timezone);

  weatherDisplay.classList.remove('hidden');
}

function formatTime(unixSec) {
  return new Date(unixSec * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

function displayError(msg) {
  errorDiv.textContent = msg;
  errorDiv.classList.remove('hidden');
}

function clearUI() {
  errorDiv.classList.add('hidden');
  weatherDisplay.classList.add('hidden');
}

function showLoading() {
  loading.classList.remove('hidden');
}

function hideLoading() {
  loading.classList.add('hidden');
}
