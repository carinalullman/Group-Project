const test = true;

$('#currentLoc').on("click", function () {
  // This function is based on geoFindMe function found at
  //https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
  //this function return an object with the lat and lon of current location
  const test = true;

  if (test) { console.log("calling getCurLocation"); }

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
    navigator.geolocation.getCurrentPosition(success, error);
  }
});

 function getFood() {
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

    console.log("In getTrails");
    console.log("loc",loc);
    const apiKey = "7047618-fda9a49f18fe64841134cbba3d429bd2";
    let url = `https://cors-anywhere.herokuapp.com/https://www.hikingproject.com/data/`;

    // input array need to be mapped to these hard coded values
    let latitude ="37";
    let longitude ="-95";
    let maxDistance ="50";
    let maxResults ="10";

    let resource = "get-trails";
    let queryString = `?lat=${latitude}&lon=${longitude}&maxDistance=${maxDistance}&maxResults=${maxResults}&key=${apiKey}`;
    // let queryString = `?lat=37&lon=-95&maxDistance=50&key=${apiKey}`;
    queryURL = (url + resource + queryString);
    console.log("queryURL: ",queryURL);

    $.ajax({
      url: queryURL,
      method: 'GET',
      dataType: "json",
      headers: { "x-Requested-with": "xhr" }
    }).then(function (response) {
      console.log("trails reponse ",response);
    }).catch(function (error) {
      console.log("error", error);
    });
  }
