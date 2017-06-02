//    Cookie Consent Javascript Banner
//    Copyright 2013 Raul Alvarez r a u l . a l v a r e z @ g m a i l . c o m
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU Lesser General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU Lesser General Public License for more details.
//    You should have received a copy of the GNU Lesser General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.

var __cookieLawBannerPosition = "bottom"; // "top" o "bottom"

var __cookieLawCookiePolicyUrl = {
	ca: '/cookies-policy/'
	,es: '/es/politica-de-cookies/'
	,en: '/cookies-policy/'
	,fr: '/fr/politique-liee-aux-cookies/'
	,nl: '/nl/cookiebeleid/'
	,bg: '/bg/cookies-policy/'
	,et: '/et/kupsisekasutus/'
	,lv: '/lv/cookies-politika/'
	,lt: '/lt/cookies-policy/'
	,pt: '/pt-br/politica-de-cookies/'
	,ru: '/ru/cookies-policy/'
	,ar: '/ar/cookies-policy-6/'
	,de: '/de/bestimmungen-zu-cookies/'

};

var __cookieLawTextWarning = {
	ca: 'Fem servir cookies pr&ograve;pies i de tercers per millorar aquest web, recollir i analitzar dades d&acute;acc&eacute;s, incloure funcions socials i oferir publicitat basada en els seus h&agrave;bits de navegaci&oacute;. Si fa clic al bot&oacute; ACCEPTAR o segueix navegant considerem que accepta. Per canviar la configuraci&oacute; i obtenir m&eacute;s informaci&oacute;:'
	,es: '&iexcl;Hola! S&iacute;, otra vez el rollo de las cookies... &iexcl;Lo sentimos!<br>Vamos al grano: utilizamos cookies propias y de terceros para tu comodidad y para que la web vaya sobre ruedas, incluyendo anal&iacute;ticas web, compartir en redes sociales y publicidad adaptada a tus h&aacute;bitos de navegaci&oacute;n. Si haces clic en ACEPTAR o si sigues utilizando la web no te molestaremos m&aacute;s con este mensaje porque entenderemos que aceptas esta utilizaci&oacute;n de las cookies conforme a nuestra pol&iacute;tica de cookies. As&iacute; podremos ofrecerte un mejor servicio cada vez que visites nuestra web. &iexcl;Gracias!'
	,en: 'Hey! Yeah, the boring cookie message again... Sorry!<br>So, to cut it short, we use first and third-party cookies to improve your experience, including web analytics, sharing in social networks and customized advertisements based in your browsing behaviour. If you click on accept or keep using the website, we won\'t bother you with this message again because we\'ll understand you accept our cookie policy. This way, every time you visit this site you\'ll get a better service from our side. Thanks!'
	,fr: 'Nous utilisons premier et troisi&egrave;me cokies pour am&eacute;liorer ce web, collecter et analyser les donn&egrave;es d&#39;acc&eacute;s, incluons des fonctions sociales et montrons des annonces en fonction de vos habitudes de navigation. Si vous continuer &agrave; naviguer, nous supposons que vous acceptez. Pour modifier la configuration et plus d&#39;informations:'
	,nl: 'Hé! Ja, ja, hier is weer zo\'n saai berichtje over cookies... Sorry! Kort gezegd gebruiken we cookies om ervoor te zorgen dat je deze website beter kunt gebruiken. Als je akkoord gaat met het gebruik van cookies, zullen we je verder niet meer lastigvallen met dit bericht. We begrijpen dan dat je ons cookiebeleid wel oké vindt. Je weet dan zeker dat onze service aan jou bij elk bezoek aan de website iets beter kan worden. Dank je wel!'
	,bg: 'Хей! Да, скучното съобщение на бисквитката отново ... Съжалявам! Така че, на кратко, ние използваме бисквитки, за да подобрим вашият опит. Ако кликнете върху приемам, няма да ви занимаваме с това съобщение отново, защото ще разберем, че сте съгласни с нашата политика на бисквитката. По този начин, всеки път, когато посетите този сайт, вие ще получавате по-добро обслужване от наша страна. Благодаря!'
	,et: 'Hei! Jah, ikka seesama tüütu küpsiseteade... Vabandust!Ühesõnaga, meie kasutame su külastuse täiustamiseks küpsiseid. Kui klõpsad heakskiitval nupul, ei kiusa me sind enam selle sõnumiga, sest saame teada, et sinu poolest on meie küpsisekasutus OK. Nii saad iga kord külastades meilt parima teenuse. Aitäh!'
	,lv: 'Hey! Jā, atkal šī kaitinošā ziņa par "cookie"... Piedod! Īsāk sakot, mēs lietojam "cookies" savas pieredzes uzlabošanai. Ja Tu nospiedīsi "Piekrītu", mēs Tevi vairs netraucēsim ar šo ziņu, jo uzskatīsim, ka Tu piekrīti mūsu "cookie" noteikumiem. Šādā veidā mēs uzlabosim savu mājas lapu ikreiz, kad Tu to apmeklēsi. Paldies!'
	,lt: 'Ei! Taip, ir vėl nuodobi žinutė apie sausainiukus… Nepyk!Taigi, trumpai šnekant, mes naudojame sausainiukus, kad pagerintumėm jūsų patirtį. Jei paspausite sutinku, nebeerzinsime jūsų su šia žinute, nes žinosime, kad jūs sutinkate su mūsų sausainiukų politika. Tokiu būdų, kaskart apsilankydami mūsų puslapyje iš mūsų pusės gausite geresnias paslaugas. Ačiū!'
	,pt: 'Olá! Sim, é a mensagem chata sobre os cookies outra vez... Pedimos desculpa! Então, para resumir, usamos cookies para melhorar a sua experiência. Se clicar em OK, não voltamos a aborrecê-lo com esta mensagem porque ficamos a saber que concorda com a nossa política de cookies. Assim, sempre que visitar este site vai receber um serviço melhor da nossa parte. Obrigado!'
	,ru: 'Ну да, опять это скучное сообщение про сооkie. Сорри! Короче говоря, мы используем cookie файлы для вашего удобства.  Если вы зашли в этот раздел, мы больше не будем утомлять вас этим сообщением, потому что решили, что вы согласны с нашей политикой. То есть теперь сервис на этом сайте для вас будет лучше! Спасибо!'
	,ar: 'الة الوجبة مرة أخرى آسف! لذا باختصار نستخدم الوجبات (كوكيز- لزيادة خبرتك إذا ما ضغطت على مفتاح موافق فلن نضايقك مرة أخرى بهذه الرسالة لأننا سوف نفهم أنك ترغب في تفضيل المنتج من الطعام وبهذه الطريقة سوف تحصل على خدمة أفضل عند زيارتك في كل '
	,de: 'Hey! Hier noch ein paar langweilige Informationen über Cookies…Entschuldigung! So, um es kurz zu machen, wir nutzen Cookies um Deine Erfahrungen im Netz zu verbessern. Wenn Du auf „akzeptieren“ klickst, werden wir Dich nicht mehr mit diesen Informationen belästigen, da Du dann mit unseren Bestimmungen zu Cookies einverstanden bist. Auf diese Weise bekommst Du bei jedem Besuch unserer Seite, einen besseren Service von uns. Danke!'
}

