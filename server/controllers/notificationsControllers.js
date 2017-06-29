var app = require('../server.js')
var forumController = require('./forumControllers.js')

module.exports= {

new_unread_for_all: function(req, res){
  let new_unread;
  // first, find the most recent thread added to the threads column
  req.app.get('db').most_recent_thread_id().then(function(resp){
    res.status(200).send(resp[0].max)
  })

  // next, get all the user data and prep the
  // req.app.get('db').fetchUsers().then(function(resp){
  //   res.status(200).send(resp)
  //   // go over every new_threads value in our users table and add the thread id being created
  //   for (var i = 0; i < resp.length; i++){
  //
  //
  //
  //
  //     console.log(resp[i].new_threads)
  //
  //     console.log("add this to that ^^^", new_unread)
  //
  //
  //
  //   }
  // })

  }






// end of module exports ====================
}
