$(document).ready(function () {
  // Create the map
  var map = L.map('map').setView([39.7527, -104.9992], 13);

  // Add the base tile layer
  var defaultBase = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Load the GeoJSON file
  $.getJSON('light_rail_stations.geojson', function (data) {
    // Create the layer for rail stations
    var railStations = L.geoJSON(data, {
      onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.STATION) {
          layer.bindPopup('<strong>' + feature.properties.STATION + '</strong>');
        }
      }
    });

    // Add the layer to the map
    railStations.addTo(map);

    // ✅ BASEMAPS AND OVERLAY LAYERS (INSIDE the callback!)
    var baseMaps = {
      "OpenStreetMap": defaultBase
    };

    var overlayMaps = {
      "Light Rail Stations": railStations
    };

    // ✅ ADD THE LAYER CONTROL WIDGET
    L.control.layers(baseMaps, overlayMaps).addTo(map);
  });

  // Simple jQuery interaction (fade out title when clicked)
  $('#map-title').click(function () {
    $(this).fadeOut('slow');
  });
});
