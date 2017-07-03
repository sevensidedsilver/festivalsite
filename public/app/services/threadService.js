angular.module('app').service('threadService', function($http){



// post http posts to database
this.postThread = function(data){
  return $http({
    method: "POST",
    url: "/newthread",
    data: data
  })
},

// remove the thread from top feed
// first get the users top feed data
this.removeFromTop = function(user_id, thread_id){
  return $http({
    method: "get",
    url: "/get_feed_top/" + user_id,
  }).then((resp)=>{
    return (resp.data[0].feed_top)
  })
},
// perform the removal
this.remove_top = function(user_id, thread_id){
  return $http({
    method: "PUT",
    url: "/remove_top/" + user_id + "/" + thread_id

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

this.feed_top = function(data) {
  let thread_author = data.author_id
  console.log(data.thread_id)
  let thread_id = data.thread_id
  return $http({
    method: "PUT",
    url: "/feed_top/" + data.thread_id
  }).then(function(resp){


    let mod = (resp.data)
    mod.forEach(function(el){
      //console.log(el)
      if (el.id !== thread_author){
        return $http({
          method:"PUT",
          url:"/add_feed_top/" + thread_id + "/" + el.id
        })

      }



    })

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
