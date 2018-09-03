/*
 * Constant Declerations
 */
var eventsLocationRef = firebase.database().ref('eventsLocations');
var geoFire;
var baseSearchRadius = 1; //in kilometers
var searchRadius = baseSearchRadius;
var currentRadius = searchRadius;
var filterCode = 111111;
var radiusGroup = L.featureGroup();
var circle;
var academicSelected = true;
var socialSelected = true;
var sportingSelected = true;
var marketSelected = true;
var techSelected = true;
var healthSelected = true;
var showRadius = false;
//initalize moment javascript formatting
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
var geoQuery;
/*
 * Queries firebase for event info
 */
function startDatabaseQuery() {
  geoQuery = geoFire.query({
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
 * Takes a searcher click event
 * and calls update search modal given the current information
 */
function handleSearchClick() {
  //  updateSearchModal(searchRadius, filterCode);
  toggleSearchGraphic();
  $('#searchModal').modal('show');
}

/*
 * Handles the event of a filter button being clicked.
 * Updates what layers are drawn to the leaflet map based
 * of which buttons where clicked.
 */
function handleFilterClick(inputClick) {
  //  updateSearchModal(searchRadius, filterCode);
  // toggleSearchGraphic();
  var selectedButton;
  var selectedIcon;
  var isSelected;
  if (inputClick == 1) {
    selectedButton = document.getElementById("socialFade");
    selectedIcon = document.getElementById("socialIcon");
    if (socialSelected == true) {
      mymap.removeLayer(socialEvents);
    }
    else {
      socialEvents.addTo(mymap);
    }
    isSelected = socialSelected;
    socialSelected = !socialSelected;
  }
  else if (inputClick == 2) {
    selectedButton = document.getElementById("sportingFade");
    selectedIcon = document.getElementById("sportingIcon");
    if (sportingSelected == true) {
      mymap.removeLayer(sportingEvents);
    }
    else {
      sportingEvents.addTo(mymap);
    }
    isSelected = sportingSelected;
    sportingSelected = !sportingSelected;
  }
  else if (inputClick == 3) {
    selectedButton = document.getElementById("academicFade");
    selectedIcon = document.getElementById("academicIcon");
    if (academicSelected == true) {
      mymap.removeLayer(academicEvents);
    }
    else {
      academicEvents.addTo(mymap);
    }
    isSelected = academicSelected;
    academicSelected = !academicSelected;
  }
  else if (inputClick == 4) {
    selectedButton = document.getElementById("marketFade");
    selectedIcon = document.getElementById("marketIcon");
    if (marketSelected == true) {
      mymap.removeLayer(marketEvents);
    }
    else {
      marketEvents.addTo(mymap);
    }
    isSelected = marketSelected;
    marketSelected = !marketSelected;
  }
  else if (inputClick == 5) {
    selectedButton = document.getElementById("techFade");
    selectedIcon = document.getElementById("techIcon");
    if (techSelected == true) {
      mymap.removeLayer(techEvents);
    }
    else {
      techEvents.addTo(mymap);
    }
    isSelected = techSelected;
    techSelected = !techSelected;
  }
  else if (inputClick == 6) {
    selectedButton = document.getElementById("healthFade");
    selectedIcon = document.getElementById("healthIcon");
    if (healthSelected == true) {
      mymap.removeLayer(healthEvents);
    }
    else {
      healthEvents.addTo(mymap);
    }
    isSelected = healthSelected;
    healthSelected = !healthSelected;
  }
  if (isSelected == true) {
    selectedButton.classList.remove('button-selected-option');
    selectedButton.classList.add('button-option');
    selectedIcon.classList.remove('selected');
    selectedIcon.classList.add('unselected');
  }
  else {
    selectedButton.classList.remove('button-option');
    selectedButton.classList.add('button-selected-option');
    selectedIcon.classList.remove('unselected');
    selectedIcon.classList.add('selected');
  }
}




/*
 * Checks if a cirle layer is defined on the map.
 * If it is it gets removed if not a circle layer is added.
 */
function toggleSearchGraphic() {
  if (circle != undefined) {
     mymap.removeLayer(circle);
     circle = undefined;
   }
   else {
     circle = L.circle([curLat, curLng], {
         color: 'white',
         fillColor: 'white',
         fillOpacity: 0.2,
         radius: currentRadius*1000
     }).addTo(mymap);
   }
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
