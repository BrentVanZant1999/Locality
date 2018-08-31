/*
 * Constant Declerations
 */
var eventsLocationRef = firebase.database().ref('eventsLocations');
var geoFire;
var baseSearchRadius = 2;
var searchRadius = baseSearchRadius;
var filterCode = 111111;
moment().format();
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
          if (snapshot.val() != null) {
          var title = snapshot.val().title;
          var org = snapshot.val().org;
          var type = snapshot.val().type;
          var endTime = snapshot.val().endTime;
          var lat = location[0];
          var lng =  location[1];
          var description = snapshot.val().description;
          if (endTime != null) {
            createEventMarker(lat,lng,title,org,type,endTime,description);
          }
      }
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
  var timeLeft;
  var minsLeft;
  var hoursLeft;
  var timeNow = calcCurrentTime();
  var timeString = "Ending at  an Unknown Time";
  /*switch statement to handle what type of event is created.
   *super inefficient but i couldn;t get logic to work within the actual
   *marker creation
   */
  if (timeIn < timeNow ) {
    return false;
  }
  else {
     timeLeft = getRemainder(timeIn, timeNow);
     minsLeft = timeLeft%60;
     hoursLeft = Math.floor(timeLeft/60);
     switch(hoursLeft){
       case(0):
       {
         timeString = "Ending in "+minsLeft +" minutes.";
         if (minsLeft < 5){
           timeString = "Ending now.";
         }
       }
       break;
       case(1):
       {
         timeString = "Ending in over an hour";
       }
       break;
       case(2):
       {
         timeString = "Ending in over two hours";
       }
       break;
       case(3):
       {
         timeString = "Ending in over three hours";
       }
       break;
       case(4):
       {
         timeString = "Ending in over four hours";
       }
       break;
       case(5):
       {
         timeString = "Ending in over five hours";
       }
       break;
     }
  }
  switch(typeIn){
    case(1):
    {
      //create the marker object and assign reference to it
      newMarker = new eventMarker([lat, lng],{
        clickable: true,
        title: titleIn,
        org: orgIn,
        duration: timeString,
        description: descriptIn,
        icon: socialIcon
      });
      newMarker.addTo(socialEvents);
    }
    break;
    case(2):
    {
      newMarker = new eventMarker([lat, lng],{
        clickable: true,
        title: titleIn,
        org: orgIn,
        duration: timeString,
        description: descriptIn,
        icon: sportingIcon
      });
      newMarker.addTo(sportingEvents);
    }
    break;
    case(3):
    {
      newMarker = new eventMarker([lat, lng],{
        clickable: true,
        title: titleIn,
        org: orgIn,
        duration: timeString,
        description: descriptIn,
        icon: academicIcon
      });
      newMarker.addTo(academicEvents);
    }
    break;
    case(4):
    {
      newMarker = new eventMarker([lat, lng],{
        clickable: true,
        title: titleIn,
        org: orgIn,
        duration: timeString,
        description: descriptIn,
        icon: marketIcon
      });
      newMarker.addTo(marketEvents);
    }
    break;
    case(5):
    {
      newMarker = new eventMarker([lat, lng],{
        clickable: true,
        title: titleIn,
        org: orgIn,
        duration: timeString,
        description: descriptIn,
        icon: techIcon
      });
      newMarker.addTo(techEvents);
    }
    break;
    case(6):
    {
      newMarker = new eventMarker([lat, lng],{
        clickable: true,
        title: titleIn,
        org: orgIn,
        duration: timeString,
        description: descriptIn,
        icon: healthIcon
      });
      newMarker.addTo(healthEvents);
    }
    break;
  }
  newMarker.on('click', handleMarkerClick);
  return true;

}

/*
 *  Returns a string with first letter capitalized
 */
 function handleCasing(stringInput) {
   var newString = stringInput.charAt(0).toUpperCase() + stringInput.substr(1);
   return newString;
 }
/*
 * Takes a marker click event ( e == event reference when it happens)
 * and calls update event modal given the particular markers information
 * it then shows the modal with event information
 */
function handleMarkerClick(e) {
  updateEventModal(this.options.title,this.options.org,this.options.description,this.options.duration);
  $('#bottomPopup').modal('show');
}

/*
 * Takes a marker click event ( e == event reference when it happens)
 * and calls update event modal given the particular markers information
 * it then shows the modal with event information
 */
function handleSearchClick() {
//  updateSearchModal(searchRadius, filterCode);
  $('#searchModal').modal('show');
}


/*
 * Checks html elements in the event creation modal. Sends out an alert if
 * required inputs have not yet been input.
 * returns true if everything has an input.
 */
function validateEventInput() {
  var titleInput = document.getElementById("titleEventInput");
  var orgInput = document.getElementById("organizationEventInput");
  var timeInput = document.getElementById("eventDurationInput");
  var descriptionInput = document.getElementById("eventDescriptionInput");
  var typeInput = document.getElementById("eventDurationInput");
  if (typeInput.value === ""){
    alert("Event type needed");
    return false;
  }
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
  titleInput.value = handleCasing(titleInput.value);
  orgInput.value = handleCasing(orgInput.value);
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
  var durationInput = document.getElementById("eventDurationInput");
  var descriptionInput = document.getElementById("descriptionEventInput");
  var endTime = getEndTime(durationInput.value);
  var eventID = eventsRef.push ({
   title: titleInput.value,
   owner: myUserName,
   description: descriptionInput.value,
   endTime: endTime.getTime(),
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
 * Update the event modal with input information
 * Basically changes html of the modal and certain stylings
 */
function updateEventModal(title,organization,description,duration) {
  document.getElementById("eventTitle").innerHTML = title;
  document.getElementById("eventOrganization").innerHTML = organization;
  document.getElementById("eventDuration").innerHTML = duration;
 document.getElementById("eventDescription").innerHTML = description;
}

/*
 *  Return the amount of time in mins remaining in an event
 */
 function getRemainder(timeEnd, timeNow) {
   var diffMins = 0;
   var hourDiff = timeEnd - timeNow;
   diffMins = Math.floor( hourDiff / 60 / 1000);  //in ms
   return diffMins;
 }

/*
 *  return a date object which represents an end time of an event
 */
function getEndTime(minuteDuration) {
    var dateNow = new Date();
    var utc = dateNow.getTime();
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
