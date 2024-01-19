const express = require('express');
const { createServer } = require('http');
const { join } = require('path');
const { Server } = require('socket.io');
const fs = require('fs');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'templates/home.html'));

})

// Ruta para las salas
app.get('/room/:roomName', (req, res) => {
  res.sendFile(__dirname + '/templates/room.html');
});

app.get('/register', (req, res) => {
  // Lee el contenido del archivo HTML
  const htmlContent = fs.readFileSync(join(__dirname, 'templates/register.html'), 'utf-8');

  // Envía el contenido HTML como respuesta
  res.send(htmlContent);
});

app.post('/sign-up', (req, res) => {
  // Los datos del formulario estarán disponibles en req.body
  const username = req.body.username.trim();
  
  if(username) {
    console.log('Username recibido:', username);
    res.send('Datos recibidos correctamente');
  }
  res.send('Datos no recibidos correctamente');

  // Hacer algo con los datos, por ejemplo, imprimirlos en la consola

  // Puedes enviar una respuesta al cliente si es necesario
  
});






// Add a data structure to store connected clients and their corresponding socket objects
const connectedClients = {};
const roomData = {};
// When a client get a connection with socket
io.on('connection', (socket) => {
  var clientID = socket.id;
  connectedClients[clientID] = socket;

  // emit clientID for the all others users
  socket.broadcast.emit('client', { clientID });
  socket.on('offer', (offerData) => {
    // Send the offer to the specified user
    const targetSocket = connectedClients[offerData.user];
    if (targetSocket) {
      targetSocket.emit("offer", { offer: offerData.offer, sender: clientID });
    }
  });

  //when offer es generated response to the other user with the answer
  socket.on('answer', (answerData) => {
    // Send the answer to the specified user
    const targetSocket = connectedClients[answerData.user];
    if (targetSocket) {
      targetSocket.emit("answer", { answer: answerData.answer, sender: clientID });
    }
  });

  //handle ice candidates.
  socket.on('ice-candidate', (candidateData) => {
    // Send the ICE candidate to the specified user
    console.log(candidateData);
    const targetSocket = connectedClients[candidateData.user];
    if (targetSocket) {
      targetSocket.emit("ice-candidate", { candidate: candidateData.candidate, sender: clientID });
    }
  });

  socket.on('join-room', (roomName) => {
    socket.join(roomName);
    // Inform clients in the same room about the new user
    io.to(roomName).emit('user-joined', { userID: clientID });
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
