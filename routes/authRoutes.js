const express = require('express');
const router = express.Router();

const { User } = require('../Models/User');

const clientId = process.env.git_clientID;
const clientSecret = process.env.git_client_secret;

router.get('/auth/github', async (req, res) => res.render('sign-in', { client_id: clientId }));

router.get('/oauth/callback', async (req, res) => {
  try {
    const session_code = req.query.code;

    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: session_code
      })
    });

    const data = await response.json();
    const access_token = data.access_token;
    // Handle the access token or send it back in the response
    // Fetch user data using access token
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });


    const userData = await userResponse.json();
    
    const user = new User(userData.id,userData.login, access_token, "github");    
    await user.saveToken();
    // Store user data in session
    req.session.user = userData;
    res.redirect("/home");
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
