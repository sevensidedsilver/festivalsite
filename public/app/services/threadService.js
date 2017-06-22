angular.module('app').service('threadService', function($http){



// post http
this.postThread = function(data){
  return $http({
    method: "POST",
    url: "/newthread",
    data: data
  })
}


})
