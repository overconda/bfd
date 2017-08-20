jQuery(document).ready(function(){

  var timeonLoad = 1300;
  /* =============================================
  Splash page and on location animation setting
  ================================================ */
  window.pinAnimate = function() {
    $('.pin-location').addClass("pinEnable");
    $('.singha-bottle').addClass("bottleAnimate");

    var pinCallback = function (pinNotify) {
      setTimeout(function(){
        pinNotify.play(-1);
      }, 200);
    };

    var pinLocation = document.getElementsByClassName("pin-location");

    for (var i = pinLocation.length - 1; i >= 0; i--) {
      new Vivus(pinLocation[i], {
        type: 'delayed',
        duration: 100,
        animTimingFunction: Vivus.EASE_OUT,
        onReady: function (pinNotify) {
          pinNotify.el.setAttribute('width', '100%');
          pinNotify.el.setAttribute('height', '100%');
        }
      }, pinCallback);
    }

    var timeLoop = setTimeout(function(){
      pinAnimate();
    }, 4200);

    if($('body').hasClass('clear_pin')) {
      clearTimeout(timeLoop);
      $('.singha-bottle').removeClass("bottleAnimate");
    }
  }

  window.onLocation = function(base_id, base_name, base_route, isUnlock) {

    //// clear
    //outLocation();

    var disableLocation = $('.login-front');

    disableLocation.addClass("disable-location");
    $('body').removeClass("clear_pin");
    $('body').append('<div class="onlocation-section"></div>');


    ///////////////////////xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    ///////////////////////xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    if($('body').find('.onlocaton-section').length !== 0){
      console.log('FIND onlocaton-section found');
    }else{
      console.log('FIND onlocation-section NOT found');
    }
    ////////// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    ////////// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx


    //$('.disable-location .onlocation-section').remove();

    var fileName = "";
    console.log('isUnlock in Location.onLocation : ' + isUnlock);
    if(isUnlock){
      fileName = "on-location-challenge.html";
    }else{
      fileName = "on-location.html";
    }

    //$('.onlocation-section').load('on-location.html', function() {
    $('.onlocation-section').load(fileName, function() {

      $('.onlocation-chal-base').html(base_name + '<span>is seizing by</span>');
      //$('.on-location-meta span').html(base_route);
      if(isUnlock){
        //$('#base').attr("href", "unlocked.html?base_id=" + base_id);
        var avt = localStorage.getItem('gd_avatar');
        //Avatar
        if(avt != 'default'){
          $('.img-fit').attr('src',avt);
        }

        $('.onlocation-chal-name').text(localStorage.getItem('gd_username'));
        $('.gd_score').html(localStorage.getItem('gd_score') + '<span>Points</span>');
        //$('.gd_time').text(localStorage.getItem('gd_time'));

        $('#challenge-now').attr('href', 'guardian-quizzes.html?base_id=' + base_id);
        $('#more').attr('href', 'unlocked.html?base_id=' + base_id);
      }else{
        $('#base').attr("href", "unlock.html?base_id=" + base_id);
        $('.on-location-name').text(base_name);
        $('.on-location-meta').text(base_route);
      }

      var locationNotify = $('#on-location-notify'),
        notifyClose = locationNotify.find('.btn-close'),
        onLocationHeading1 = $('.on-location-box h1 span:first-child'),
        onLocationHeading2 = $('.on-location-box h1 span:last-child'),
        onLocationgroup = $('.on-location-group'),
        onLocationIcon = $('#on-location-icon');


      if(!$('body').hasClass('full-page')) {
        var pinIconsm = $(this).find('#on-location-icon').detach();
        $('#content-wrapper').after(pinIconsm);
        console.log('[ONLO] body has no full-page');
      }else{
        onsole.log('[ONLO] body has full-page');
      }


      /* ===== Check localStorage ===== */
      if($('body').hasClass('localStorage')) {
        $('body').addClass("clear_pin");
        locationNotify.hide();
        setTimeout(function(){
          onLocationIcon.addClass("pinShow");
        }, timeonLoad + 300);
        setTimeout(function(){
          onLocationIcon.addClass("pinMove");
        }, timeonLoad + 700);
      }
      /* ===== Check localStorage END ===== */


      setTimeout(function(){
        locationNotify.addClass("zoomInCustom");
        onLocationHeading1.addClass("bounceInLeft").css("opacity", "1");
        onLocationHeading2.addClass("bounceInRight").css("opacity", "1");
        onLocationgroup.addClass("fadeIn").css("opacity", "1");
      }, timeonLoad);


      setTimeout(function(){
        pinAnimate();
      }, timeonLoad + 500);

      notifyClose.on( "click", function(e) {
        e.preventDefault();
        $('body').addClass("clear_pin");
        locationNotify.removeClass("zoomInCustom");
        locationNotify.addClass("zoomOutCustom");
        onLocationIcon.removeClass("pinRemove");

        setTimeout(function(){
          onLocationIcon.addClass("pinShow");
        }, 300);
        setTimeout(function(){
          onLocationIcon.addClass("pinMove");
        }, 700);
      });

      onLocationIcon.on( "click", function() {
        $('body').removeClass("clear_pin");
        $(this).removeClass("pinShow pinMove");
        $(this).addClass("pinRemove");
        locationNotify.show();
        locationNotify.removeClass("zoomOutCustom");
        locationNotify.addClass("zoomInCustom");
        setTimeout(function(){
          pinAnimate();
        }, 500);
      });

    });
  }

  window.outLocation = function() {
    console.log('**** Out location ****');
    $('body').addClass("clear_pin");
    $('#on-location-notify').removeClass("zoomInCustom");
    $('#on-location-notify').addClass("zoomOutCustom");
    $('#on-location-icon').removeClass("pinShow pinMove");
    $('#on-location-icon').addClass("pinRemove");
    setTimeout(function(){
        $('.onlocation-section, #on-location-icon').remove();
    }, 1000);
  }
});
