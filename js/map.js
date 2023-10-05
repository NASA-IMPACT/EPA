// Mapbox code for creating the map goes here
mapboxgl.accessToken = 'pk.eyJ1IjoicGFyaWRoaTEyIiwiYSI6ImNsaWMxcnRwejBnYXkzZG1ub21xbmxjdWcifQ.xfiUnCHe2s0IX5NeJ0qSxQ';
var map = new mapboxgl.Map({
    container: 'map',
    style:"mapbox://styles/mapbox/navigation-day-v1",// 'mapbox://styles/mapbox/streets-v11', // Replace with your map style
    center:[-95.786052, 38.830348], // Replace with your map center coordinates
    zoom: 3.1, // Adjust the initial zoom level
    dragPan: false

});
map.scrollZoom.disable();
map.boxZoom.disable();
map.doubleClickZoom.disable();
map.touchZoomRotate.disable();

var colorStops = ["#000000", "#222", "#ffc300", "#ff8d19", "#ff5733", "#ff2e00"]; 

function putLayer( year,category){
    const heading = document.getElementById("map-title");
    heading.innerHTML =  category +" : "+ year;
    if (!map.getSource("states")){
    map.addSource('states', {
        type: 'geojson',
        data: 'https://test-epa-emissions.s3.us-east-2.amazonaws.com/epa/data/yearly.geojson'
      });
      console.log(map.getSource("states"))
    }
    if (map.getLayer("epa")){map.removeLayer("epa")}
    map.addLayer({
    id: "epa",
    type: 'fill',
    source: 'states',
    paint: {
    'fill-color': {
        property: "TotalEmissions",
        stops: [
            [5513006, colorStops[2]],
            [43791750, colorStops[3]],
            [194272600, colorStops[4]],
            [4364922070, colorStops[5]]
        ]
    }  }     ,               
    filter: [
        'all',
        ['==', 'Year', parseInt(year)],
        ['==', 'Title', category]
      ]  
    });
    console.log("here");
}

map.on("style.load", function () {
putLayer("2020","Total Methane (annual)");
});

map.on("click","epa", (e)=>{
    const state = e.features[0].properties.State; 
    const year = e.features[0].properties.Year; 
    const title = e.features[0].properties.Title;
    const epa = e.features[0].properties.TotalEmissions;

    console.log(state,year,title,epa);
    popup = new mapboxgl.Popup({ closeButton: true}).setLngLat(e.lngLat);
    popup.setHTML(`
    
    <strong style="font-size: 16px; color: #333;">${state} : ${year}</strong>
    <ul style="list-style-type: none; padding-left: 0;">
    <li><strong style="font-size: 12px; color: #333;">${title}</strong></li
        <li><strong style="font-size: 12px; color: #333;">Emission: ${parseInt(epa)}</strong></li>
    </ul>`);
popup.addTo(map);


});