var __cokieLawTextPolCookiesName = {
	ca: 'pol&iacute;tica de cookies'
	,es: 'M&aacute;s informaci&oacute;n: pol&iacute;tica de cookies'
	,en: 'More information: cookies policy'
	,fr: 'politique li&eacute;e aux cookies'
	,nl: 'cookiebeleid'
	,bg: 'Политика на Бисквитката'
	,et: 'Küpsisekasutus'
	,lv: 'Cookies politika'
	,lt: 'Sausainiukų Politika'
	,pt: 'Política de Cookies'
	,ru: 'Политика Cookie-файлов'
	,ar: 'شروط تفضيل الوجبات'
	,de: 'Bestimmungen zu Cookies'
};

var __cokieLawTextAccept = {
	ca: 'Acceptar'
	,es: 'Aceptar'
	,en: 'Accept'
	,fr: 'Accepter'
	,nl: 'Aanvaarden'
	,bg: 'приемам'
	,et: 'aktsepteerima'
	,lv: 'akceptēt'
	,lt: 'Priimkite'
	,pt: 'Aceitar'
	,ru: 'принимать'
	,ar: 'قبول'
	,de: 'Akzeptieren'
};

var __cokieLawTextReject = {
	ca: 'Rebutjar'
	,es: 'Rechazar'
	,en: 'Reject'
	,fr: 'Rejeter'
	,nl: 'Reject'
	,bg: 'Reject'
	,et: 'Reject'
	,lv: 'Reject'
	,lt: 'Reject'
	,pt: 'Reject'
	,ru: 'Reject'
	,ar: 'Reject'
	,de: 'Reject'
};

