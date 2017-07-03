require('dotenv').config();
const cors = require('cors');
const express = require('express');
const massive = require('massive');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const config = require('../config.js');


const moment = require('moment');
// moment().tz("Europe/Berlin").format();


var forumController = require('./controllers/forumControllers.js')
var threadController = require('./controllers/threadController.js')
var notificationsController = require('./controllers/notificationsControllers.js')


// INITIATE EXPRESS APP & SET LISTENING PORT ================
const app = express();
const port = 3000;

// LISTENING ON PORT ===============================
app.set('port', (process.env.PORT || 3000))

// MIDDLEWARE FOR EVERYTHING TO PASS THROUGH ================
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(`${__dirname}./../public`));

//express session =======================
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSIONSECRET
}))

//// MASSIVE DB ==========================================
// massive({
	// host: "localhost",
	// port: 5432,
//	database: LOCALconfig.database
// user: config.dbuser,
// password: config.dbpass

//connect to elepahnt sql
massive(process.env.CONNECTION_STRING).then(db => {
	app.set('db', db);
}).catch(error => {
  console.log("some kinda massive error!")
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
  //hosted:
  // callbackURL: 'http://rhapsodyfestival.com' + '/auth/callback'

  // local:
  callbackURL: 'http://www.rhapsodyfestival.com' + '/auth/callback'
}, function(accessToken, refreshToken, extraParams, profile, done){

  //console.log(profile)

  // these are the specific properties we pull from the profile object
  // sent to us by auth0's server

  let user = [
    profile.id,
    profile.displayName,
    0
  ]
  //if user doesnt EXISTS, add to database
  // looks for existing id
  app.get('db').ifUserExists([user[0]]).then(function(resp){
    //console.log(resp.length)
    if (resp.length < 1) {
      app.get('db').create_user(user).then(function(resp){
        //console.log(user)
        return done(null, user);
      })
    } else {
      //user = resp[0]
      user = [
        resp[0].id,
        resp[0].username,
        resp[0].admin
      ]

      //console.log(user)
      return done(null, user);
    }
    //return done(null, user);

  })


  // add user to database with id, display_name
  //app.post('/newuser', forumController.newuser)



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
// mark new thread as unread for all users ======================== UNREAD THREAD
app.put('/unreadthread', notificationsController.new_unread_for_all)


// post new comment ========================== POST NEW comment
app.post('/newcomment', forumController.new_comment)

// feed top for users with thread starred! ================= FEED top
app.put('/feed_top/:thread_id', threadController.feed_top)
app.put('/add_feed_top/:thread_id/:user_id', threadController.add_feed_top)

// REPORT a comment ============================ REPORT
app.put('/reportcomment/:id', forumController.reportcomment)

// get all feed_top for user_id
app.get('/get_feed_top/:current_user', forumController.get_feed_top)
//remove top feed once user sees thread
app.put('/remove_top/:user_id/:thread_id', forumController.remove_top)



// is current thread starred ====== STAR

app.get('/isitstarred/:user_id/:thread_id', threadController.isItStarred)

// toggle the fucking star ========== star

app.put('/starthis/:user_id/:thread_id', threadController.starThis)
//toggle the star off ======================= star
app.put('/unstarthis/:user_id/:thread_id', threadController.unStarThis)





// report a thread ================================report
app.put('/reportthread/:id', forumController.reportthread)

// GET all reported comments for admin view =================== GET REPORTED
app.get('/reportedcomments', forumController.reportedComments)
// get all reported threads for adminview
app.get('/reportedthreads', forumController.reportedThreads)

// DELETE a reported comment in admin view
app.delete('/delete/comments/comment_id/:id', forumController.deletecomment)
// DISMISS a reported comment in admin view
app.put('/dismisscomment/:id', forumController.dismisscomment)

// DELETE a reported thread in admin view
app.delete('/delete/threads/thread_id/:id', forumController.deletethread)
// DISMISS a reported thread in admin view
app.put('/dismissthread/:id', forumController.dismissthread)


// GET ALL TOP LEVEL COMMENTS FOR A THREAD ==============get comments!
app.get('/getallcomments/:id' , threadController.getallcomments)

// GET all children comments for specific comment id
app.get('/getchildcomments/:id', forumController.getChildComments)

// LISTENING ON PORT ===============================
app.listen(port, () => {
	console.log(`magic happens on port ${port}`)
})
