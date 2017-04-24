var express = require('express');
var WebSocket = require('ws');


var app = express();

app.set('port', (process.env.PORT || 8080));
app.use(express.static('public'));

// EXPRESS ROUTES GO HERE:
// ...

var server = app.listen(app.get('port'), function () {
  console.log("Server listening on port", app.get('port'));
});

var wss = new WebSocket.Server({ server: server });

// WEBSOCKET COMMUNICATION GOES HERE:
//

var broadcast = function () {
  wss.clients.forEach(function (ws) {
    console.log("SENDING MESSAGE:",surveys);
    ws.send(JSON.stringify(surveys));
  });
};

var people = [];

var surveys = [];

wss.on('connection', function (ws) {
  // THIS CODE RUNS WHEN A NEW CONNECTION IS MADE
  console.log("Client connected.");

  ws.on('message', function (message) {
    console.log("Received message from client:", message);
    var obj = JSON.parse(message);
    if (obj.action === "introduce") {
      var person = {};
      person.info = obj;
      person.conn = ws;
      people.push(person);
      broadcast();
    } else {
      surveys = obj;
       broadcast();
    };
  });

  ws.on('close', function () {
    // THIS CODE RUNS WHEN THIS CONNECTION IS CLOSED
    console.log("Client disconnected.");
  });
});

