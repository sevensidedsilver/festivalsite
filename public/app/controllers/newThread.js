angular.module('app').controller('newPostCtrl', function(postService, $state, threadService, authService, $scope, $http, $window, $stateParams, homeSrv){


  //create post on button click and push to database

  $scope.postNewThread = function(){
    // threadService.unReadThread()
    var data = {
      thread_author: $scope.display_name,
      thread_title: $scope.postTitle,
      thread_content: $scope.postText,
    }
    if (data.thread_title.length >= 5) {
      threadService.postThread(data).then(function(resp){
        // whatever you want to do after the posting goes here!
        $scope.postTitle = "";
        $scope.postText = "";
        $state.go('forum')
      })
    } else {
      alert("Post titles must contain at least 5 characters!")
    }



}


  //this gets the session and pulls the displayName from it
  $http({
     method: "GET",
     url: '/auth/me'
   }).then((response) => {

         if(response.data.user === false) {
             $window.location = "http://rhapsodyfestival.com/auth"
             defer.reject()
         } else {
        //  console.log(response.data.user)
          $scope.display_name = response.data.user[1]

          //  console.log(response.data.user[0].username)


         }
     })





})
