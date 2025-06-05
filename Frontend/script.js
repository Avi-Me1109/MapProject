var map = L.map('map');

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let myLocation = null;

map.locate({setView: true, maxZoom: 16});

map.on('locationfound', function(e) {
    myLocation = e.latlng;  
    L.marker(e.latlng).addTo(map)
        .bindPopup("You are here").openPopup();
});
map.on('locationerror', function(e) {
    alert("Location of currenr user not found! Defaulting to London")
    myLocation = L.latlng[51.5, -0.09]; 
    map.setView([51.5, -0.09], 13);
});

let currentRoute = null;

async function fetchCoordinates(location){
    location = location.toLowerCase();
    if (location.includes("my location")){
        return [myLocation.lat, myLocation.lng];
    }
    
    console.log("Finding for: " + location);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
    const response = await fetch(url);
    const data = await response.json();
    let lattitude;
    let longitude;

    if (data.length > 0){
        lattitude = parseFloat(data[0].lat);
        longitude = parseFloat(data[0].lon);
        console.log("Lattitude: " + lattitude + " Longitude: " + longitude);
        return [lattitude, longitude];
    }

    return null;
}

async function plotRoute(origin, destination){
    const originCoordinates = await fetchCoordinates(origin);
    const destinationCoordinates = await fetchCoordinates(destination);

    if (originCoordinates && destinationCoordinates){
        if(currentRoute != null){
            map.removeControl(currentRoute);
        }

        currentRoute = L.Routing.control({
            waypoints: [
                L.latLng(originCoordinates[0], originCoordinates[1]),
                L.latLng(destinationCoordinates[0], destinationCoordinates[1])
            ],
            routeWhileDragging: false,
            router: L.Routing.mapbox('pk.eyJ1IjoibWFub2Zib25lIiwiYSI6ImNtYmp5dHVhazBsMzgybm9vcjYxbmk2azQifQ.FOyfGkzW1nHJT4iJ3oYNwA')
        })
        .on('routesfound', function(e) {
            const route = e.routes[0];
            const cor1 = route.waypoints[0].latLng
            const cor2 = route.waypoints[1].latLng
            const bounds = L.latLngBounds([cor1, cor2]);   
            map.fitBounds(bounds, {padding: [100, 100]});
            map.addControl(currentRoute);
        })
        .on('routingerror', function (err) {
            console.error("Routing error:", err);
            alert("Could not calculate route. Please try different locations.");
        })
        .addTo(map);
    }else{
        alert("Location not found");
    }
}