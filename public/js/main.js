/*
 * Constant Declerations
 */
var eventsLocationRef = firebase.database().ref('eventsLocations');
var geoFire;
var searchRadius = 2;

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
  document.getElementById("eventTypePlace").classList.remove('fa-laptop');
  document.getElementById("eventTypePlace").classList.remove('fa-heart');
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
    case(5):
    {
      document.getElementById("eventTypePlace").classList.add('fa-laptop');
    }
    break;
    case(6):
    {
      document.getElementById("eventTypePlace").classList.add('fa-heart');
    }
    break;
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
       eventsLocationRef = firebase.database().ref('eventsLocations');
       geoFire = new GeoFire(eventsLocationRef);
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

  var geoQuery = geoFire.query({
    center: [curLat, curLng],
    radius: searchRadius
  });
  var onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location) {
    var eventRef = firebase.database().ref('events/' + key);
      eventRef.on('value', function(snapshot) {
        var title = snapshot.val().title;
        var org = snapshot.val().org;
        var type = snapshot.val().type;
        var endTime = snapshot.val().endTime;
        var lat = location[0];
        var lng =  location[1];
        var description = snapshot.val().description;
        createEventMarker(lat,lng,title,org,type,endTime,description);
      });
  });
  var onReadyRegistration = geoQuery.on("ready", function() {
    geoQuery.cancel();
  });
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
        icon: socialIcon
      });
      newMarker.bindPopup("<b>"titleIn"</b>""<br>"+descriptIn);
      newMarker.addTo(socialEvents);
    }
    break;
    case(2):
    {
      newMarker = new eventMarker([lat, lng],{
        clickable: true,
        icon: sportingIcon
      }).on('click', handleMarkerClick);
      newMarker.bindPopup("<b>"titleIn"</b>""<br>"+descriptIn);
      newMarker.addTo(sportingEvents);
    }
    break;
    case(3):
    {
      newMarker = new eventMarker([lat, lng],{
        clickable: true,
        icon: academicIcon
      }).on('click', handleMarkerClick);
      newMarker.bindPopup("<b>"titleIn"</b>""<br>"+descriptIn);
      newMarker.addTo(academicEvents);
    }
    break;
    case(4):
    {
      newMarker = new eventMarker([lat, lng],{
        clickable: true,
        icon: marketIcon
      }).on('click', handleMarkerClick);
      newMarker.bindPopup("<b>"titleIn"</b>""<br>"+descriptIn);
      newMarker.addTo(marketEvents);
    }
    break;
    case(5):
    {
      newMarker = new eventMarker([lat, lng],{
        clickable: true,
        icon: techIcon
      }).on('click', handleMarkerClick);
      newMarker.bindPopup("<b>"titleIn"</b>""<br>"+descriptIn);
      newMarker.addTo(techEvents);
    }
    break;
    case(6):
    {
      newMarker = new eventMarker([lat, lng],{
        clickable: true,
        icon: healthIcon
      }).on('click', handleMarkerClick);
      newMarker.bindPopup("<b>"titleIn"</b>""<br>"+descriptIn);
      newMarker.addTo(healthEvents);
    }
    break;
  }
  //adds the marker to the main marker group created at the beggining of this file

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
  var titleInput = document.getElementById("eventNameInput");
  var orgInput = document.getElementById("eventOrganizationInput");
  var timeInput = document.getElementById("eventDurationInput");
  var descriptionInput = document.getElementById("eventDescriptionInput");

  if (titleInput.value === ""){
    alert("Event title Needed.");
    return false;
  }
  else if (orgInput.value === ""){
    alert("Event organization needed.");
    return false;
  }
  else if (timeInput.value === ""){
    alert("End time needed");
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
  var titleInput = document.getElementById("eventNameInput");
  var orgInput = document.getElementById("eventOrganizationInput");
  var typeInput = document.getElementById("typeEventInput") ; //TODO FIX TYPE OF INPUT
  var timeInput = document.getElementById("eventDurationInput"); //TODO FIGURE OUT TIME INPUT
  var descriptionInput = document.getElementById("eventDescriptionInput");
  //one api call
  var eventID = eventsRef.push ({
   title: titleInput.value,
   owner: myUserName,
   description: descriptionInput.value,
   endTime: timeInput,
   type: parseInt(typeInput.value),
   org: orgInput.value
 }).getKey();
  //one api call
  geoFire.set(eventID, [tempLat, tempLng]).then(function() {
  console.log("Provided key has been added to GeoFire");
    }, function(error) {
  console.log("Error: " + error);
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
 *  return a date object which represents an end time of an event
 */
function getEndTime(minuteDuration) {
    var dateNow = new Date();
    var utc = dataNow.getTime();
    var endTime = moment(utc).add(minuteDuration, 'm').toDate();
    return endTime;
}
/*
 *  return a date object which represents the current time of an event
 */
function calcCurrentTime() {
    var dateNow = new Date();
    var utc = dateNow.getTime();
    return utc;
}
/*
 * When the page is loaded, call initApp
 */
window.addEventListener('load', function() {
  initApp();
});
