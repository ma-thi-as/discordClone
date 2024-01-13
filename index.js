const express = require('express');
const { createServer } = require('http');
const { join } = require('path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public/index.html'));
});
// Add a data structure to store connected clients and their corresponding socket objects
const connectedClients = {};

io.on('connection', (socket) => {
  var clientID = socket.id;
  connectedClients[clientID] = socket; 

  socket.broadcast.emit('client', { clientID });

  socket.on('offer', (offerData) => {
    // Send the offer to the specified user
    const targetSocket = connectedClients[offerData.user];
    if (targetSocket) {
      targetSocket.emit("offer", { offer: offerData.offer, sender: clientID });
    }
  });

  socket.on('answer', (answerData) => {
    // Send the answer to the specified user
    const targetSocket = connectedClients[answerData.user];
    if (targetSocket) {
      targetSocket.emit("answer", { answer: answerData.answer, sender: clientID });
    }
  });

  socket.on('ice-candidate', (candidateData) => {
    // Send the ICE candidate to the specified user
    console.log(candidateData);
    const targetSocket = connectedClients[candidateData.user];
    if (targetSocket) {
      targetSocket.emit("ice-candidate", { candidate: candidateData.candidate, sender: clientID });
    }
  });

  socket.on('disconnect', () => {
    // Remove the disconnected client from the connectedClients object
    delete connectedClients[clientID];
    console.log(`${clientID} disconnect`);
  });
});


server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
