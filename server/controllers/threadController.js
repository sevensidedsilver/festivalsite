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
