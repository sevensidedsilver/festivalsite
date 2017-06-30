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




//////   is the current thread starred? ====== star
isItStarred: function(req, res){
  let user_id = req.params.user_id
  let thread_id = req.params.thread_id
  // console.log(req.params)
  req.app.get('db').isItStarred([user_id]).then(function(resp){
    // console.log(resp[0].starred_threads)
    //there's no starred_threads
    if (resp[0].starred_threads === null) {
      res.status(200).send(false) }
    // } else if (resp[0].starred_threads.length < 2){
    //   res.status(200).send(false)
    // }
      else {
        let starred_threads = resp[0].starred_threads.split(', ')
        // console.log(starred_threads)
        if (starred_threads.indexOf(thread_id.toString()) !== -1) {
          res.status(200).send(true)
        } else if (starred_threads.indexOf(thread_id.toString()) === -1){
          res.status(200).send(false)
        }
    }
  })
},










// toggle the fucking star on
starThis: function(req, res){
  let user_id = req.params.user_id
  let thread_id = req.params.thread_id
  req.app.get('db').isItStarred([user_id]).then(function(resp){
    let starred_threads = resp[0].starred_threads
    // if there's no starred threads
    if (starred_threads === null) {
      req.app.get('db').newStar([thread_id, user_id]).then(function(resp){
        res.status(200).send(true)
      })
    } else if (starred_threads.indexOf(',') === -1) {
      // console.log('there is only one starred thread')
      starred_threads = starred_threads.concat(", " + thread_id)
      req.app.get('db').newStar([starred_threads, user_id]).then(function(resp){
        res.status(200).send(true)
      })
    } else {
      // there must be multiple threads starred
      starred_threads = resp[0].starred_threads.split(', ')
      starred_threads.push(thread_id.toString())
      starred_threads = (starred_threads.join(", "))
      req.app.get('db').newStar([starred_threads, user_id]).then(function(resp){
        res.status(200).send(true)
      })
    }
  })
},
  // toggle the star off
  unStarThis: function(req, res){
    let user_id = req.params.user_id
    let thread_id = req.params.thread_id
    req.app.get('db').isItStarred([user_id]).then(function(resp){
      let starred_threads = (resp[0].starred_threads)
      // one starred thread
      if (starred_threads.indexOf(',') === -1) {
        req.app.get('db').newStar([null, user_id]).then(function(resp){
          res.status(200).send(false)
        })
      } else if (starred_threads.split(', ').length >= 2) {
        //2 or more starred threads
        starred_threads = starred_threads.split(', ')
        //console.log(starred_threads)
        //remove the star
        starred_threads.splice(starred_threads.indexOf(thread_id.toString()), 1)
        starred_threads = starred_threads.join(', ')
        //console.log(starred_threads)
        req.app.get('db').newStar([starred_threads, user_id]).then(function(resp){
          res.status(200).send(false)
        })
      }


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
