// service.js
angular.module('SurveyApp').service('Service', [function () {

  var onMessageCallback;
  var socket = new WebSocket('ws://localhost:8080');

  socket.onopen = function () {
    var obj = {};
    obj.action = "introduce";
    socket.send(JSON.stringify(obj));
  };

  socket.onmessage = function (event) {
    //console.log("Message received:", event.data);
    if (onMessageCallback) {
      onMessageCallback(event.data);
    }
  };

  var onMessage = function (callback) {
    onMessageCallback = callback;
  };

  var sendMessage = function (message) {
    socket.send(message);
  };

  return {
    onMessage: onMessage,
    sendMessage: sendMessage
  };

}]);