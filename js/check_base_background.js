/**********************
run background
check in or out base
if IN > store in localStorage
if OUT > remove localStorage
run every 1 minute
**********************/

var intervalCheckBase;

intervalCheckBase = setInterval(getOnLocationBase, 1000*60);

function getOnLocationBase() {
  var options = {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0
  };

  console.log('try geo location');
  //navigator.geolocation.getCurrentPosition(doLocation, noLatLng, options);
  navigator.geolocation.getCurrentPosition(doLocation, noLatLng, options);

  ///callback what?
}

function doLocation(pos){
  console.log('geo success .. do function');
  var Origin = [];
  var Result=[];
  var Destinations=[];

  /// base_id is global variable

  var crd = pos.coords;

  Origin['lat'] = crd.latitude;
  Origin['lng'] = crd.longitude;

  var dist = 0;
  var ret = '';

  $.getJSON( "_get_bases.php", function( data ) {
    Destinations = data;

    for(var i = 0; i<Destinations.length; i++){
      dist = CalculationByDistance(Origin['lat'], Origin['lng'], Destinations[i]['lat'], Destinations[i]['lng']);
      Destinations[i]['distance'] = dist;
    }

    ///sort asc
    Destinations.sort(function(a,b){
      return a['distance'] - b['distance'];
    });
    console.log('done sorting');

    for(var i = 0; i<Destinations.length; i++){
      Result[i]=[];
      var x = Destinations[i]['distance'];

      Result[i]['base_id'] = Destinations[i]['base_id'];
      Result[i]['radius'] = Destinations[i]['radius'];
      Result[i]['absolute_distance'] = Destinations[i]['distance'];
    }

    base_id = 0;
    // determine only first sorted array with its radius
    var Radius = parseFloat(Result[0]['radius'])/1000;
    var Nearest = parseFloat(Result[0]['absolute_distance']);
    if(Nearest <= Radius){
      console.log('in area ... get base_id');
      base_id = Result[0]['base_id'];
    }else{
      console.log('not in area');
    }

    if(base_id == 0){
      //
      localStorage.removeItem('base_id');
    }else{
      localStorage.setItem('base_id', base_id);
    }

  });
};
function noLatLng(){
  /// do nothing
}

function CalculationByDistance( initialLat,  initialLong,  finalLat,  finalLong){
  var R = 6371; // km
  var dLat = toRadians(finalLat-initialLat);
  var dLon = toRadians(finalLong-initialLong);
  initialLat = toRadians(initialLat);
  finalLat = toRadians(finalLat);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(initialLat) * Math.cos(finalLat);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRadians(deg) {
  return deg * (Math.PI/180)
}
