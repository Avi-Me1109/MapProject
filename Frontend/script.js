let x = document.getElementById("latitude");
let y = document.getElementById("longitude");

//var map = L.map('map').setView([ x.value, y.value], 5);

var map = L.map('map')
map.fitWorld();

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

function find() {
    map.setView([x.value, y.value], 13);
}