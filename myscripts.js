let flightDate;
let countdownInterval;

function setFlightDate() {
    const input = document.getElementById('flightDateTime');
    if (input.value) {
        flightDate = new Date(input.value);
        saveFlightDate(flightDate.toISOString());
        updateCountdown();
        startCountdown();
    } else {
        alert('Please enter a valid date and time.');
    }
}

function saveFlightDate(dateString) {
    try {
        localStorage.setItem('flightDate', dateString);
    } catch (e) {
        // Fallback to cookies if localStorage is not available
        document.cookie = `flightDate=${dateString};max-age=31536000;path=/`;
    }
}

function getFlightDate() {
    try {
        return localStorage.getItem('flightDate');
    } catch (e) {
        // Fallback to cookies if localStorage is not available
        const match = document.cookie.match(new RegExp('(^| )flightDate=([^;]+)'));
        return match ? match[2] : null;
    }
}

function updateCountdown() {
    if (!flightDate) return;

    const now = new Date();
    const difference = flightDate - now;
    
    if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        document.getElementById('flightDate').textContent = `Flight Date: ${flightDate.toLocaleDateString(undefined, options)}`;
    } else {
        document.getElementById('countdown').innerHTML = "<div class='time-unit'><span class='time-value'>It's flight day!</span></div>";
        document.getElementById('flightDate').textContent = '';
        stopCountdown();
    }
}

function startCountdown() {
    // Clear any existing interval before starting a new one
    stopCountdown();
    // Update immediately, then every second
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

function stopCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
}

function initializePage() {
    const storedDate = getFlightDate();
    if (storedDate) {
        flightDate = new Date(storedDate);
        document.getElementById('flightDateTime').value = flightDate.toISOString().slice(0,16);
        startCountdown();
    }

    // Add event listener to the button
    document.getElementById('setFlightDateBtn').addEventListener('click', setFlightDate);
}

// Run initializePage when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializePage);