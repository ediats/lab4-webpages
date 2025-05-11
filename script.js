$(document).ready(function () {
  // Initialize the map
  var map = L.map('map').setView([39.7527, -104.9992], 13);

  // Add base layer
  var defaultBase = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Load GeoJSON and build overlay layer
  $.getJSON('light_rail_stations.geojson', function (data) {
    // Create rail stations layer
    var railStations = L.geoJSON(data, {
      onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.STATION) {
          layer.bindPopup('<strong>' + feature.properties.STATION + '</strong>');
        }
      }
    });

    // Add layer to map
    railStations.addTo(map);

    // ✅ Define base and overlay maps (INSIDE the callback)
    var baseMaps = {
      "OpenStreetMap": defaultBase
    };

    var overlayMaps = {
      "Light Rail Stations": railStations
    };

    // ✅ Add layer control to map
    L.control.layers(baseMaps, overlayMaps).addTo(map);
  });

  // jQuery effect: fade out title when clicked
  $('#map-title').click(function () {
    $(this).fadeOut('slow');
  });
});
