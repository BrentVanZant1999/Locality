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
