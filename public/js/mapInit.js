//constants declerations
const locateZoom = 17;
const maxMapZoom = 19;
var curLat = 42.36556;
var curLng = -71.054;
/* Creates a map object, sets its viewpoint and zoom.
 * mymap - a reference to the map the application centers on
 */
const mymap = L.map('mainMap').setView([curLat,curLng],locateZoom);

//a boolean used to tell if whether or not the user has entered the event
//creation modal
var inModal = false;
//a boolean used to tell if the user has used their own marker to enter a
//location
var hasLocation = false;

//these variables will hold the user's selected latitute and longitude over time
var tempLat = 0;
var tempLng = 0;

//create a layer group for markers (the popup looking things)
/*
 *  Markers go inside of layers which go on top of the map.
 *  A marker would have to be added to a layer which has already been added to
 *  the map in order to be seen
 */
var sportingEvents = L.layerGroup().addTo(mymap);
var socialEvents = L.layerGroup().addTo(mymap);
var healthEvents = L.layerGroup().addTo(mymap);
var techEvents = L.layerGroup().addTo(mymap);
var academicEvents = L.layerGroup().addTo(mymap);
var marketEvents = L.layerGroup().addTo(mymap);

//global scope variable meant to be used for referencing temporary marker layers
var markerGroupUI;
//global scope variable meant to be used to reference a temporary ui marker
var markerUI;

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
 * Following functions are used to geolocate user.
 */
function locateClientUser() {
  mymap.locate({setView:true, mapZoom:locateZoom});
}
function onLocationfound(e){
  //update the ui marker so when it is needed it will be in area.
  userCreateEventMarker.setLatLng(e.latlng);
}
function onLocationError(e) {
  //TODO: Figure out a good error to displat to user when geolocation fails.
  alert("Geolocation not permited by browser");
}

/*
 * A tile layer is the lowest layer on the map. It draws on the streets and
 * objects and such. It gives the background to the map essentially.
 * Mapbox is the current provider.
 */
 L.tileLayer('https://api.mapbox.com/styles/v1/bvanzant/cjl4yucoc61iz2spncbez1txr/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnZhbmNhciIsImEiOiJjamw1bXJhdzYyb2ZrM3dsbXZiOG95dDBiIn0.M1PGjDxwxEZXEwk0r5qJEA', {
   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
   zoomControl: true,
   id: 'mapbox.streets',
   accessToken: 'pk.eyJ1IjoiYnZhbmNhciIsImEiOiJjamw1bXJhdzYyb2ZrM3dsbXZiOG95dDBiIn0.M1PGjDxwxEZXEwk0r5qJEA'
 }).addTo(mymap);
