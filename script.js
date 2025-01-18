// Toggle theme between dark and light modes
function toggleTheme() {
    const body = document.body;
    const weatherInfo = document.getElementById('weather-info');
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        weatherInfo.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        weatherInfo.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    }
}

// Fetch weather from the Weather API and update UI
async function getWeather() {
    const location = document.getElementById('location-input').value;
    if (!location) return;

    const apiKey = '2413b19a86ce47d1a34192606251801'; // Your Weather API key
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`);
    const data = await response.json();
    
    if (data.error) {
        alert('Location not found');
        return;
    }

    const temp = data.current.temp_c; // Temperature in Celsius
    const condition = data.current.condition.text; // Weather condition
    const background = getWeatherBackground(condition);

    document.getElementById('temperature').textContent = `${temp}°C`;
    document.getElementById('condition').textContent = condition;
    document.getElementById('background').style.backgroundImage = `url(${background})`;

    savePreferences(location, temp, condition);
}

// Save preferences in cookies
function savePreferences(location, temp, condition) {
    document.cookie = `location=${location};path=/;max-age=31536000`; // expires in 1 year
    document.cookie = `temperature=${temp};path=/;max-age=31536000`;
    document.cookie = `condition=${condition};path=/;max-age=31536000`;
}

// Get preferences from cookies
function getPreferences() {
    const cookies = document.cookie.split(';');
    let preferences = {};
    
    cookies.forEach(cookie => {
        const [key, value] = cookie.split('=');
        preferences[key.trim()] = value;
    });
    
    return preferences;
}

// Set preferences to the UI
function setPreferences() {
    const preferences = getPreferences();
    
    if (preferences.location && preferences.temperature && preferences.condition) {
        document.getElementById('location-input').value = preferences.location;
        document.getElementById('temperature').textContent = `${preferences.temperature}°C`;
        document.getElementById('condition').textContent = preferences.condition;
        const background = getWeatherBackground(preferences.condition);
        document.getElementById('background').style.backgroundImage = `url(${background})`;
    }
}

// Change background based on weather condition
function getWeatherBackground(condition) {
    const backgrounds = {
        'Clear': 'https://path/to/clear-sky.jpg',
        'Partly cloudy': 'https://path/to/cloudy.jpg',
        'Cloudy': 'https://path/to/cloudy.jpg',
        'Rain': 'https://path/to/rain.jpg',
        'Snow': 'https://path/to/snow.jpg',
        'Thunderstorm': 'https://path/to/thunderstorm.jpg',
        'Drizzle': 'https://path/to/drizzle.jpg',
        'Mist': 'https://path/to/mist.jpg'
    };

    return backgrounds[condition] || 'https://path/to/default-weather.jpg';
}

// Initialize preferences when the page loads
window.onload = function() {
    setPreferences();
}
