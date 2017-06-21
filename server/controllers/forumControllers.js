var app = require('../server.js')

// fetch all users
module.exports = {
  fetchUsers : function(req, res) {
    req.app.get('db').fetchUsers().then(function(resp){
      //console.log("neat")
      res.status(200).send(resp)
    })
  },
// create new users
  newuser : function (req, res) {
    let id = user.id
    let username = user.display_name
    let admin = 0
    req.app.get('db').create_user([id, username, admin]).then(function(resp){
      res.status(200).send(resp)
    })
  },

// if user EXISTS
  testuser : function (req,res) {
    req.app.get('db').ifUserExists(id).then(function(resp){
      res.status(200).send(true)
    })

  }



// fetch all threads
  fetchThreads : function(req, res) {
    req.app.get('db').fetchThreads().then(function(resp){
      res.status(200).send(resp)
    })
  },

  fetchoneThread : function(req, res) {
    req.app.get('db').select_thread_by_id([req.params.id]).then(function(resp){
      res.status(200).send(resp)
    })
  },


//create new thread
  new_thread : function(req, res) {
    let thread_author = req.body.thread_author
    let thread_title = req.body.thread_title
    let thread_content = req.body.thread_content
    req.app.get('db').new_Thread([thread_author, thread_title, thread_content]).then(function(resp){

      res.status(200).send(resp)

    })
  }






// end of module exports ====================
}
