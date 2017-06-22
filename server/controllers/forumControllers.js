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
    let created_at = new Date()
    //console.log(created_at)
    req.app.get('db').new_Thread([thread_author, thread_title, thread_content, created_at]).then(function(resp){
      res.status(200).send(resp)
   })
 },

  //create new comment
  new_comment : function(req, res) {
    let thread_id = req.body.thread_id
    let parent_comment = 0
    let author_display = req.body.author_display
    let comment_content = req.body.comment_content
    let created_at = new Date()
    req.app.get('db').createcomment([thread_id, parent_comment, author_display, comment_content, created_at]).then(function(resp){
      res.status(200).send(resp)
    })

  }






// end of module exports ====================
}
