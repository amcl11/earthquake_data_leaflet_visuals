//Creating the map object
let myMap = L.map("map", {
    center: [12.5994, 85.6731],
    zoom: 3
});

//Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


// Retrieve earthquake data from USGS link
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(function (data) {
    console.log(data);

    let features = data.features;

    let maxDepth = -Infinity;
    let minDepth = Infinity;

    for (let i = 0; i < features.length; i++) {

        //location data for markers
        let location = features[i].geometry;
        let coordinates = location.coordinates;

            // finding min and max depths for colour segments based on depth 
        let depth = coordinates[2];
  
            if (depth > maxDepth) {
                maxDepth = depth;
        }
      
            if (depth < minDepth) {
            minDepth = depth;
        }
    
        // magnitude data for marker colour 
        let properties = features[i].properties;
        
        // use absolute values to ensure negative magnitude values can be mapped 
        let magnitude = Math.abs(properties.mag);
            
        // place information for popup
        let place = properties.place;    

    // Conditionals for earthquake marker color (depth coordinate)
    const depthBoundaries = [-10, 10, 30, 50, 70, 90];
    const colors = ["#FFF59D", "#FFD54F", "#FFA726", "#FF5722", "#BF360C", "#4A148C"];
    let color;
    
    for (let i = 0; i < depthBoundaries.length; i++) {
      if (depth < depthBoundaries[i]) {
        color = colors[i];
        break;
      }
    }
    
    if (color === undefined) {
      color = colors[colors.length - 1];
    }
  
    // Add circle markers to the map. Circle size based on magnitude 
    //execute for data with a magnitude greater than 0
    
    L.circle([coordinates[1], coordinates[0]], {
      fillOpacity: 0.80,
      color: "white",
      fillColor: color,
      // Adjust the radius.
      radius: Math.pow(Math.log(magnitude + 1), 2) * 100000
    }).bindPopup(`<h1>${place}</h1> <hr> <h3>Magnitude: ${magnitude}</h3>`).addTo(myMap);
}

console.log("maxDepth:", maxDepth);
console.log("minDepth:", minDepth);

})