const express = require('express');
const router = express.Router();
const passport = require('passport');

const { oauthSignInGH, oauthCallbackGH } = require('../controllers/githubOauth'); //github

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/oauth2callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Redirecciona al usuario después de la autenticación exitosa
    res.redirect('/');
  });


router.get('/auth/github', oauthSignInGH);
router.get('/oauth/callback', oauthCallbackGH);

module.exports = router;
