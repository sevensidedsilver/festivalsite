const cors = require('cors');
const express = require('express');
const massive = require('massive');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const config = require('../config.js');
const LOCALconfig = require('../LOCALconfig.js');


const moment = require('moment');
// moment().tz("Europe/Berlin").format();


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

// create tables if they don't exist ========================================

// create table IF NOT EXISTS threads
// (thread_id serial primary key,
//  author_id integer references users.user_id,
//  author_display text,
//




// initialize auth0 =========================================
app.use(passport.initialize())
app.use(passport.session())

passport.use(new Auth0Strategy({
  domain: config.auth0.domain,
  clientID: config.auth0.clientID,
  clientSecret: config.auth0.clientSecret,
  callbackURL: 'http://localhost:3000' + '/auth/callback'
}, function(accessToken, refreshToken, extraParams, profile, done){

  let user = [
    profile.id,
    profile.displayName,
    0
  ]

  //if user doesnt EXISTS, add to database


  // looks for existing id
  app.get('db').ifUserExists([user[0]]).then(function(resp){

    if (resp.length < 1) {
      // console.log(user)
      app.get('db').create_user(user).then(function(resp){
        console.log(resp)
      })

    }
    console.log("already exists")
  })


  // add user to database with id, display_name
  app.post('/newuser', forumController.newuser)

  return done(null, user);

  // end of passport strategy
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











// FORUM endpoints ===========================================================
app.get('/users', forumController.fetchUsers)


//create new user
app.post('/newuser', forumController.newuser)





app.get('/threads', forumController.fetchThreads)

app.get('/thread/:id', forumController.fetchoneThread)


// create new thread ========================POST POST POST
app.post('/newthread', forumController.new_thread)


// post new comment ========================== POST NEW comment
app.post('/newcomment', forumController.new_comment)



// LISTENING ON PORT ===============================
app.listen(port, () => {
	console.log(`magic happens on port ${port}`)
})
