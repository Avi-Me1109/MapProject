var map = L.map('map')
map.fitWorld();

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

async function fetchCoordinates(origin){
    console.log("Finding for: " + origin);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(origin)}`;
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
