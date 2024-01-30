const { verifyGHOauthToken } = require('../config/githubAuth');

const clientId = process.env.GH_BASIC_CLIENT_ID;

async function oauthSignInGH(req, res) {
    res.render('sign-in', { client_id: clientId });
}

async function oauthCallbackGH(req, res) {
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
                client_secret: process.env.GH_BASIC_SECRET_ID,
                code: session_code
            })
        });

        const data = await response.json();
        const access_token = data.access_token;

        // Handle the access token or send it back in the response
        await verifyGHOauthToken(access_token, res);
        res.send(access_token);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { oauthCallbackGH, oauthSignInGH };