angular.module('app').service('threadService', function($http){



// post http posts to database
this.postThread = function(data){
  return $http({
    method: "POST",
    url: "/newthread",
    data: data
  })
},
// mark new thread as unread for all users
this.unReadThread = function(data){
  return $http({
    method: "get",
    url: "/unreadthread",
    data: data
  })
},


// get top level comments for a threadService
this.getTopLevelComments = function(data){
  return $http({
    method:"GET",
    url:"/getallcomments/" + data

  }).then(function(resp){
    //console.log(resp)
    return resp
  })
},

/// is it starred?
// check using the user id and the thread id passed from the controller
this.isItStarred = function(user_id, thread_id){
  // console.log("we have the ", user_id, thread_id)
  return $http({
    method: "GET",
    url: "/isitstarred/" + user_id + "/" + thread_id
  }).then(function(resp){
    // console.log(resp.data)
    return (resp.data)
  })

},
// toggle star on
this.starThis = function(user_id, thread_id){
  //console.log("we got here")
  return $http({
    method: "put",
    url: "/starthis/" + user_id + "/" + thread_id
  }).then(function(resp){
    return resp.data

  })

},
//toggle star off
this.unStarThis = function(user_id, thread_id){
  return $http({
    method: "put",
    url: "/unstarthis/" + user_id + "/" + thread_id
  }).then(function(resp){
    // console.log(resp.data)
    return resp.data
  })



}


// post comment
this.createComment = function(data){
  return $http({
    method: "POST",
    url: "/newcomment",
    data: data
  })


},

// report a comment
this.reportcomment = function(data){
  // console.log(data)
  return $http({
    method: "PUT",
    url: "/reportcomment/" + data
  })
},

this.reportThread = function(data){
  return $http({
    method: "PUT",
    url: "/reportthread/" + data
  })
}

})