// idioma
// este metodo debe personalizarse en base al funcionamiento idiomatico de la pagina
function __getCookieLawLang() {
	if ( window.location.href.indexOf("/ca/") != -1 ) return 'ca';
	else if ( window.location.href.indexOf("/es/") != -1 ) return 'es';
	else if ( window.location.href.indexOf("/fr/") != -1 ) return 'fr';
	else if ( window.location.href.indexOf("/nl/") != -1 ) return 'nl';
	else if ( window.location.href.indexOf("/bg/") != -1 ) return 'bg';
	else if ( window.location.href.indexOf("/et/") != -1 ) return 'et';
	else if ( window.location.href.indexOf("/lv/") != -1 ) return 'lv';
	else if ( window.location.href.indexOf("/lt/") != -1 ) return 'lt';
	else if ( window.location.href.indexOf("/pt/") != -1 ) return 'pt';
	else if ( window.location.href.indexOf("/ru/") != -1 ) return 'ru';
	else if ( window.location.href.indexOf("/ar/") != -1 ) return 'ar';
	else if ( window.location.href.indexOf("/de/") != -1 ) return 'de';

	else return 'en';
}



// src banner cookies /////////////////////////////////////////////////////////

var __cookieLawBannerDivId = "cookieLawBannerId";
var __cookieLawCookieBannerShownCountName = "__cookieBannerShownCount";
var __cookieLawCookieAcceptName = "__cookieAccept";
var __cookieLawCountBeforeAccept = 1;

function __showCookieBanner() {
	var divCookieAlert = document.getElementById(__cookieLawBannerDivId);
	if ( divCookieAlert == null ) {
		divCookieAlert = document.createElement("div");
		divCookieAlert.id = __cookieLawBannerDivId;
		divCookieAlert.className = "cookieLawBox";
		divCookieAlert.style.width = "auto";
		divCookieAlert.style.boxSizing = "border-box";
		divCookieAlert.style.padding = "10px 10px 10px 10px";
		divCookieAlert.style.position = "fixed";
		// paso a css: divCookieAlert.style.textAlign = "center";
		if ( __cookieLawBannerPosition == "top" ) {
			divCookieAlert.style.top = "0px";
		} else if ( __cookieLawBannerPosition == "bottom" ) {
			divCookieAlert.style.bottom = "0px";
		}
		divCookieAlert.style.left = "0px";
		divCookieAlert.style.right = "0px";
		divCookieAlert.innerHTML = "";
		divCookieAlert.innerHTML += "<div style=\"display:table-cell;vertical-align:middle\">"+__cookieLawTextWarning[__getCookieLawLang()]+" <a class=\"cookieLawAnchor\" href=\"javascript:__doCookieLawInfo()\">"+__cokieLawTextPolCookiesName[__getCookieLawLang()]+"</a></div>";
		divCookieAlert.innerHTML += "<div style=\"display:table-cell;vertical-align:middle\"><a class=\"cookieLawButton cookieLawButtonAccept\" style=\"margin-left: 20px; float: right; \" href='javascript:__doCookieLawAccept()'>"+__cokieLawTextAccept[__getCookieLawLang()]+"</a></div>";
		//divCookieAlert.innerHTML += "<div style=\"display:table-cell;vertical-align:middle\"><a class=\"cookieLawButton cookieLawButtonDeny\" style=\"margin-left: 20px; float: right; \" href='javascript:__doCookieLawDeny()'>"+__cokieLawTextReject[__getCookieLawLang()]+"</a></div>";
		document.body.appendChild(divCookieAlert);
	}
	// TODO que pasa si no hay firstFchild
}

function __hideCookieBanner() {
	var divCookieAlert = document.getElementById(__cookieLawBannerDivId);
	if ( divCookieAlert != null ) {
		divCookieAlert.parentNode.removeChild(divCookieAlert);
	}
}

