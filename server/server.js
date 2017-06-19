const cors = require('cors');
const express = require('express');
const massive = require('massive');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const config = require('../config.js');

// INITIATE EXPRESS APP & SET LISTENING PORT ================
const app = express();
const port = 3000;

// initialize auth0 =========================================
app.use(passport.initialize())
app.use(passport.session())

passport.use(new Auth0Strategy({
  domain: config.auth0.domain,
  clientID: config.auth0.clientID,
  clientSecret: config.auth0.clientSecret,
  callbackURL: '/auth/callback'
}, function(accessToken, refreshToken, extraParams, profile, done){
  return done(null, profile);
}))



// create endpoints
app.get('/auth', passport.authenticate('auth0'));

app.get('/auth/callback',
  passport.authenticate('auth0', {successRedirect: '/'}), function(req, res) {
    res.status(200).send(req.user);
})



// create deserialize/ serializer methods on passport
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


app.get('/auth/me', function(req, res) {
  if (!req.user) return res.sendStatus(404);
  //THIS IS WHATEVER VALUE WE GOT FROM userC variable above.
  res.status(200).send(req.user);
})

app.get('/auth/logout', function(req, res) {
  req.logout();
  res.redirect('/');
})





// MIDDLEWARE FOR EVERYTHING TO PASS THROUGH ================
app.use(bodyParser.json());
app.use(express.static(`${__dirname}./../public`));
app.use(cors());

//// MASSIVE DB ==========================================
massive({
	host: 'localhost',
	port: 5432,
	database: 'forum',
	user: '',
	password: ''
}).then(db => {
	app.set('db', db);
});






// LISTENING ON PORT ===============================
app.listen(port, () => {
	console.log(`magic happens on port ${port}`)
})
