let map, userLocation, circle, directionsService, directionsRenderer;
let endLocation; // Dies bleibt das Ziel für die Route
let selectedMode = 'DRIVING';
function initMap() {
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: { lat: -34.397, lng: 150.644 },
    });
    directionsRenderer.setMap(map);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(userLocation);

            new google.maps.Marker({
                position: userLocation,
                map: map,
                title: 'Dein Standort'
            });

            circle = new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: map,
                center: userLocation,
                radius: parseInt(document.getElementById('radiusSlider').value) * 1000
            });
        }, function() {
            handleLocationError(true, map.getCenter());
        });
    } else {
        handleLocationError(false, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, pos) {
    // Hier sollte die Fehlerbehandlung für den Standort implementiert werden
}


function generateRandomRoute() {
    if (!userLocation) {
        alert('Standort nicht verfügbar. Bitte erlauben Sie den Zugriff auf Ihren Standort.');
        return;
    }

    // Generiere immer ein neues Ziel, wenn "Route generieren" geklickt wird
    const radiusInKm = parseInt(document.getElementById('customRadius').value);
    endLocation = getRandomLocation(userLocation, radiusInKm * 1000);
    document.getElementById('transport-mode-buttons').style.display = 'flex';

    updateRoute(); // Rufen Sie die Funktion auf, um die Route zu aktualisieren
}



function updateRoute() {
    circle.setCenter(userLocation);
    circle.setRadius(parseInt(document.getElementById('customRadius').value) * 1000);

    directionsService.route({
        origin: userLocation,
        destination: endLocation,
        travelMode: google.maps.TravelMode[selectedMode]
    }, function(response, status) {
        if (status === 'OK') {
            directionsRenderer.setDirections(response);
            const distance = response.routes[0].legs[0].distance.text;
            displayDistance(distance);
            document.getElementById('openInGoogleMaps').style.display = 'block';
        } else {
            window.alert('Routenanfrage fehlgeschlagen: ' + status);
        }
    });
}

function setSelectedMode(mode) {
    selectedMode = mode;
    if (endLocation) { // Wenn bereits ein Ziel festgelegt wurde, aktualisieren Sie die Route
        updateRoute();
    }
}
function getRandomLocation(center, radius) {
    const y0 = center.lat;
    const x0 = center.lng;
    const rd = radius / 111300;

    const u = Math.random();
    const v = Math.random();

    const w = rd * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const x = w * Math.cos(t);
    const y = w * Math.sin(t);

    return { lat: y + y0, lng: x / Math.cos(y0) + x0 };
}

function displayDistance(distance) {
    const distanceElement = document.getElementById('routeDistance');
    distanceElement.textContent = `Entfernung zum Ziel: ${distance}`;
}

document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('radiusSlider');
    const customRadiusInput = document.getElementById('customRadius');
    const radiusValueDisplay = document.getElementById('radiusValue');
    document.getElementById('openInGoogleMaps').addEventListener('click', openInMaps);

    slider.addEventListener('input', function() {
        updateRadiusValue(this.value);
    });

    customRadiusInput.addEventListener('input', function() {
        updateRadiusValue(this.value);
    });

    document.getElementById('generateRoute').addEventListener('click', generateRandomRoute);
     document.getElementById('modeDriving').addEventListener('click', function() { setSelectedMode('DRIVING'); });
    document.getElementById('modeWalking').addEventListener('click', function() { setSelectedMode('WALKING'); });
    document.getElementById('modeBicycling').addEventListener('click', function() { setSelectedMode('BICYCLING'); });
});

document.addEventListener('DOMContentLoaded', function() {
    // ... (Rest des Event Listener Codes)

    const toggleButton = document.getElementById('mode-toggle');
    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode');
    });
});
// Rest des JavaScript-Codes...

function updateRadiusValue(value) {
    const radiusInKm = parseInt(value);
    document.getElementById('radiusValue').textContent = radiusInKm;
    document.getElementById('customRadius').value = radiusInKm;
    document.getElementById('radiusSlider').value = radiusInKm;
    updateCircleRadius(radiusInKm);
}

function updateCircleRadius(radiusInKm) {
    if (circle) {
        circle.setRadius(radiusInKm * 1000);
    }
}
function showLoadingIndicator() {
    document.getElementById('loadingIndicator').style.display = 'block';
}

function hideLoadingIndicator() {
    document.getElementById('loadingIndicator').style.display = 'none';
}
function openInMaps() {
    if (!endLocation) {
        alert('Bitte generieren Sie zuerst eine Route.');
        return;
    }

    // Generiere und öffne die Google Maps URL mit dem Ziel (endLocation)
    const mapsUrl = `https://www.google.com/maps?daddr=${endLocation.lat},${endLocation.lng}&dirflg=${selectedMode === 'DRIVING' ? 'd' : selectedMode === 'WALKING' ? 'w' : 'b'}`;
    window.open(mapsUrl, '_blank');
}

// Stellen Sie sicher, dass der Event Listener korrekt eingerichtet ist
document.getElementById('generateRoute').addEventListener('click', generateRandomRoute);
document.getElementById('openInGoogleMaps').addEventListener('click', openInMaps);