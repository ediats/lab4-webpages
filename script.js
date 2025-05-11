$(document).ready(function () {
  var map = L.map('map').setView([39.7527, -104.9992], 13);

  // Base layer
  var defaultBase = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Placeholder for the GeoJSON layer
  var railStations;

  // Load GeoJSON
  $.getJSON('light_rail_stations.geojson', function (data) {
    railStations = L.geoJSON(data, {
      onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.STATION) {
          layer.bindPopup('<strong>' + feature.properties.STATION + '</strong>');
        }
      }
    });

    // Add to map
    railStations.addTo(map);

    // 🟡 Here's the layer control (this part must be AFTER railStations is defined)
    var baseMaps = {
      "OpenStreetMap": defaultBase
    };
    var overlayMaps = {
      "Light Rail Stations": railStations
    };

    // This makes the toggle layer control appear
    L.control.layers(baseMaps, overlayMaps).addTo(map);
  });

  // jQuery fade-out for the title
  $('#map-title').click(function () {
    $(this).fadeOut('slow');
  });
});
