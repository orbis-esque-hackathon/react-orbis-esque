
var graph_dijks;

// ?? init_graph(route_features);
// graph_dijks = create_dijk_graph(route_features);


// On click Find path
function findPathConsideringIntermediates(start, end, stopInputsId) {
    // stopInputsId = 'stopInput'

    // Add intermediate stops button
    // var sizeOfInputs = numStops;

    // ?? Do we need ?? Two check boxes (shortest vs optimal)
    // Optimal: Each segment in a day
    var selections = selectedTypes('itinerary-options');

    //Clear the previous distance information to be ready for the new path
    // $("#dist_div").html("");
    // $("#path_dist_header").css("display", "none");
    // // Repaint markers and paths to be ready for the new query
    // repaintMarkers();
    // repaintPaths();

// make the itinerary by pushing start, end and all stops in between into an array
// this will be achieved through working with origin/destination in state
    // var itinerary = makeItinerary (start, end, stopInputsId);

// Find shortest and within a day paths for itinerary and return the distance values for each path
    var distances = findItinerary(itinerary, selections);

    // ?? What is the diff short and day distances? Relate to selections, do we need both?
    var short_distance = distances[0];
    var day_distance = distances[1];

    // Calculate direct distance from source to destination
    // Do we need Euclidean distance??
    var int_direct_dist = calcDirectDistance(itinerary[0], itinerary[itinerary.length -1]);

    // Update the DOM colours
    // Add direct distance information to the page
    // $("#path_dist_header").css("display", "block");
    // displayDistance ($("#dist_div"), int_direct_dist, int_direct_dist, "Direct");
    //
    // // Add shortest distance information to th page
    // if (selections.indexOf(itin_opts[0]) != -1) {
    //     displayDistance ($("#dist_div"), short_distance, int_direct_dist, itin_opts[0]);
    // }
    // // Add within a day distance information to th page
    // if (selections.indexOf(itin_opts[1]) != -1) {
    //     displayDistance ($("#dist_div"), day_distance, int_direct_dist, itin_opts[1]);
    // }
}

function findItinerary(stops, selections) {
    var short_distance = 0, day_distance = 0;
    var s, t;
    for (var i = 0; i < stops.length - 1; i++) {
        s = stops[i];
        t = stops[i + 1];
        if (selections.indexOf(itin_opts[0]) != -1) {
            var short_path = findPath(s, t, itin_opts[0]);

            // Update colour of path on the map
            // short_distance += displayPathControl(short_path, "red");
        }
            //shortestPaths.push(findPath(s, t, "Shortest"));
        if (selections.indexOf(itin_opts[1]) != -1){
            var day_path = findPath(s, t, itin_opts[1]);

            // Update colour of path on the map
            // day_distance += displayPathControl(day_path, "green");
        }
    }
    return [short_distance, day_distance]
}

function findPath (start, end, pathType) {
    var shortPath, dayPath;
    if (start == null || end == null) return;
    // Extract the cornu_URI from the search inputs for both source and destination

    // ?? Do we need to modify data??
    var startUri = start.substring(start.lastIndexOf(",") + 1).trim();
    var endUri = end.substring(end.lastIndexOf(",") + 1).trim();

    // Only use one
    // What is itin_opts ??
    // itin_opts[0] shortest path
    if (pathType == itin_opts[0]) {
        shortPath = graph_dijks.findShortestPath(startUri, endUri);
        if (shortPath != null)
            return shortPath;
    }

    // itin_opts[1] is optimal
    if (pathType == itin_opts[1]) {
        dayPath = shortestPath(graph.getNode(startUri), graph.getNode(endUri), 'd');
        if (dayPath != null)
            return dayPath;
    }
}

// Updates colours of paths on the map
// function displayPathControl(pathData,color) {
//     var  path_distances= 0;
//
//     for (var i = 0; i < pathData.length - 1; i++) {
//         var lay = index_routes_layers[pathData[i] + "," + pathData[i + 1]];
//
//         // From handle_routes.js 53
//         // index_routes_layers
//         //     [layer.feature.properties.sToponym+","+layer.feature.properties.eToponym]
//         //         = layer;
//         if (lay == undefined) {
//             lay = index_routes_layers[pathData[i + 1] + "," + pathData[i]];
//         }
//         if (lay != undefined) {
//             customLineStyle(lay, color, 3, 1);
//             path_distances += lay.feature.properties.Meter;
//         }
//     }
//
//     Object.keys(markers).forEach(function (keys) {
//         if (pathData.indexOf(marker_properties[keys].cornu_URI) !== -1)
//             customMarkerStyle(markers[keys], color, 0.8);
//     });
//     //}
//     return path_distances;
//
// }

//Calculate the direct distance from start to end
// Euclidean distance to display at the bottom
function calcDirectDistance (start, end) {
    var startUri = start.substring(start.lastIndexOf(",") + 1).trim();
    var endUri = end.substring(end.lastIndexOf(",") + 1).trim();
    var direct_distance = distance(
        markers[startUri]['_latlng']['lat'], markers[startUri]['_latlng']['lng'],
        markers[endUri]['_latlng']['lat'],
        markers[endUri]['_latlng']['lng'], 'K');
    var int_direct_dist = parseInt(direct_distance * 1000, 10);
    return int_direct_dist;
}

function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
        dist = dist * 1.609344;
    }
    if (unit == "N") {
        dist = dist * 0.8684;
    }
    return dist;
}

export { findPathConsideringIntermediates };
