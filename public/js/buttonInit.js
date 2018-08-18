/*
 * New form input js.
 */
$('.card').on('click', function(e) {
  e.preventDefault();
  $('.card').removeClass('active');
  $(this).addClass('active');
  $('.form').stop().slideUp();
  $('.form').delay(300).slideDown();
});


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
    if (hasLocation === false) {
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
 * Give the eventCreateButton the property:
 * when clicked check if the form is correct and if so remove the ui marker and
 * call writeUserEvent to write the data to firebase.
 */
$('#submitEvent').on('click', function(){
  if (validateEventInput()) {
    mymap.removeLayer(markerGroupUI);
    writeUserEvent();
    hasLocation=false;
    inModal=false;
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
    if (hasLocation === false){
      document.getElementById("eventCreateButtonIcon").classList.remove('fa-plus');
      document.getElementById("eventCreateButtonIcon").classList.add('fa-check');
      document.getElementById("eventCancelButton").classList.remove('invis');
      document.getElementById("eventCancelButton").classList.add('vis');
      hasLocation = true;
    }
    else {
      document.getElementById("eventCreateButtonIcon").classList.remove('fa-check');
      document.getElementById("eventCreateButtonIcon").classList.add('fa-plus');
      document.getElementById("eventCancelButton").classList.remove('vis');
      document.getElementById("eventCancelButton").classList.add('invis');
      hasLocation = false;
    }
}
