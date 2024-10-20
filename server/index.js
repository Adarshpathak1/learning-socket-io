const express = require('express');
const app = express();
const PORT = 4000;

// New imports
const http = require('http').Server(app); // Create the HTTP server
const cors = require('cors');
app.use(cors());

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000" // Allow requests from your React app
    }
});

let users = [];

// Add this before the app.get() block
socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.user} user just connected!`);

    // Listens and logs the message to the console
    socket.on('message', (data) => {
        console.log(data);
        socketIO.emit('messageResponse', data); // Broadcast the message
    });

    socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));


    
  //Listens when a new user joins the server
  socket.on('newUser', (data) => {
    //Adds the new user to the list of users
    users.push(data);
    // console.log(users);
    //Sends the list of users to the client
    socketIO.emit('newUserResponse', users);
  });

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
        //Updates the list of users when a user disconnects from the server
        users = users.filter((user) => user.socketID !== socket.id);
        // console.log(users);
        //Sends the list of users to the client
        socketIO.emit('newUserResponse', users);
        socket.disconnect();
    });
});

// API route
app.get('/api', (req, res) => {
    res.json({
        message: 'Hello world',
    });
});

// Use http.listen() instead of app.listen()
http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
