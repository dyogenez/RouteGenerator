let map, userLocation, circle, directionsService, directionsRenderer, endLocation;

function initMap() {
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: { lat: -34.397, lng: 150.644 }, // Standardzentrum
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
                title: 'Ihr Standort'
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
        }, function(error) {
            console.error("Geolocation Error: ", error);
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

function generateRandomRoute() {
    if (!userLocation) {
        alert('Standort nicht verfügbar. Bitte erlauben Sie den Zugriff auf Ihren Standort.');
        return;
    }

    // Beispielhafte Generierung einer zufälligen Route
    endLocation = getRandomLocation(userLocation, 5000); // Generiere einen Punkt innerhalb von 5km

    directionsService.route({
        origin: userLocation,
        destination: endLocation,
        travelMode: google.maps.TravelMode.DRIVING
    }, function(response, status) {
        if (status === 'OK') {
            directionsRenderer.setDirections(response);
            document.getElementById('routeDistance').textContent = 'Entfernung: ' + response.routes[0].legs[0].distance.text;
            
            // Aktualisiere den Link zu Google Maps
            updateGoogleMapsLink(userLocation, endLocation);
        } else {
            window.alert('Routenanfrage fehlgeschlagen: ' + status);
        }
    });
}

function updateGoogleMapsLink(start, end) {
    const googleMapsLink = generateGoogleMapsLink(start, end);
    const linkElement = document.getElementById('openInMapsButton');
    linkElement.href = googleMapsLink;
    linkElement.style.display = 'block'; // Zeige den Link an
}

function generateGoogleMapsLink(start, end) {
    return `https://www.google.com/maps/dir/?api=1&origin=${start.lat},${start.lng}&destination=${end.lat},${end.lng}&travelmode=driving`;
}

function getRandomLocation(center, radius) {
    const y0 = center.lat;
    const x0 = center.lng;
    const rd = radius / 111300; // Umrechnung in etwa Meter

    const u = Math.random();
    const v = Math.random();

    const w = rd * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const x = w * Math.cos(t);
    const y = w * Math.sin(t);

    const newLat = y + y0;
    const newLng = x / Math.cos(y0) + x0;

    return { lat: newLat, lng: newLng };
}
