var app = require('../server.js')
var forumController = require('./forumControllers.js')

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
      let thread_id = req.params.id
      //console.log(req)
      req.app.get('db').getallcomments([thread_id]).then(function(resp){
        res.status(200).send(resp)
        let topLevelComments = resp;
         console.log(topLevelComments)

        topLevelComments.forEach(function(el){
          //el.children = forumController.getChildComments(el.comment_id)



        })



      })
    }







}
