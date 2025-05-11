$(document).ready(function () {
  // Create the map
  var map = L.map('map').setView([39.7527, -104.9992], 13);

  // Add the base tile layer
  var defaultBase = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // 🔷 Define the layer controls early
  var baseMaps = {
    "OpenStreetMap": defaultBase
  };
  var overlayMaps = {}; // we'll add to this later

  var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

  // Load Light Rail GeoJSON
  $.getJSON('light_rail_stations.geojson', function (data) {
    var railStations = L.geoJSON(data, {
      onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.STATION) {
          layer.bindPopup('<strong>' + feature.properties.STATION + '</strong>');
        }
      }
    }).addTo(map);

    // Add railStations to layer control
    layerControl.addOverlay(railStations, "Light Rail Stations");
  });

  // Load ACS Income GeoJSON
  $.getJSON('acs_denver_2021.geojson', function (acsData) {
    function getColor(d) {
      return d > 100000 ? '#08519c' :
             d > 75000  ? '#3182bd' :
             d > 50000  ? '#6baed6' :
             d > 25000  ? '#bdd7e7' :
                          '#eff3ff';
    }

    function style(feature) {
      return {
        fillColor: getColor(feature.properties.MEDHHINC),
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.6
      };
    }

    var acsLayer = L.geoJSON(acsData, {
      style: style,
      onEachFeature: function (feature, layer) {
        var income = feature.properties.MEDHHINC || "N/A";
        layer.bindPopup("Median Household Income: $" + income);
      }
    }).addTo(map);

    // Add ACS layer to control
    layerControl.addOverlay(acsLayer, "ACS Income Data");
  });

  // jQuery interaction
  $('#map-title').click(function () {
    $(this).fadeOut('slow');
  });
});

