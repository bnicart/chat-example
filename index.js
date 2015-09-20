var express = require('express');
var app = express(); 
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {
  socket.on('user connected', function(user) {
    socket.user = user;
    socket.broadcast.emit('user connected', user + " has joined!");
  });

  socket.on('chat message', function(chat){
    socket.user = chat.nickname;
    io.emit('user stop typing');
    io.emit('chat message', chat);
  });

  socket.on('user typing', function(data) {
    var msg = data.nickname + " is typing.";
    socket.broadcast.emit('user typing', msg);
  });

  socket.on('disconnect', function() {
    io.emit('user disconnected', socket.user + " has left the conversation.");
  });
});

http.listen(8000, function() {
  console.log("Listening to port 8000");
});
