// TODO: Dynamic parameters
var domain = "ws://brycew.kd.io:8080/"
var webSocket = new WebSocket(domain, "protocolOne");

webSocket.onopen = function (event) {

  webSocket.send("Here's some text that the server is urgently awaiting!"); 

};
