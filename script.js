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

// Fetch weather from API and update UI
async function getWeather() {
    const location = document.getElementById('location-input').value;
    if (!location) return;

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=your-openweathermap-api-key`);
    const data = await response.json();
    
    if (data.cod === 200) {
        const temp = data.main.temp;
        const condition = data.weather[0].description;
        const background = getWeatherBackground(condition);

        document.getElementById('temperature').textContent = `${temp}°C`;
        document.getElementById('condition').textContent = condition;
        document.getElementById('background').style.backgroundImage = `url(${background})`;

        savePreferences(location, temp, condition);
    } else {
        alert('Location not found');
    }
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
        'clear sky': 'https://path/to/clear-sky.jpg',
        'clouds': 'https://path/to/cloudy.jpg',
        'rain': 'https://path/to/rain.jpg',
        'snow': 'https://path/to/snow.jpg',
        'thunderstorm': 'https://path/to/thunderstorm.jpg',
        'drizzle': 'https://path/to/drizzle.jpg',
        'mist': 'https://path/to/mist.jpg'
    };

    return backgrounds[condition] || 'https://path/to/default-weather.jpg';
}

// Initialize preferences when the page loads
window.onload = function() {
    setPreferences();
}