function __isVisibleCookieBanner() {
	var divCookieAlert = document.getElementById(__cookieLawBannerDivId);
	if ( divCookieAlert != null )
		return true;
	else
		return false;
}


// control de cookies: info, aceptar, salir ///////////////////////////////////

function __doCookieLawInfo() {
	document.location = __cookieLawCookiePolicyUrl[__getCookieLawLang()];
}

function __doCookieLawAccept() {
	__saveCookieValue(__cookieLawCookieAcceptName,"accepted", 31536000000, "/"); // expiry = 1 year
	__deleteCookieJs(__cookieLawCookieBannerShownCountName);
	__hideCookieBanner();
}

function __doCookieLawAcceptInferred() {
	__saveCookieValue(__cookieLawCookieAcceptName,"accepted", 0, "/"); // expiry = session
	__deleteCookieJs(__cookieLawCookieBannerShownCountName);
	__hideCookieBanner();
}

function __doCookieLawDeny() {
	__saveCookieValue(__cookieLawCookieAcceptName,"denied", 0, "/");
	__hideCookieBanner();
}

function __doCookieLawDenyAndExit() {
	__deleteAllCookiesJs();
	document.body.innerHTML = '';
}

function __doCookieClose() {
	__hideCookieBanner();
}

// alert //////////////////////////////////////////////////////////////////////

function __bodyAlert(textToAlert) {
	var auxAlertP = document.createElement("p");
	auxAlertP.innerHTML = "["+new Date()+" "+textToAlert+"]";
	document.body.appendChild(auxAlertP);

}


// control de scroll //////////////////////////////////////////////////////////


function __getScrollX() {
	var auxX = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
	return auxX;
}


function __getScrollY() {
	var auxY = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;	
	return auxY;
}


// general cookie management //////////////////////////////////////////////////

// returns the value of the cookie or null if there is not such cookie
function __retrieveCookieValue(cookieName) {
	var auxCookiesString = document.cookie;
	var arrMatches = auxCookiesString.split(";");
	for ( var i = 0; arrMatches != null && i < arrMatches.length; i++ ) {
		if ( arrMatches[i] != null && arrMatches[i].indexOf("=") != -1 ) {
			var auxCookieName = arrMatches[i].substring(0,arrMatches[i].indexOf("="));
			auxCookieName = cookieNameTrim(auxCookieName);
			var auxCookieValue = arrMatches[i].substring(arrMatches[i].indexOf("=")+1);
			if ( auxCookieName == cookieName ) {
				return auxCookieValue;
			}
		}
	}
	return null;
}


function __saveCookieValue(cookieName,cookieValue) {
	document.cookie = cookieName + "=" + cookieValue;
}


// cookieExpirationMilisFromNow == 0 --> session
function __saveCookieValue(cookieName,cookieValue,cookieExpirationMilisFromNow) {
	if ( cookieExpirationMilisFromNow == 0 ) {
		document.cookie = cookieName + "=" + cookieValue + '; expires=0';
	} else {
		var auxDate = new Date();
		var auxTime = auxDate.getTime();
		auxTime = auxTime + cookieExpirationMilisFromNow;
		auxDate.setTime(auxTime);
		document.cookie = cookieName + "=" + cookieValue + '; expires=' + auxDate.toGMTString();
	}
}

// cookieExpirationMilisFromNow == 0 --> session
function __saveCookieValue(cookieName,cookieValue,cookieExpirationMilisFromNow, cookiePath) {
	if ( cookieExpirationMilisFromNow == 0 ) {
		document.cookie = cookieName + "=" + cookieValue + '; expires=0; path=' + cookiePath;
	} else {
		var auxDate = new Date();
		var auxTime = auxDate.getTime();
		auxTime = auxTime + cookieExpirationMilisFromNow;
		auxDate.setTime(auxTime);
		document.cookie = cookieName + "=" + cookieValue + '; expires=' + auxDate.toGMTString() + '; path=' + cookiePath;
	}
}


// method used to remove left and right spaces in cookie name
function cookieNameTrim(s) {
	if ( typeof s === "undefined" ) return s;
	if	( s == null ) return s;
	var ret = "";
	for ( var i=0; i < s.length; i++ ) {
		if ( s.charAt(i) != " " ) ret = ret + s.charAt(i);
	}
	return ret;
}

