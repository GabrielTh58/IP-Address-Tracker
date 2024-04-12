const searchInput = document.querySelector('.search-ip-input');
const searchBtn = document.querySelector('.search-btn');
const apiKey = 'at_T29Ogg1wQh2uUk6w41nJLnsODuUAa';
let latitude, longitude;
var map; 

searchInput.addEventListener('keyup', (event) => {
    const pressedKey = event.which || event.keyCode;
    const isEnterKeyPressed = pressedKey === 13;

    if (isEnterKeyPressed) {
        getQueryresults();
    }
});


document.addEventListener('DOMContentLoaded', function () {
    navigator.geolocation.getCurrentPosition(success);
});

function success(pos) {
    const latitude = pos.coords.latitude;
    const longitude = pos.coords.longitude;
    showMap(latitude, longitude);
}

async function getIpOrDomain(apiKey, query, ip) {
    try {
        const response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&domain=${query}&ipAddress=${ip}`);

        if (!response.ok) {
            throw new Error('Failed to fetch IP information');
        }

        return await response.json();      

    } catch (error) {
        console.error('Error calling IP API:', error);
        throw error;
    }
}

async function getQueryresults() {
    try {
        const valueInputSearch = searchInput.value;
        let query, ip;

        if (typeof valueInputSearch === 'string') {
            query = valueInputSearch;
        } 
        else if (typeof valueInputSearch === 'number') {
            ip = valueInputSearch;
        }

        const response = await getIpOrDomain(apiKey, query, ip);

        displayIpDetails(response);
    } catch (error) {
        console.error('Error fetching or displaying IP details:', error);
    }
}

function displayIpDetails(response) {
    document.getElementById('ip-address-info').textContent = response.ip;
    document.getElementById('ip-location-info').textContent = `${response.location.region}, ${response.location.country}`;
    document.getElementById('ip-timezone-info').textContent = response.location.timezone;
    document.getElementById('ip-isp-info').textContent = response.isp;
    latitude = response.location.lat;
    longitude = response.location.lng;

    showMap(latitude, longitude);
}

searchBtn.addEventListener('click', fetchIpDetails);

function showMap(latitude, longitude) {
    if (map) {
        map.setView([latitude, longitude], 13);
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                layer.setLatLng([latitude, longitude]).update();
            }
        });
    } else { 
        map = L.map('map').setView([latitude, longitude], 13);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker([latitude, longitude]).addTo(map)
            .openPopup();
    }
}
