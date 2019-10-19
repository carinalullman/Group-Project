// change test value to false will turn off all of the debugging
const test = true;

// on click listens for the click of the current location button

$('#currentLoc').on("click", function () {
  // TODO look into this function to find if we can disable to alert
  // CITATION: This function is based on geoFindMe function found at
  //https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
  //this function return an object with the lat and lon of current location

  if (test) console.log("calling getCurLocation");

  // initiallizing location object to store the results
  let location = {};

  function success(position) {
    if (test) { console.log(" success"); }
    if (test) { console.log("latitude: ", position.coords.latitude); }
    if (test) { console.log("longitude: ", position.coords.longitude); }

    location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      success: true
    }
    if (test) { console.log(" success location", location); }
    getTrails(location);
  }

  function error() {
    location = { success: false }
    console.log('Could not get location');
    return;
  }

  if (!navigator.geolocation) {
    console.log('Geolocation is not supported by your browser');
  } else {
    // broswer function? which pulllocation information and calls success or error functions 
    navigator.geolocation.getCurrentPosition(success, error);
  }
});

function getFood(trails) {
  // function to query the zomato return food results and compare with the trail results

  const apiKey = "21c7ab7121b37e5d72444b1319ca063d";
  let url = `https://developers.zomato.com/api/v2.1/`;

  let resource = "search";
  let queryString = `?lat=37&lon=-95&radius=5`;
  queryURL = (url + resource + queryString);
    console.log("queryURL: ",queryURL);

  $.ajax({
    url: queryURL,
    method: 'GET',
    headers: { 
      "user-key": apiKey, 
      "Accept": "application/json" 
    }
  }).then(function (response) {
    console.log(response);
  });
}

function getTrails(loc) {
  // function to query the zomato return food results and compare with the trail results

  if (test) console.log("In getTrails");
  if (test) console.log("getTrail arg - loc:",loc);
  // NOTICE: const is safer than var it narrows the scope for things which wont change
  const apiKey = "7047618-fda9a49f18fe64841134cbba3d429bd2";

  // input array need to be mapped to these hard coded values
  const latitude = loc.latitude;
  const longitude = loc.longitude;

  //TODO need to tie in max Distance
  const maxDistance = "50"
  const maxResults ="10";

  // uses heroku app as proxy? which provides valid server mitigating CORS error. can be slow
  const url = `https://cors-anywhere.herokuapp.com/https://www.hikingproject.com/data/`;
  const resource = "get-trails";
  let queryString = `?lat=${latitude}&lon=${longitude}&maxDistance=${maxDistance}&maxResults=${maxResults}&key=${apiKey}`;
  queryURL = (url + resource + queryString);

  // NOTICE: if does not need  {} if it is one line
  if (test) console.log("queryURL: ",queryURL);

  $.ajax({
    url: queryURL,
    method: 'GET',
    dataType: "json",
    headers: { "x-Requested-with": "xhr" }
  }).then(function (response) {
    console.log("trails reponse ",response);
    // TODO, logic here cull the response data to limit it to what we need
    getFood(response);
  }).catch(function (error) {
    console.log("error", error);
  });
}

// Listener for form dropdowns
$(document).ready(function(){
    $('select').formSelect();
});