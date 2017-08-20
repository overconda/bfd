$(document).ready(function(){
    var isAtBase = false;
    var isAlertBase =false; /// if yes , delay for 3 hrs to false again

    var Origin = [];
    var Destinations=[];
    var Result=[];

    var second = 1000;
    var minute = 60*1000;
    var hour = minute * 60;

    var userid = localStorage.getItem('userid');

    $.getJSON( "_get_bases.php", function( data ) {
        //console.log(data[3]['base_name']);  ////<< OK
        Destinations = data;
        localStorage.setItem('bases_data', data);

        console.log('Dest in function..');
        console.log(Destinations);
        console.log('Count Dest in getJSON : ' + Destinations.length);
        //$('#debug').text(JSON.stringify(Destinations));
        $('#debug').append('Count Dest in getJSON : ' + Destinations.length + "<br>");

        //$('#debug').text( 'Data : ' + JSON.stringify(data));
        //throw new Error('This is not an error. This is just to abort javascript');

        check_base();
        var newTimeout = 3 * minute; /// test for 5 minutes
        setInterval(check_base, newTimeout);
    });


    function check_base(){
        var options = {
            enableHighAccuracy: true,
            timeout: 30000,
            maximumAge: 0
        };

        /// change status back to not alert
        if(isAlertBase){
          isAlertBase=false;
        }



        //navigator.geolocation.getCurrentPosition(function () {}, function () {}, {});
        //$('#debug').text('Try to check_base');
        navigator.geolocation.getCurrentPosition(success, error, options);


    }

    function success(pos) {
      	var crd = pos.coords;

        Origin['lat'] = crd.latitude;
        Origin['lng'] = crd.longitude;

        //// test for mkt singha bldg
        //Origin['lat'] = '13.793269';
        //Origin['lng'] = '100.514418';


        console.log('Get geolocation... : ' + crd.latitude + ' , ' + crd.longitude);
        $('#debug').append('Get geolocation : ' + crd.latitude + ' , ' + crd.longitude + "<br>");
        //$('#debug').text('Get geolocation : ' + crd.latitude + ' , ' + crd.longitude);

        var dist = 0;
        var ret = '';


        //Destinations = localStorage.getItem('bases_data');
        console.log('Dest before cal distance');
        console.log(Destinations);
        $('#debug').append('Dest in getCurPos [suc]:' + Destinations.length + "<br>");
        //$('#debug').text('After get from localStorage : ' + JSON.stringify(Destinations));

      	for(var i = 0; i<Destinations.length; i++){
      		dist = CalculationByDistance(Origin['lat'], Origin['lng'], Destinations[i]['lat'], Destinations[i]['lng']);
      		Destinations[i]['distance'] = dist;
          console.log(dist);
          $('#debug').append('Dist:' + dist.toFixed(4) + ' Km.<br>');
          //ret += "<p>Distance from here to [" + Destinations[i]['name'] + "] = " + dist + " km.</p>";
      	}

      	///sort asc
        $('#debug').append("Check Before sort..<br>");
      	Destinations.sort(function(a,b){
      		return a['distance'] - b['distance'];
      	});
      	console.log('After SORT /////');
      	console.log(Destinations);
        $('#debug').append("Check After sort..<br>");


      	for(var i = 0; i<Destinations.length; i++){
          Result[i]=[];
      		var x = Destinations[i]['distance'];

          Result[i]['base_id'] = Destinations[i]['base_id'];
          Result[i]['base_name'] = Destinations[i]['base_name'];
          Result[i]['route_name'] = Destinations[i]['route_name'];
          Result[i]['radius'] = Destinations[i]['radius'];
          Result[i]['absolute_distance'] = Destinations[i]['distance'];
      		if(x>1){
            Result[i]['distance'] = x.toFixed(3);
            Result[i]['unit'] = "km";
      		}else{
      			x = x*1000;
            Result[i]['distance'] = x.toFixed(3);
            Result[i]['unit'] = "m";
      		}


      	}


        console.log(Result);
        //$('#debug').text('Result Array : ' + JSON.stringify(Result));




        //if(!isAlertBase){
          var newTimeout = 3 * minute; /// test for 5 minutes
          setInterval(check_base, newTimeout);


          // determine only first sorted array with its radius
          var Radius = parseFloat(Result[0]['radius'])/1000;
          var Nearest = parseFloat(Result[0]['absolute_distance']);
          console.log('R:' + Radius + ' , N:' + Nearest);
          $('#debug').append('R:' + Radius + ' KM. , N:' + Nearest + " KM.<br>");
          if(Nearest <= Radius){


            var isUnlock = false;

            userid = localStorage.getItem('userid');
            //$('#debug').text('userid=' + userid);
            $('#debug').append("_check_unlock.php?userid=" + userid + "&baseid=" + Result[0]['base_id'] + "<br>");
            $.getJSON( "_check_unlock.php?userid=" + userid + "&baseid=" + Result[0]['base_id'], function( data ) {
                //console.log(data[3]['base_name']);  ////<< OK
                var ret = data;
                console.log('check .. unlock');
                console.log(ret);
                console.log(ret['is_unlock']);
                if(ret['is_unlock']=='1'){
                  isUnlock = true;

                  /// Check Guardian of this base and store in localStorage
                  var url = "_get_current_guardian.php?baseid=" + Result[0]['base_id'];
                  console.log(url);
                  $.getJSON( url , function( dataGuardian ) {
                    var gd = dataGuardian;
                    if(gd===null){
                      localStorage.setItem('gd_username', 'No Guardian');
                      localStorage.setItem('gd_avatar', 'default');
                      localStorage.setItem('gd_score', 0);
                    }else{
                      localStorage.setItem('gd_username', gd['username']);
                      localStorage.setItem('gd_avatar', gd['avatar']);
                      localStorage.setItem('gd_score', gd['score']);
                    }

                  });
                }else{
                  isUnlock = false;
                }
                console.log(isUnlock);

                /////////////////
                /// ALOHA!!!! ///
                /////////////////
                //alert('You are in area of ' + Result[0]['base_name']  + ' \n of route: ' + Result[0]['route_name']);
                var StillOnLocation = localStorage.getItem('onLocation');

                /*
                if(StillOnLocation){
                  /// Do not alert
                }else{
                  localStorage.setItem('onLocation', true);
                  onLocation(Result[0]['base_id'],Result[0]['base_name'], Result[0]['route_name'], isUnlock);
                  setInterval( clearOnLocation, 10*minute);
                }
                */

                console.log('Calling onLocation with isUnlock = ' + isUnlock);
                localStorage.setItem('onLocation', true);
                outLocation();
                onLocation(Result[0]['base_id'],Result[0]['base_name'], Result[0]['route_name'], isUnlock);
                setInterval( clearOnLocation, 10*minute);
            });




            isAtBase = true;
            isAlertBase = true;
            console.log(isAlertBase);
          }
          /*
        }else{

          var newTimeout = 15 * second; /// 30 sec normally
          setTimeout(check_base, newTimeout);

          isAlertBase = false;
          console.log(isAlertBase);

        }
        */

    };

    function error(err) {
      /// SILENT ALL
      ////console.warn(`ERROR(${err.code}): ${err.message}`);
        //$('#output').html("<b style='color:red'>ERROR: Expired, Your device may not have Location Service</b>");
        $('#debug').text('Can not get geolocation : ' + JSON.stringify(err));
    };

    function clearOnLocation(){
      localStorage.setItem('onLocation', false);
    }


    /// loop check every 30 seconds;
    check_base(); ///// Start

    ////////////////
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
});
