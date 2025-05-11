$(document).ready(function () {
  // Initialize the map centered on Union Station
  var map = L.map('map').setView([39.7527, -104.9992], 13);

  // Add OpenStreetMap baselayer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Load GeoJSON of Light Rail Stations
  $.getJSON('light_rail_stations.geojson', function (data) {
    L.geoJSON(data, {
      onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.STATION) {
          layer.bindPopup('<strong>' + feature.properties.STATION + '</strong>');
        }
      }
    }).addTo(map);
  });

  // jQuery interaction: fade out title on click
  $('#map-title').click(function () {
    $(this).fadeOut('slow');
  });
});
