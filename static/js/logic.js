//Creating the map object
let myMap = L.map("map", {
    center: [12.5994, 85.6731],
    zoom: 3
});

//Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Create a legend on the map
let legend = L.control({ position: "bottomright" });
legend.onAdd = function () {
  let div = L.DomUtil.create("div", "info legend");
  
  // Legend title
  let legendInfo = '<h1 class="legend-title">Earthquake Depth</h1>';
  div.innerHTML = legendInfo;

  // Create an empty array for the labels
  let labels = [];
  
  const depthBoundaries = [-10, 10, 30, 50, 70, 90];
  const colors = ["#FFF59D", "#FFD54F", "#FFA726", "#FF5722", "#BF360C", "#A662F9"];
  
  // Loop through the depth boundaries and generate a label with a colored square for each interval
  for (let i = 0; i < depthBoundaries.length; i++) {
    labels.push(`<li style="background-color: ${colors[i]}; color: black;">${depthBoundaries[i]}${(i === depthBoundaries.length - 1) ? '+' : ` - ${depthBoundaries[i + 1]}`}</li>`);
  }
  
  // Add the list of labels to the legend div
  div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  return div;
};

// Add the legend to the map
legend.addTo(myMap);

// Retrieve earthquake data from USGS link
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(function (data) {
    console.log(data);

    let features = data.features;

    // set min and max depth variables to help understand the range 
    let maxDepth = -Infinity;
    let minDepth = Infinity;

    for (let i = 0; i < features.length; i++) {

        //location data for circle markers
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
    
        // magnitude data for colour of circle marker
        let properties = features[i].properties;
        let magnitude = properties.mag;
        
        // place information for bindPopups
        let place = properties.place;    

    // Conditionals for earthquake marker color (depth coordinate)
    const depthBoundaries = [-10, 10, 30, 50, 70, 90];
    const colors = ["#FFF59D", "#FFD54F", "#FFA726", "#FF5722", "#BF360C", "#4A148C"];
    let color;
    
    for (let j = 0; j < depthBoundaries.length - 1; j++) {
      if (depth >= depthBoundaries[j] && depth < depthBoundaries[j + 1]) {
        color = colors[j];
        break;
      }
    }
    
    if (color === undefined) {
      color = colors[colors.length - 1];
    }
// console.log(`Depth: ${depth}, Assigned color: ${color}`); // error checking

    // Add circle markers to the map. Circle size based on magnitude 
    L.circle([coordinates[1], coordinates[0]], {
      fillOpacity: 0.80,
      color: "white",
      fillColor: color,
      radius: (magnitude + 1) * 50000 // use +1 to remove negative magnitude values 
    }).bindPopup(`<h1>${place}</h1> <hr> <h2>Magnitude: ${magnitude}</h2> <hr> <h3>Depth: ${depth}</h3>`).addTo(myMap);
}
//checking to see the min and max depth across all earthquake data 
console.log("maxDepth:", maxDepth);
console.log("minDepth:", minDepth);

})