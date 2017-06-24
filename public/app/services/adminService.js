angular.module('app').service('adminService', function($http){

  this.getReportedComments = function(){
    return $http ({
      method: "GET",
      url: "/reportedcomments"
    }).then(function(resp){
      return resp
    })

  }

  this.getReportedThreads = function(){
    return $http ({
      method: "GET",
      url: "/reportedthreads"


    }).then(function(resp){
      return resp
    })
  }
// delete comment
  this.deleteComment = function(comment_id){
    //console.log(comment_id)
    return $http ({
      method: "DELETE",
      url: "/delete/comments/comment_id/" + comment_id
      //data must be an object!

    }).then(function(resp){
      //console.log(data)
      return resp
    })
  }
// delete thread
this.deleteThread = function(thread_id){

  return $http ({
    method: "DELETE",
    url: "/delete/threads/thread_id/" + thread_id
    //data must be an object!

  }).then(function(resp){
    //console.log(data)
    return resp
  })
}
// dismiss comment
  this.dismissComment = function(comment_id){

    return $http({
      method: "PUT",
      url: "/dismisscomment/" + comment_id,


    }).then(function(resp){
      return resp
    })
  }
  // dismiss thread
    this.dismissThread = function(thread_id){

      return $http({
        method: "PUT",
        url: "/dismissthread/" + thread_id,


      }).then(function(resp){
        return resp
      })
    }
})
