let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson';

// GET geojason data r
d3.json(url, function(data) {
    createFeatures(data.features);
    console.log(data.features);
});

// Create function to create dynamic circles based on size of the earthquakes
function createFeatures(Equake_data) {
    let Equake = L.geoJson(Equake_data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                fillColor: getColor(feature.properties.mag),
                stroke: false,
                weight: 0.8,
                radius: feature.properties.mag,
                opacity: 1.2,
                color: 'black',
                fillOpacity: 0.5
            })
                .bindPopup('<h3>' + 'Location: ' + feature.properties.place +
                    '</h3><hr><p>' + 'Date/Time: ' + new Date(feature.properties.time) + '<br>' +
                    'Magnitude: ' + feature.properties.mag + '</p>');
        }

    });

    createMap(Equake);
}
//   color scheme for magnitude
function getColor(Mag) {
    return Mag > 5 ? '#ff001a' :
        Mag > 4 ? '#fe7200' :
            Mag > 3 ? '#ffb62c' :
                Mag > 2 ? '#fccea1' :
                    Mag > 1 ? '#fdff2c' :
                        Mag > 0 ? '#f8f9aa' :
                            '#428d94';
}

// funtion to change size of marker based on earthquake magnitude

function getRadius(Mag) {
    if (Mag === 0) {
        return 1;
    }

    return Mag * 4;
}

function createMap(Equake) {
    // Adding tile layer to the map
    let street_map = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });

    // Adding tile layer to the map
    let dark_map = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 20,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    // Adding tile layer to the map
    let out_doors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: API_KEY
    });

    // Adding tile layer to the map
    let light_map = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });


    let base_Maps = {
        "Street": street_map,
        "Dark": dark_map,
        "Out_d": out_doors,
        "Light": light_map
    };

    let overlayMaps = {
        'Earthquakes': Equake
    };

       // Creating map object
let map = L.map("map", {
    center: [40.7, -100.95],
    zoom: 11,
    layers: [dark_map, Equake]
});
console.log(map);

    //layer control

    L.control.layers(base_Maps, overlayMaps, {
        collapsed: false
    }).addTo(map);
// set up our legend and loop thru the grade interval
    let legend = L.control({ position: 'bottomleft' });
    legend.onAdd = function (map) {
        let div = L.DomUtil.create('div', 'info legend'),
            labels = [],
            grades = [0, 1, 2, 3, 4, 5];

        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
            labels.push(
                '<i style="background:' + getColor(grades[i] + 1) + '"></i>' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+'));
        }
        console.log('div' + div);
        return div;
    };

    legend.addTo(map);





}