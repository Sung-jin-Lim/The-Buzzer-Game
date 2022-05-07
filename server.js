
const path = require('path');
const express = require('express');

const app = express();

const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);
const formatMessage = require('./utils/messages');
const { joinUser, getCurrentUser, leaveUser, getRoomUsers } = require('./utils/users');


const botname = 'Chatty [BOT]';
// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// run when client connects
io.on('connect', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = joinUser(socket.id, username, room);

    socket.join(user.room);

    socket.join()

    socket.emit('message', formatMessage(botname, 'Welcome to The Buzzer Gameshow!'));

    // connection broadcast (tells everyone exept connecting user)
    socket.broadcast
      .to(user.room)
      .emit('message', formatMessage(botname, `${user.username} has joined the party!`));


    // send users and room infomation
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });


    socket.on('disconnect', () => {

      const user = leaveUser(socket.id);

      if (user) {
        io.to(user.room).emit('message', formatMessage(botname, `${user.username} has left the party!`));
      }

      // send users and room infomation
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });

    });
  });

  console.log('New connection established...');





  // listen for chatMessage
  socket.on('chatMessage', msg => {

    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg)); // emits to all clients and sends 
  }
  );
})



const PORT = process.env.PORT || 8000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

