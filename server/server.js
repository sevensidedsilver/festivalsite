const cors = require('cors');
const express = require('express');
const massive = require('massive');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const config = require('../config.js');
const LOCALconfig = require('../LOCALconfig.js');

var forumController = require('./controllers/forumControllers.js')


// INITIATE EXPRESS APP & SET LISTENING PORT ================
const app = express();
const port = 3000;

// MIDDLEWARE FOR EVERYTHING TO PASS THROUGH ================
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(`${__dirname}./../public`));

//express session =======================
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.sessionSecret
}))



// initialize auth0 =========================================
app.use(passport.initialize())
app.use(passport.session())

passport.use(new Auth0Strategy({
  domain: config.auth0.domain,
  clientID: config.auth0.clientID,
  clientSecret: config.auth0.clientSecret,
  callbackURL: 'http://localhost:3000' + '/auth/callback'
}, function(accessToken, refreshToken, extraParams, profile, done){
  //console.log(profile)


  return done(null, profile);
}))



// create endpoints
app.get('/auth', passport.authenticate('auth0'));

app.get('/auth/callback',

	// where to redirect after login
  passport.authenticate('auth0', {successRedirect: '/#!/forum'}), function(req, res) {
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
  //console.log("TESTING", req.user)
  if (!req.user) return res.status(200).send({user: false});
  //THIS IS WHATEVER VALUE WE GOT FROM userC variable above.

  res.status(200).send({user: req.user});
})

app.get('/auth/logout', function(req, res) {
  req.logout();
  res.redirect('/');
})







//// MASSIVE DB ==========================================
massive({
	host: "localhost",
	port: 5432,
	database: LOCALconfig.database
// user: config.dbuser,
// password: config.dbpass

}).then(db => {
	app.set('db', db);
});

// FORUM endpoints ===========================================================
app.get('/users', forumController.fetchUsers)

app.get('/threads', forumController.fetchThreads)

app.get('/thread/:id', forumController.fetchoneThread)


// create new thread ========================POST POST POST
app.post('/newthread', forumController.new_thread)


// LISTENING ON PORT ===============================
app.listen(port, () => {
	console.log(`magic happens on port ${port}`)
})
