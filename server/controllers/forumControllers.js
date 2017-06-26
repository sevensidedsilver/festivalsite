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
    let parent_comment = req.body.parent_comment
    let author_display = req.body.author_display
    let comment_content = req.body.comment_content
    let created_at = new Date()
    req.app.get('db').createcomment([thread_id, parent_comment, author_display, comment_content, created_at]).then(function(resp){
      res.status(200).send(resp)
    })

  },

    gettoplevelcomments: function(req, res){
      let thread_id = req.params.id
      //console.log(req)
      req.app.get('db').gettoplevelcomments([thread_id]).then(function(resp){
        res.status(200).send(resp)

      })

    },

    // get all child comments for a specific comment id
    getChildComments: function(req, res){
      let comment_id = req.params.id
      req.app.get('db').getChildComments([comment_id]).then(function(resp){
        res.status(200).send(resp)
      })



    },
// report a comment
  reportcomment: function(req, res){
    let comment_id = Number(req.params.id)
    req.app.get('db').reportComment([comment_id]).then(function(resp){
      res.status(200).send(resp)
    })
  },

// report a thread
  reportthread: function(req, res){
    let thread_id = Number(req.params.id)
    req.app.get('db').reportThread([thread_id]).then(function(resp){
      res.status(200).send(resp)
    })
  },

// GET ALL reported comments
  reportedComments: function(req, res){
    req.app.get('db').reportedComments().then(function(resp){
      res.status(200).send(resp)
    })

  },

// get all reported threadS
  reportedThreads: function(req, res){
    req.app.get('db').reportedThreads().then(function(resp){
      res.status(200).send(resp)
    })
  },

// delete a reported comment
  deletecomment: function(req, res){
    let data = [Number(req.params.id)]
    //console.log(req.params.id)
    req.app.get('db').deleteComment(data).then(function(resp){
      res.status(200).send(resp)
    })

  },
  // delete a reported thread
    deletethread: function(req, res){
      let data = [Number(req.params.id)]
      //console.log(req.params.id)
      req.app.get('db').deleteThread(data).then(function(resp){
        res.status(200).send(resp)
      })

    },
// DISMISS a reported comment
  dismisscomment: function(req, res){
    let data = [Number(req.params.id)]
    req.app.get('db').dismissComment(data).then(function(resp){
      res.status(200).send(resp)
    })

    //req.app.get('db').dismiss(['comments', 'comment_id', req.data.id])
  },
  // DISMISS a reported thread
    dismissthread: function(req, res){
      let data = [Number(req.params.id)]
      req.app.get('db').dismissThread(data).then(function(resp){
        res.status(200).send(resp)
      })

      //req.app.get('db').dismiss(['comments', 'comment_id', req.data.id])
    }




// end of module exports ====================
}
