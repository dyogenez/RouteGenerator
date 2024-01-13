let map, userLocation, circle, directionsService, directionsRenderer;
let endLocation;
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

    const radiusInKm = parseInt(document.getElementById('customRadius').value);
    const randomPoint = getRandomLocation(userLocation, radiusInKm * 1000);
    document.getElementById('generateRoute').addEventListener('click', generateRandomRoute);
    document.getElementById('openInGoogleMaps').addEventListener('click', openInMaps);

    circle.setRadius(radiusInKm * 1000);
    circle.setCenter(userLocation);

    directionsService.route({
        origin: userLocation,
        destination: randomPoint,
        travelMode: google.maps.TravelMode.DRIVING
    }, function(response, status) {
        if (status === 'OK') {
            directionsRenderer.setDirections(response);
            const distance = response.routes[0].legs[0].distance.text;
            displayDistance(distance);
            endLocation = randomPoint; // Korrekte Zuweisung von endLocation
            document.getElementById('openInGoogleMaps').style.display = 'block';
        } else {
            window.alert('Routenanfrage fehlgeschlagen: ' + status);
        }
    });
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

    slider.addEventListener('input', function() {
        updateRadiusValue(this.value);
    });

    customRadiusInput.addEventListener('input', function() {
        updateRadiusValue(this.value);
    });

    document.getElementById('generateRoute').addEventListener('click', generateRandomRoute);
});

document.addEventListener('DOMContentLoaded', (event) => {
    const toggleButton = document.getElementById('mode-toggle');
    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
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

    // Generiere und öffne die Google Maps URL
    const mapsUrl = `https://www.google.com/maps?daddr=${endLocation.lat},${endLocation.lng}`;
    window.open(mapsUrl, '_blank');
}

// Stellen Sie sicher, dass der Event Listener korrekt eingerichtet ist
document.getElementById('generateRoute').addEventListener('click', generateRandomRoute);
document.getElementById('openInGoogleMaps').addEventListener('click', openInMaps);
