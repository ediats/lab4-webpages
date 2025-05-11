$(document).ready(function () {
  var map = L.map('map').setView([39.7527, -104.9992], 13);

  var defaultBase = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  function getColor(d) {
    return d > 100000 ? '#08519c' :
           d > 75000  ? '#3182bd' :
           d > 50000  ? '#6baed6' :
           d > 25000  ? '#bdd7e7' :
                        '#eff3ff';
  }
  var baseMaps = { "OpenStreetMap": defaultBase };
  var overlayMaps = {};
  var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);
  $.getJSON('light_rail_stations.geojson', function (data) {
    var railStations = L.geoJSON(data, {
      onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.STATION) {
          layer.bindPopup('<strong>' + feature.properties.STATION + '</strong>');
        }
      }
    }).addTo(map);

    layerControl.addOverlay(railStations, "Light Rail Stations");
  });

  $.getJSON('acs_denver_2021.geojson', function (acsData) {
    function style(feature) {
      return {
        fillColor: getColor(feature.properties.MEDHHINC),
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.6
      };
    }
  // Add a custom marker for Union Station
  // Highlight Union Station with a custom icon
var unionStationCoords = [39.7527, -105.0000];

var customIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // orange train pin
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

var unionStationMarker = L.marker(unionStationCoords, {
  icon: customIcon,
  title: "Union Station"
}).addTo(map);

unionStationMarker.bindPopup("<b>Union Station</b><br>Denver's major transit hub.");

    var acsLayer = L.geoJSON(acsData, {
      style: style,
      onEachFeature: function (feature, layer) {
        var income = feature.properties.MEDHHINC || "N/A";
        layer.bindPopup("Median Household Income: $" + income);
      }
    }).addTo(map);

    layerControl.addOverlay(acsLayer, "ACS Income Data");
  });
  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    var grades = [0, 25000, 50000, 75000, 100000];
    var labels = [];

    div.innerHTML += '<b>Median Household Income</b><br>';

    for (var i = 0; i < grades.length; i++) {
      var from = grades[i];
      var to = grades[i + 1];
      var color = getColor(from + 1);

      labels.push(
        '<i style="background:' + color + '"></i> ' +
        from + (to ? '&ndash;' + to : '+'));
    }

    div.innerHTML += labels.join('<br>');
    return div;
  };

  legend.addTo(map);

  $('#map-title').click(function () {
    $(this).fadeOut('slow');
  });
  // Zoom button functionality
$('#zoom-btn').click(function () {
  map.setView([39.7527, -105.0000], 15); // zoom to Union Station
  unionStationMarker.openPopup();        // open popup on arrival
});
});
