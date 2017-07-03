var app = require('../server.js')
var forumController = require('./forumControllers.js')
var notificationsController = require('./notificationsControllers.js')
var moment = require('moment');

module.exports= {

// get all child comments for a specific comment id
  getChildComments: function(req, res){
    let comment_id = req.params.id
    req.app.get('db').getChildComments([comment_id]).then(function(resp){
      res.status(200).send(resp)
    })
  },


  // feed_top ----- add the thread to the feed_top array for users with the thread starred

feed_top: function(req, res){
  // fetch user objects who have this thread starred
  let these_users
  let thread_id = parseInt(req.params.thread_id)

  req.app.get('db').users_starred_thread(thread_id).then(function(resp){
    these_users = resp
    res.status(200).send(resp)
  })
},
add_feed_top: function(req, res){

    req.app.get('db').feed_top_add(req.params.thread_id, req.params.user_id).then(function(resp){
      res.status(200).send('added')
    })

},


//////   is the current thread starred? ====== star
isItStarred: function(req, res){
  let user_id = req.params.user_id
  let thread_id = parseInt(req.params.thread_id)
  req.app.get('db').isItStarred([user_id]).then(function(resp){
    let starred_threads = (resp[0].starred_threads)
    if (starred_threads == null || starred_threads.indexOf(thread_id) === -1) {
      res.status(200).send(false)
    } else {
      res.status(200).send(true)
    }
  })
},
// toggle the star on
starThis: function(req, res){
  let user_id = req.params.user_id
  let thread_id = req.params.thread_id
  req.app.get('db').newStar([user_id, thread_id]).then(function(resp){
    res.status(200).send(true)
  })
},
  // toggle the star off
  unStarThis: function(req, res){
    let user_id = req.params.user_id
    let thread_id = req.params.thread_id
    req.app.get('db').remove_star([user_id, thread_id]).then(function(resp){
      res.status(200).send(false)
    })
  },



    // pulls ALL top level comments for a thread
    getallcomments: function(req, res){
      let result = [];
      let thread_id = req.params.id
      //console.log(req)
      req.app.get('db').getallcomments([thread_id]).then(function(resp){

        let allComments = resp;
         //console.log(allComments)

// first, let's add all the top level comments to result
        allComments.forEach(function(el){
          //el.children = forumController.getChildComments(el.comment_id)

// add some properties to each comment for the view
          el.timeAgo = (moment(el.created_at, "YYYYMMDD, h:mm:ss").fromNow())
          el.showCommentReplyTextBox = false;
          el.child_comment_content = ""
          el.children = []
          el.hideShow = '[-]'
        })


// double for loop
      var commentize = function(allComments){

        for (var i = 0; i < allComments.length; i++){

          // if the comment is a parent

          if (allComments[i].parent_comment == 0){
            result.push(allComments[i])
          }

          // if the comment is a child...

          if (allComments[i].parent_comment !== 0) {

            // result.push(allComments[i])
            // assign the child to a parent

            for (var j = 0; j < allComments.length; j++){

              if (allComments[j].comment_id == allComments[i].parent_comment){

                allComments[j].children.push(allComments[i])

              }
            }
          }
        }
      }

        commentize(allComments)

        res.status(200).send(result)

      })
    }







}
