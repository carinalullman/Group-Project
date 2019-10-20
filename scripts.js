// change test value to false will turn off all of the debugging
const test = true;

// on click listens for the click of the current location button

$('#currentLoc').on("click", function () {
  // TODO look into this function to find if we can disable to alert
  // CITATION: This function is based on geoFindMe function found at
  //https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
  //this function return an object with the lat and lon of current location

  if (test) console.log("in getCurLocation");

  // initiallizing location object to store the results
  let location = {};

  function success(position) {
    if (test) { console.log(" success"); }
    if (test) { console.log("  latitude: ", position.coords.latitude); }
    if (test) { console.log("  longitude: ", position.coords.longitude); }

    location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      success: true
    }
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

function getDistance(currentLat, currentLon, trailLat, trailLon) {
  return Math.sqrt(Math.pow(currentLat - trailLat, 2) + Math.pow(currentLon - trailLon, 2));
}
function getFood(trailsObj) {
  // function to query the zomato return food results and compare with the trail results

  let trailsArr = trailsObj.trails;
  if (test) console.log("in getFood");
  if (test) console.log(" getFood arg trails:", trailsObj);
  if (test) console.log(" trails.length:", trailsArr.length);

  // these variables are here since they dont change each time through the loop
  const apiKey = "21c7ab7121b37e5d72444b1319ca063d";
  let url = `https://developers.zomato.com/api/v2.1/search`;
  // need to get value of selected option and convert from miles to meters (approximate)
  const radius = parseInt($('#distanceToFood').val()) * 1600;
  if (test) console.log(" radius", radius);

  // these could be pulled from the form if we want to get fancy
  const srt = "real_distance";
  const odr = "asc";
  const cusine = "mex"; // sticking with tacos, may need to change if not enough results
  const cnt = "5"; // sticking with tacos, may need to change if not enough results

  // loop through all the entries in the trail array
  // trails.forEach( function(e) {
  for (let i = 0; i < trailsArr.length; i++) {
    if (test) console.log(" considering trail:", trailsArr[i]);
    // pulling out information we need into new variables so I dont accedenatlly change the original data source
    const trailLat = trailsArr[i].latitude;
    const trailLon = trailsArr[i].longitude;
    const trailCity = trailsArr[i].location;  // maybe this would be an option

    let queryString = `?q=${cusine}&lat=${trailLat}&lon=${trailLon}&radius=${radius}&sort=${srt}&order=${odr}&count=${cnt}`;
    // let queryString = `?lat=${trailLat}&lon=${trailLon}&radius=${radius}`;
    queryURL = (url + queryString);
    console.log(" queryURL: ", queryURL);

    $.ajax({
      url: queryURL,
      method: 'GET',
      headers: {
        "user-key": apiKey,
        "Accept": "application/json"
      }
    }).then(function (response) {
      if (test) console.log(" in zomato response");
      if (test) console.log("  zomato response", response);

      // need to associate results
      if (test) console.log("   trail id", trailsArr[i].id);
      // returning first restaurant name
      if (test) console.log("   restaurant name", response.restaurants[0].restaurant.name);
    });
  }

  // call draw result this is going to be a race condition.
  // how do we get all the results back before we draw?
}

function getTrails(loc) {
  // function to query the zomato return food results and compare with the trail results

  if (test) console.log("In getTrails");
  if (test) console.log("getTrail arg - loc:", loc);
  // NOTICE: const is safer than var it narrows the scope for things which wont change
  const apiKey = "7047618-fda9a49f18fe64841134cbba3d429bd2";

  // input array need to be mapped to these hard coded values
  const latitude = loc.latitude;
  const longitude = loc.longitude;

  //TODO need to tie in max Distance
  const maxDistance = "50"
  const maxResults = "10";

  // uses heroku app as proxy? which provides valid server mitigating CORS error. can be slow
  const url = `https://cors-anywhere.herokuapp.com/https://www.hikingproject.com/data/`;
  const resource = "get-trails";
  let queryString = `?lat=${latitude}&lon=${longitude}&maxDistance=${maxDistance}&maxResults=${maxResults}&key=${apiKey}`;
  queryURL = (url + resource + queryString);

  // NOTICE: if does not need  {} if it is one line
  if (test) console.log("queryURL: ", queryURL);

  $.ajax({
    url: queryURL,
    method: 'GET',
    dataType: "json",
    headers: { "x-Requested-with": "xhr" }
  }).then(function (response) {
    let trails = response.trails; // Array of trails
    for (let index = 0; index < trails.length; index++) {
      const trail = trails[index];

      let d = getDistance(loc.latitude, loc.longitude, trail.latitude, trail.longitude);
      let miles = d * 69; // ~69 miles is 1 lat/long degree difference (approximate)
      trail.distance = parseFloat(miles.toFixed(1)); // make miles only 1 decimal point
    }

    console.log("trails reponse ", response);
    // TODO, logic here cull the response data to limit it to what we need
    getFood(response);
  }).catch(function (error) {
    console.log("error", error);
  });
}

function drawResults(trailName, distToTrail, trailLength, elevGain, trailLink,
  restName, distToRest, starsOnYelp, typeOfFood, restLink) {
  let newRow = document.createElement('div');
  newRow.className = "row";

  let existingRow = $(".row")[4]; // get the existing row from the HTML
  let html = existingRow.innerHTML; // original HTML

  // Replace all the old text with new values
  html = html.replace('Trail Name', 'Trail Name: ' + trailName);
  html = html.replace('Dist to trail', 'Dist to trail: ' + distToTrail);
  html = html.replace('Trail Length', 'Trail Length: ' + trailLength);
  html = html.replace('Elev Gain', 'Elev Gain: ' + elevGain);
  html = html.replace('#">Link to H-Proj', trailLink + '">Link to H-Proj');

  html = html.replace('Restaurant Name', 'Restaurant Name: ' + restName);
  html = html.replace('Dist to restaurant', 'Dist to restaurant: ' + distToRest);
  html = html.replace('Stars on yelp', 'Stars on yelp: ' + starsOnYelp);
  html = html.replace('Type of food', 'Type of food: ' + typeOfFood);
  html = html.replace('#">Link to Restaurant', restLink + '">Link to Restaurant');

  newRow.innerHTML = html;

  $('.container')[0].appendChild(newRow)
}

// Listener for form dropdowns
$(document).ready(function () {
  $('select').formSelect();
});