$(document).ready(function () {
  // Initialize the map centered on Union Station
  var map = L.map('map').setView([39.7527, -104.9992], 13);

  // Add base tile layer
  var defaultBase = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Create an empty layer group variable for rail stations
  var railStations;

  // Load the GeoJSON and add it to the map
  $.getJSON('light_rail_stations.geojson', function (data) {
    railStations = L.geoJSON(data, {
      onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.STATION) {
          layer.bindPopup('<strong>' + feature.properties.STATION + '</strong>');
        }
      }
    });

    // Add it to the map
    railStations.addTo(map);

    // Add the layer to the overlay controls
    var baseMaps = {
      "OpenStreetMap": defaultBase
    };
    var overlayMaps = {
      "Light Rail Stations": railStations
    };
    L.control.layers(baseMaps, overlayMaps).addTo(map);
  });

  // jQuery interaction - fade out title
  $('#map-title').click(function () {
    $(this).fadeOut('slow');
  });
});
