angular.module('app').service('threadService', function($http){



// post http posts to database
this.postThread = function(data){
  return $http({
    method: "POST",
    url: "/newthread",
    data: data
  })
},

// get top level comments for a threadService
this.getTopLevelComments = function(data){
  return $http({
    method:"GET",
    url:"/gettoplevelcomments/" + data

  }).then(function(resp){

    return resp
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
