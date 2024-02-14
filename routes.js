const { join } = require('path');
const fs = require('fs');

const authRoutes = require('./routes/authRoutes'); // oauth athentication
const userRoutes = require('./routes/userRoutes'); // oauth athentication

const { User, Friend } = require("./Models/User");


function Routes(app) {
    //Routing
    app.get('/', (req, res) => {
        res.sendFile(join(__dirname, 'views/index.html'));
    })

    app.get('/home', (req, res, next) => {
        if (req.session.user) {
            next(); // Continuar si hay un usuario en la sesión
        } else {
            res.redirect("/auth/github")   
        }
    });
    app.get('/home', (req, res) => {
        res.sendFile(join(__dirname, 'views/home.html'));
    });

    app.get('/room/:roomName', (req, res) => {
        res.sendFile(__dirname + '/views/call.html');
    });

    app.get('/register', (req, res) => {
        const htmlContent = fs.readFileSync(join(__dirname, 'views/register.html'), 'utf-8');
        res.send(htmlContent);
    });

    app.use('/', userRoutes);
    app.use('/', authRoutes);

}

module.exports = Routes;