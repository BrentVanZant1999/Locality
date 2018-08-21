/*
 * mymap.options holds map settings. Setting's should be set here. Currently
 * only zooms have been set.
 */
mymap.options.minZoom = 14;
mymap.options.maxZoom = maxMapZoom;

/*
 * Enables the map to listen for location finding functions
 */
mymap.on('locationerror', onLocationError);
mymap.on('locationfound', onLocationfound);

/*
 * A tile layer is the lowest layer on the map. It draws on the streets and
 * objects and such. It gives the background to the map essentially.
 * Mapbox is the current provider.
 */
L.tileLayer('https://api.mapbox.com/styles/v1/bvanzant/cjitaouuo4toq2so62d2nn724/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnZhbnphbnQiLCJhIjoiY2ppZTZhdzh2MDZvazN3bXllOTlmYXc4aCJ9.ipjbP-7psE4EN1sVYotlsQ', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: maxMapZoom,
  id: 'mapbox.streets',
  accessToken: 'pk.eyJ1IjoiYnZhbnphbnQiLCJhIjoiY2ppZTZhdzh2MDZvazN3bXllOTlmYXc4aCJ9.ipjbP-7psE4EN1sVYotlsQ'
}).addTo(mymap);



/* creates a class that extends the leaflet Marker base class.
 * defined within this new class is a bunch of fields for information about
 * events that will need to be stored in markers.
 *  ONLY USED for EVENTS, not used as a ui marker.
 */
eventMarker = L.Marker.extend({
  options: {
      title: '',
      org: '',
      type: '',
      description:'',
      time:''
    }
});

/*
 * Icon objects go within marker objects and they are the display image of a
 * marker.
 *  Below A bunch of icon objects are created. The objects are of the class
 * L.icon. L is the leaflet global access variable.
 */
var creatingIcon = L.icon({
    iconUrl: 'css/markerCreating.png', // this icon is used for the user interface when creating events
    iconSize:     [64, 64], // size of the icon
    iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
    popupAnchor:  [32, 10] // point from which the popup should open relative to the iconAnchor
});
var academicIcon = L.icon({
    iconUrl: 'css/markerAcademic.png',
    iconSize:     [64, 64], // size of the icon
    iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
    popupAnchor:  [32, 10] // point from which the popup should open relative to the iconAnchor
});
var marketIcon = L.icon({
    iconUrl: 'css/markerMarket.png',
    iconSize:     [64, 64], // size of the icon
    iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
    popupAnchor:  [32, 10] // point from which the popup should open relative to the iconAnchor
});
var socialIcon = L.icon({
    iconUrl: 'css/markerSocial.png',
    iconSize:     [64, 64], // size of the icon
    iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
    popupAnchor:  [32, 10] // point from which the popup should open relative to the iconAnchor
});
var sportingIcon = L.icon({
    iconUrl: 'css/markerSporting.png',
    iconSize:     [64, 64], // size of the icon
    iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
    popupAnchor:  [32, 10] // point from which the popup should open relative to the iconAnchor
});
var techIcon = L.icon({
    iconUrl: 'css/markerTech.png',
    iconSize:     [64, 64], // size of the icon
    iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
    popupAnchor:  [32, 10] // point from which the popup should open relative to the iconAnchor
});

var healthIcon = L.icon({
    iconUrl: 'css/markerHealth.png',
    iconSize:     [64, 64], // size of the icon
    iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
    popupAnchor:  [32, 10] // point from which the popup should open relative to the iconAnchor
});