function __deleteAllCookiesJs() {
	alert("borrando..."+document.cookie);
	var auxCookieSplit = document.cookie.split(';');
	for (var i=0 ; i < auxCookieSplit.length; i++) {
		var auxCookieName = auxCookieSplit[i].substring(0,auxCookieSplit[i].indexOf("="));
		auxCookieName = cookieNameTrim(auxCookieName);
		__deleteCookieJs(auxCookieName);
	}
}

function __deleteCookieJs(cookieName) {
	document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
	document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
	var auxDomain = document.domain;
	var auxSubdomain = auxDomain;
	if ( auxSubdomain.indexOf(".") != -1 ) auxSubdomain = auxSubdomain.substring(auxSubdomain.indexOf(".")+1);
	document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; domain = "+auxSubdomain;
}


// return true if cookies are enabled
function __checkCookiesEnabled(){
	var retCookieEnabled = (navigator.cookieEnabled)? true : false;
	if ( typeof navigator.cookieEnabled =="undefined" && !retCookieEnabled ){
		document.cookie="__auxTestCookie";
		retCookieEnabled=(document.cookie.indexOf("__auxTestCookie")!=-1)? true : false;
		__deleteCookieJs("__auxTestCookie");
	}
	return retCookieEnabled;
}


// cookies to manage baner & consent //////////////////////////////////////////


function __auxDocUrlIsCookiePolicy() {
	var auxCurrUrl = document.URL;
	for (var auxClcpuName in __cookieLawCookiePolicyUrl) {
		var auxCoociePolicyUrlSub = "" + __cookieLawCookiePolicyUrl[auxClcpuName];
		if ( auxCurrUrl.indexOf(auxCoociePolicyUrlSub) != -1 ) {
			//alert("estamos en la cookie policy");
			return true;
		}
	}
	return false;
}

function __setOrUpdateCookieBannerShownCount() {
	var auxCount = __retrieveCookieValue(__cookieLawCookieBannerShownCountName);
	if ( auxCount == null || isNaN(auxCount) ) {
		__saveCookieValue(__cookieLawCookieBannerShownCountName,""+__cookieLawCountBeforeAccept, 0, "/");
	} 
	else {
		var auxCountNum = parseInt(auxCount);
		if ( __auxDocUrlIsCookiePolicy() == false ) {
			auxCountNum = auxCountNum - 1;
		}
		__saveCookieValue(__cookieLawCookieBannerShownCountName,""+auxCountNum, 0, "/");
	}
}


// solo devuelve true si existe la cookie y es mayor que 0
function __testCookieBannerShownCountExceded() {
	var auxCount = __retrieveCookieValue(__cookieLawCookieBannerShownCountName);
	if ( auxCount == null ) {
		return false;
	} else if ( isNaN(auxCount) ) {
		return false;
	} else { // is a number
		if ( auxCount > 0 ) {
			return false;
		} else {
			return true;
		}
	}
}


function __checkCookieLawExists() {
	var auxCookie = __retrieveCookieValue(__cookieLawCookieAcceptName);
	if ( auxCookie != null && ( ( auxCookie == "accepted" ) || ( auxCookie == "denied" ) ) ) {
		return true;
	};
	return false;
}

function __checkCookieLawAccepted() {
	var auxCookie = __retrieveCookieValue(__cookieLawCookieAcceptName);
	if ( auxCookie != null && ( auxCookie == "accepted" ) ) {
		return true;
	};
	return false;
}

function __checkCookieLawDenied() {
	var auxCookie = __retrieveCookieValue(__cookieLawCookieAcceptName);
	if ( auxCookie != null && ( auxCookie == "denied" ) ) {
		return true;
	};
	return false;
}


// banner activation //////////////////////////////////////////////////////////

if ( __checkCookiesEnabled() ) {
	if ( __checkCookieLawExists() == false ) { // show banner if no cookie
		__setOrUpdateCookieBannerShownCount();
		if ( __testCookieBannerShownCountExceded() ) { // count exceded
			__doCookieLawAcceptInferred();
		} else {
			__showCookieBanner();
		}
	}
};

