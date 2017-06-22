angular.module('app').service('threadService', function($http){



// post http posts to database
this.postThread = function(data){
  return $http({
    method: "POST",
    url: "/newthread",
    data: data
  })
}


// post comment
this.createComment = function(data){
  return $http({
    method: "POST",
    url: "/newcomment",
    data: data

  })


}

})
