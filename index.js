const path = require('path');
const express = require('express');
const { createServer } = require('http');
const app = express();
const server = createServer(app);
const { Server } = require('socket.io');
const Session = require('express-session');

app.set('view engine', 'ejs'); // Establece EJS como el motor de vistas
app.set('views', path.join(__dirname, 'views')); // Especifica la carpeta donde se encuentran tus vistas

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // encode html

app.use(express.json()); // for parsing JSON

app.use(Session({
    secret: process.env.secret_session,
    resave: false,
    saveUninitialized: true,

}))

const Routes = require('./routes.js');
const CallLogic = require('./socket-server.js');


const io = new Server(server); // Create a socket sv instance.

// Routes
Routes(app);
// Socket server / calls logic server side
CallLogic(io);
const { connectToAtlas } = require('./config/mongo.js');

async function name() {
    try {
        const client = await connectToAtlas();

        console.log(await client.db("admin").command({ ping: 1 }));
    } catch (error) {
        console.error("Error running MongoDB:", error);
    }
}

name();
server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});

