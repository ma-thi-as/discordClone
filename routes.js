const { join } = require('path');
const fs = require('fs');

const authRoutes = require('./routes/authRoutes'); // oauth athentication

const { User, Friend } = require("./Models/User");


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

    // Ruta para buscar un usuario por nombre de usuario
    app.get('/searchUser', async (req, res) => {
        const username = req.query.username;

        try {
            const user = new User();
            const userData = await user.findUserByUsername(username);

            if (userData) {
                res.json(userData);
            } else {
                res.json(null); // Usuario no encontrado
            }
        } catch (error) {
            console.error('Error searching for user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.post('/addFriend', async (req, res) => {
        // Access the authenticated user's information from req.user
        const current_user = req.session.user;
        // Access the user's token if available

        const friend_id = req.body.user;

        try {
            if (!req.session.user) {
                res.status(400).send("Bad request");
            }
            if (current_user.id == friend_id) {
                res.status(400).send("Bad request");
            }
            else {
                const friend = new Friend(current_user.id, friend_id)
                await friend.save().then(() => {
                    console.log("Saved");
                });

            }
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal server error.');
        }
    });


    app.use('/', authRoutes);

}

module.exports = Routes;