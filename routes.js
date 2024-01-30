const { join } = require('path');
const fs = require('fs');

const authRoutes = require('./routes/authRoutes'); // oauth athentication

function Routes(app) {
    //Routing
    app.get('/', (req, res) => {
        res.sendFile(join(__dirname, 'views/index.html'));
    })

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

    app.use('/', authRoutes);

}

module.exports = Routes;