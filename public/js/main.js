

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
  console.log("Firing")
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
 * Creates the marker that users use to plan where there event will take place
 */
function createNewEventMarker() {
  markerGroupUI = L.layerGroup().addTo(mymap);
  markerUI = L.marker(mymap.getCenter(), {
      draggable:true,
      icon:creatingIcon
  }).addTo(markerGroupUI);
  //handle drag events
  markerUI.on('dragend', function(event){
      var userCreateEventMarker = event.target;
  });
}

/*
 * Update the event modal with input information
 * Basically changes html of the modal and certain stylings
 */
function updateEventModal(title,organization,description,type) {
  document.getElementById("eventTitlePlace").innerHTML = title;
  document.getElementById("eventOrganizationPlace").innerHTML = organization;
  document.getElementById("eventInfoDescription").innerHTML = description;
  document.getElementById("eventTypePlace").classList.remove('fa-book');
  document.getElementById("eventTypePlace").classList.remove('fa-volleyball-ball');
  document.getElementById("eventTypePlace").classList.remove('fa-tag');
  document.getElementById("eventTypePlace").classList.remove('fa-users');
  switch(type){
    case(1):
    {
      document.getElementById("eventTypePlace").classList.add('fa-users');
    }
    break;
    case(2):
    {
      document.getElementById("eventTypePlace").classList.add('fa-volleyball-ball');
    }
    break;
    case(3):
    {
      document.getElementById("eventTypePlace").classList.add('fa-book');
    }
    break;
    case(4):
    {
      document.getElementById("eventTypePlace").classList.add('fa-tag');
    }
    break;
  }
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

/*
 * Handles the user state
 * Writes user data to firebase
 * Starts querrying the database
 */
initApp = function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
       var displayName = user.displayName;
       var email = user.email;
       var uid = user.uid;
       firebase.database();
       writeUserData(uid, email, displayName);
       startDatabaseQuery();
    }
  }, function(error) {
    //TODO figure out what to do with errors... how to display to users?
    console.log(error);
  });
};

/*
 * Queries firebase for event info
 * Currently it loads all events into this (clientside application)
 * This will scale horribly if there are a ton of events and thus needs to be
 * fixed. TODO figure out a way to load events in chunks based off location
 */
function startDatabaseQuery() {
  var myUserId = firebase.auth().currentUser.uid;
  var currentEvents = firebase.database().ref('events');
  var fetchEvents = function(eventsRef) {
    eventsRef.on('child_added', function(data) {
      var title = data.val().title;
      var org = data.val().org;
      var type = data.val().type;
      var endTime = 5;  //data.val().endTime;
      var lat = data.val().lat;
      var lng = data.val().lng;
      var description = data.val().description;
      createEventMarker(lat,lng,title,org,type,endTime,description);
    });
  }
  fetchEvents(currentEvents);
}

/*
 * Creates a marker that stores value about an event.
 */
function createEventMarker(lat, lng, titleIn, orgIn, typeIn, timeIn, descriptIn){
  //create marker reference
  var newMarker;
  /*switch statement to handle what type of event is created.
   *super inefficient but i couldn;t get logic to work within the actual
   *marker creation
   */
  switch(typeIn){
    case(1):
    {
      //create the marker object and assign reference to it
      newMarker = new eventMarker([lat, lng],{
        clickable: true,
        title: titleIn,
        org: orgIn,
        type: typeIn,
        description: descriptIn,
        time: timeIn,
        icon: socialIcon //ideally logic should be here TODO check to see if this can be done.
      }).on('click', handleMarkerClick);
    }
    break;
    case(2):
    {
      newMarker = new eventMarker([lat, lng],{
        clickable: true,
        title: titleIn,
        org: orgIn,
        type: typeIn,
        description: descriptIn,
        time: timeIn,
        icon: sportingIcon
      }).on('click', handleMarkerClick);
    }
    break;
    case(3):
    {
      newMarker = new eventMarker([lat, lng],{
        clickable: true,
        title: titleIn,
        org: orgIn,
        type: typeIn,
        description: descriptIn,
        time: timeIn,
        icon: academicIcon
      }).on('click', handleMarkerClick);
    }
    break;
    case(4):
    {
      newMarker = new eventMarker([lat, lng],{
        clickable: true,
        title: titleIn,
        org: orgIn,
        type: typeIn,
        description: descriptIn,
        time: timeIn,
        icon: marketIcon
      }).on('click', handleMarkerClick);
    }
    break;
  }
  //adds the marker to the main marker group created at the beggining of this file
  newMarker.addTo(markerGroupEvents);
}

/*
 * Takes a marker click event ( e == event reference when it happens)
 * and calls update event modal given the particular markers information
 * it then shows the modal with event information
 */
function handleMarkerClick(e) {
  updateEventModal(this.options.title,this.options.org,this.options.description,this.options.type);
  $('#modalEventInfo').modal('show');
}

/*
 * Checks html elements in the event creation modal. Sends out an alert if
 * required inputs have not yet been input.
 * returns true if everything has an input.
 */
function validateEventInput() {
  var titleInput = document.getElementById("titleEventInput");
  var orgInput = document.getElementById("organizationEventInput");
  var typeInput = document.getElementById("typeEventInput") ;
  var durationInput = document.getElementById("durationEventInput");
  var descriptionInput = document.getElementById("descriptionEventInput");

  if (titleInput.value === ""){
    alert("Event title Needed.");
    return false;
  }
  else if (orgInput.value === ""){
    alert("Event organization needed.");
    return false;
  }
  else if (typeInput.value === ""){
    alert("Event type needed");
    return false;
  }
  else if (durationInput.value == 0){
    alert("Non zero hour amount needed.");
    return false;
  }
  return true;
}

/*
 * write to firebase a user created event.
 * creates local references to the database and the input elements
 * uses these references to push data to the events collection in firebase
 */
function writeUserEvent() {
  var myUserName = firebase.auth().currentUser.displayName;
  var eventsRef = firebase.database().ref('events');
  var titleInput = document.getElementById("titleEventInput");
  var orgInput = document.getElementById("organizationEventInput");
  var typeInput = document.getElementById("typeEventInput") ;
  var durationInput = document.getElementById("durationEventInput");
  var descriptionInput = document.getElementById("descriptionEventInput");
  eventsRef.push ({
   title: titleInput.value,
   owner: myUserName,
   description: descriptionInput.value,
   lat: tempLat,
   lng: tempLng,
   type: parseInt(typeInput.value),
   org: orgInput.value
});
}

/*
 * write to firebase user data passed in as arguments.
 */
function writeUserData(userId, email, displayName ) {
  firebase.database().ref('users/' + userId).set({
    username: displayName,
    email: email
  });
}

/*
 * When the page is loaded, call initApp
 */
window.addEventListener('load', function() {
  initApp();
});
