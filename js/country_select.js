//
// IMPORTANTE: REVISAR domain=.woktowalk.com
//

// elimina cookie aceptacion cookies
function w2wDeleteCookieJs(cookieName) {
  document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
  var auxDomain = document.domain;
  var auxSubdomain = auxDomain;
  if ( auxSubdomain.indexOf(".") != -1 ) auxSubdomain = auxSubdomain.substring(auxSubdomain.indexOf(".")+1);
  document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; domain = "+auxSubdomain;
}
// end


// cookie JS
function setCookie(key, value) {
var domain = document.domain;
var expires = new Date();
expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
document.cookie = key +"=" + value + ";expires=" + expires.toUTCString() + ";domain=.woktowalk.com;path=/";
//document.cookie = key +"=" + value + ";expires=" + expires.toUTCString() + ";domain=.woktowalk.dev;path=/";

// elimina cookie aceptacion cookies
w2wDeleteCookieJs("__cookieBannerShownCount");
w2wDeleteCookieJs("__cookieAccept");


}

        function getCookie(key) {
            var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
            return keyValue ? keyValue[2] : null;
        }


//setea cookies para cada boton idioma
$(document).ready(function(){
  $(".Bulgaria").click(function(){ setCookie('language','bg');});
  $(".Estonia").click(function(){ setCookie('language','et');});
  $(".France").click(function(){ setCookie('language','fr');});
  $(".Ireland").click(function(){ setCookie('language','en-ie');});
  $(".Latvia").click(function(){ setCookie('language','lv');});
  $(".Lithuania").click(function(){ setCookie('language','lt');});
  $(".Netherlands").click(function(){ setCookie('language','nl');});
  $(".Portugal").click(function(){ setCookie('language','pt-br');});
  $(".Russia").click(function(){ setCookie('language','ru');});
  $(".Spain").click(function(){ setCookie('language','es');});
  $(".UnitedKingdom").click(function(){ setCookie('language','en-gb');});
  $(".Colombia").click(function(){ setCookie('language','es-co');});
  $(".Mexico").click(function(){ setCookie('language','es-mx');});
  $(".Ecuador").click(function(){ setCookie('language','es-ec');});
  $(".USA").click(function(){ setCookie('language','en-us');});
  $(".Morocco").click(function(){ setCookie('language','fr-ma');});
  $(".SaudiArabia").click(function(){ setCookie('language','ar');});
  $(".Germany").click(function(){ setCookie('language','de');});
  $(".international").click(function(){ setCookie('language','en');});
});





$(document).ready(function(){
  $(".country-select h3").click(function(){
    $(".countrySelect").fadeIn(300);
    $(".countrySelectBG").fadeIn(300);
  });
   $(".countrySelectBG").click(function(){
    $(".countrySelect").fadeOut(100);
    $(".countrySelectBG").fadeOut(100);
  });
});


