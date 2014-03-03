 var trackMain = (function(){
  return {
    init : function(serverUrl, trackingUtils, enableGeo) {
      var co = this;
      co.PAYLOAD_TYPE_FIRSTLOAD    = "firstLoad";
      co.PAYLOAD_TYPE_SUPPLEMENTAL = "supplementalLoad";
      co.UID_KEY                   = "uniqueId";
      
      co.serverUrl = serverUrl;
      co.trackingUtils = trackingUtils;
      
      co.getSessionId(co);
      if(enableGeo){
        co.getGeolocation(co);
      }
      co.establishConnection(co);
      co.bindListeners(co);
    },
    bindListeners : function(context) {
      var co = context;
      if(co.webSocket) {
        co.webSocket.onopen = co.websocketOpen(context,event); 
      }
    },
    getGeolocation : function(context) {
      var co = context;
      $.get("http://ipinfo.io", function(response) {
        co.geoLocation = new Object();
        co.geoLocation.city = response.city;
        co.geoLocation.region = response.region;
        co.geoLocation.country = response.country;
        co.sendData(co, co.PAYLOAD_TYPE_SUPPLEMENTAL);
	  }, "jsonp");
      //if ("geolocation" in navigator) {
      //   navigator.geolocation.getCurrentPosition(function(position) {
      //       co.latitude = position.coords.latitude;
    	//	 co.longitude = position.coords.longitude;
          //   co.sendData(co, co.PAYLOAD_TYPE_SUPPLEMENTAL);
		 //});
      //}
    },
    getSessionId : function(context) {
      var co = context;
      co.uniqueId = co.trackingUtils.getCookieItem(co.UID_KEY);
      if(!co.uniqueId || co.uniqueId.length <= 0){
        co.uniqueId = co.trackingUtils.guid();
        co.trackingUtils.setCookieItem(co.UID_KEY, co.uniqueId, Infinity);
      }
    },
    establishConnection : function(context) {
      var co = context;
      co.webSocket = new WebSocket(co.serverUrl, "protocolOne");
    },
    websocketOpen : function(context, event){
      var co = context;
      
      co.waitForSocketConnection(co, co.sendData);
    },
    waitForSocketConnection : function(context, callback){
      var co = context;
      setTimeout(
          function () {
              if (co.webSocket.readyState === 1) {
                  console.log("Connection is ready")
                  if(callback != null){
                      callback(co, co.PAYLOAD_TYPE_FIRSTLOAD);
                  }
                  return;
  
              } else {
                  console.log("wait for connection...")
                  co.waitForSocketConnection(co, callback);
              }
  
      }, 5); // wait 5 milisecond for the connection...
    },
    sendData : function(context, type) {
      var co = context;
      co.payload = new Object();
      co.payload.type = type;
      co.payload.uniqueId = co.uniqueId;
      co.payload.geoLocation = co.geoLocation;
      // **We can't get these without user request** co.payload.latitude = co.latitude;
      //co.payload.longitude = co.longitude;
      co.webSocket.send(JSON.stringify(co.payload));
    },
  }
}());

// Utility Module Start
var trackingUtils = (function(){
  return {
    init : function(parentContext) {
        var co = this;
        co.parentContext = parentContext;
    },
    getCookieItem : function(sKey){
		return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;    	 
    },
    setCookieItem : function(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
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
    },
    s4 : function(){
       return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
    },
    guid : function(){
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
    }
  }
}());
// Untility Module End

//Start
trackMain.init("ws://brycew.kd.io:8080/", trackingUtils, true);