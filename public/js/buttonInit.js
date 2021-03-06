//get a reference to the event creation modal
var createModal = document.getElementById('eventCreateModal');
//track whether or not the user is in a modal
var inModal = false;
var createMarkerExists = false;
var userCreated = false;
/*
 * Button input handling for the event input button
 */
$('#eventInputButton').on('click', function(e) {
  e.preventDefault();
  return false;
});

/*
 * Button input handling for the event input button
 */
$('#eventSearchButton').on('click', function(e) {
  handleSearchClick();
});

/*
 * Button input handling for the close search modal button
 */
$('#closeSearch').on('click', function(e) {
  $('#searchModal').style="display:none;";
  toggleSearchGraphic();
});

/*
 * Button input handling for the update search modal button
 */
$('#updateSearch').on('click', function(e) {
  searchRadius = currentRadius;
  geoQuery = geoFire.query({
    center: [curLat, curLng],
    radius: searchRadius
  });
    toggleSearchGraphic();
      $('#searchModal').style="display:none;";
});

/*
 * Below are filter button handlers.
 */
$('#socialFade').on('click', function(e) {
  handleFilterClick(1);
});
$('#sportingFade').on('click', function(e) {
  handleFilterClick(2);
});
$('#academicFade').on('click', function(e) {
  handleFilterClick(3);
});
$('#marketFade').on('click', function(e) {
  handleFilterClick(4);
});
$('#techFade').on('click', function(e) {
  handleFilterClick(5);
});
$('#healthFade').on('click', function(e) {
  handleFilterClick(6);
});

/*
 * Get references to the duration slider and input elements
 */
 var durationSlider = document.getElementById("eventDurationInput");
 var displaySlider = document.getElementById("displayDuration");

 /*
  *  Handle changing user input on the search radius slider.
  */
 var minutesInput = durationSlider.value;
 var hoursDisplay = Math.floor(minutesInput/60);
 var minutesDisplay = (minutesInput%60);
 if (hoursDisplay > 0){
   if (minutesDisplay != 0) {
     if (hoursDisplay < 2) {
       displaySlider.innerHTML = "("+ hoursDisplay+" hour and " + minutesDisplay +" minutes."+")";
     }
     else {
       displaySlider.innerHTML = "("+hoursDisplay+" hours and " + minutesDisplay +" minutes."+")";
     }
   }
   else {
     if (hoursDisplay < 2) {
       displaySlider.innerHTML = "("+hoursDisplay+" hour."+")";
     }
     else {
       displaySlider.innerHTML = "("+hoursDisplay+" hours."+")";
     }
   }
 }
 else {
   displaySlider.innerHTML = "("+minutesDisplay+" minutes."+")";
 }
 // Update the current slider value (each time you drag the slider handle)
 durationSlider.oninput = function() {
   minutesInput = durationSlider.value;
   hoursDisplay = Math.floor(minutesInput/60);
   minutesDisplay = (minutesInput%60);
   if (hoursDisplay > 0){
     if (minutesDisplay != 0) {
       if (hoursDisplay < 2) {
         displaySlider.innerHTML = "("+ hoursDisplay+" hour and " + minutesDisplay +" minutes."+")";
       }
       else {
         displaySlider.innerHTML = "("+hoursDisplay+" hours and " + minutesDisplay +" minutes."+")";
       }
     }
     else {
       if (hoursDisplay < 2) {
         displaySlider.innerHTML = "("+hoursDisplay+" hour."+")";
       }
       else {
         displaySlider.innerHTML = "("+hoursDisplay+" hours."+")";
       }
     }
   }
   else {
     displaySlider.innerHTML = "("+minutesDisplay+" minutes."+")";
   }

 }

/*
 * Give the locator button the property:
 * when clicked - call funtion locateClientUser()
 */
$('#locator').on('click', function(){
  locateClientUser();
});

/*
 * Give the eventCreateButton  the property:
 * when clicked while in the event creation modal do nothing
 * when not in the modal check to see if a location has been locationfound
 * and if so show the modal. If not prompt user to setup a location.
 */
$('#eventCreateButton').on('click', function(){
  if (inModal === false) {
    if (createMarkerExists === false) {
      createNewEventMarker();
      toggleButtons();
    }
    else {
      $('#eventCreateModal').modal('show');
      var latLng = markerUI.getLatLng();
      tempLng = latLng.lng;
      tempLat = latLng.lat;
      inModal = true;
      toggleButtons();
    }
  }
});

/*
 * Give the eventCreateButton  the property:
 * when clicked remove the ui layer and exit the event creation process.
 */
$('#cancelEventCreation').on('click', function(){
  mymap.removeLayer(markerGroupUI);
  hasLocation=false;
  inModal=false;
});

/*
 *  Placeholder
 */
$('#eventDeleteButton').on('click', function(){
  /*
   * Handles Event Deletion
   */
});

/*
 * Give the eventCreateButton the property:
 * when clicked check if the form is correct and if so remove the ui marker and
 * call writeUserEvent to write the data to firebase.
 */
$('#submitEvent').on('click', function(){
  if (validateEventInput()) {
    mymap.removeLayer(markerGroupUI);
    console.log("Here");
    writeUserEvent();
    console.log("Here");
    document.getElementById("eventCreateButton").classList.add('invis');
    document.getElementById("eventCreateButton").classList.remove('vis');
    document.getElementById("eventDeleteButton").classList.add('vis');
    document.getElementById("eventDeleteButton").classList.remove('invis');
    console.log("And here");
    hasLocation=false;
    inModal=false;
  }
  else {
    return false;
  }
});

/*
 * Give the eventCreateButton the property:
 * when clicked call the cancel button function
 */
$('#eventCancelButton').on('click', function(){
  cancelButton();
});

/*
 * Change the buttons display back to the normal display and remove the ui
 * marker
 */
function cancelButton(){
  toggleButtons();
  mymap.removeLayer(markerGroupUI);
  inModal = false;
  hasLocation = false;
}

/*
 * function to toggle buttons
 * works by removing styles and adding styles to make the buttons match whatever
 * functionality they are supposed to have at any given time.
 */
function toggleButtons(){
    if (createMarkerExists === false){
      document.getElementById("eventCreateButtonIcon").classList.remove('fa-plus');
      document.getElementById("eventCreateButtonIcon").classList.add('fa-check');
      document.getElementById("eventSearchButton").classList.add('invis');
      document.getElementById("eventSearchButton").classList.remove('vis');
      document.getElementById("eventCancelButton").classList.remove('invis');
      document.getElementById("eventCancelButton").classList.add('vis');
      createMarkerExists = true;
    }
    else {
      document.getElementById("eventCreateButtonIcon").classList.remove('fa-check');
      document.getElementById("eventCreateButtonIcon").classList.add('fa-plus');
      document.getElementById("eventSearchButton").classList.add('vis');
      document.getElementById("eventSearchButton").classList.remove('invis');
      document.getElementById("eventCancelButton").classList.remove('vis');
      document.getElementById("eventCancelButton").classList.add('invis');
      createMarkerExists = false;
    }
}
