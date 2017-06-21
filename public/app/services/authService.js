angular.module('app').service('authService', function($http){

  // returns the current user object from auth0
  this.getCurrentUser = function () {
    //console.log("test")
    return $http.get('/auth/me').then(function(response){
      //console.log(response)
      return response

    })

  }


  this.test = function(){

    return $http({
      method: "GET",
      url: "/auth/me"
    }).then(function(res){
      //console.log(res)
    }).catch(function(error){
      //console.log(error)
    })

  }

})
