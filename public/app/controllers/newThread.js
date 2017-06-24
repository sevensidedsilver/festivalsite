angular.module('app').controller('newPostCtrl', function(postService, $state, threadService, authService, $scope, $http, $window, $stateParams, homeSrv){


  //create post on button click and push to database

  $scope.postNewThread = function(){
    var data = {
      thread_author: $scope.display_name,
      thread_title: $scope.postTitle,
      thread_content: $scope.postText,
//new Date(year, month, day, hours, minutes, seconds)
    }
  //  console.log(data.created_at)
    threadService.postThread(data).then(function(resp){
      // whatever you want to do after the posting goes here!
      $scope.postTitle = "";
      $scope.postText = "";
      $state.go('forum')


    })
}


  //this gets the session and pulls the displayName from it
  $http({
     method: "GET",
     url: '/auth/me'
   }).then((response) => {

         if(!response.data.user) {
             $window.location = "http://localhost:3000/auth"
             defer.reject()
         } else {
           console.log(response.data.user[0].username)
           $scope.display_name = response.data.user[0].username

         }
     })





})
