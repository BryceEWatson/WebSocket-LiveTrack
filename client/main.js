// Dynamic parameters
var domain = "ws://brycew.kd.io:8080/";
var ID_KEY = "uniqueId";
var webSocket = new WebSocket(domain, "protocolOne");

//Check for id in cookie
var uniqueId = getItem(ID_KEY);
if(!uniqueId || uniqueId.length <=0){
  //Generate a new id
  uniqueId = guid();
  setItem(ID_KEY, uniqueId, Infinity); 
}

webSocket.onopen = function (event) {
  var data = {
    uniqueId : uniqueId
  };
  webSocket.send(uniqueId); 

};

// Utility Functions Start
function  getItem(sKey) {

  return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;

}

function setItem(sKey, sValue, vEnd, sPath, sDomain, bSecure) {

    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }

    var sExpires = "";

    if (vEnd) {

      switch (vEnd.constructor) {

        case Number:

          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;

          break;

        case String:

          sExpires = "; expires=" + vEnd;

          break;

        case Date:

          sExpires = "; expires=" + vEnd.toUTCString();

          break;

      }

    }

    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");

    return true;

  }

function s4() {

  return Math.floor((1 + Math.random()) * 0x10000)

             .toString(16)

             .substring(1);

}

function guid() {

  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +

         s4() + '-' + s4() + s4() + s4();

}

// Untility Functions End
