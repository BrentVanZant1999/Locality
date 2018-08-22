//get map element from DOM and set it's attributes
var mymap = L.map('mainMap').setView([42.36556, -71.054], 15);
mapbox://styles/bvanzant/cjl4yucoc61iz2spncbez1txr
L.tileLayer('https://api.mapbox.com/styles/v1/bvanzant/cjl4yucoc61iz2spncbez1txr/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnZhbmNhciIsImEiOiJjamw1bXJhdzYyb2ZrM3dsbXZiOG95dDBiIn0.M1PGjDxwxEZXEwk0r5qJEA', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  zoomControl: false,
  id: 'mapbox.streets',
  accessToken: 'pk.eyJ1IjoiYnZhbmNhciIsImEiOiJjamw1bXJhdzYyb2ZrM3dsbXZiOG95dDBiIn0.M1PGjDxwxEZXEwk0r5qJEA'
}).addTo(mymap);

//make map immovable by user so that is not distracting in the background
mymap.dragging.disable();
mymap.touchZoom.disable();
mymap.doubleClickZoom.disable();
mymap.scrollWheelZoom.disable();
mymap.boxZoom.disable();
mymap.keyboard.disable();

//show the login modal for users
$('#loginModal').modal('show');
