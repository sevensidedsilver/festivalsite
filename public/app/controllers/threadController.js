angular.module('app').controller('thread', function($scope, $state, threadService, $http, $window, $stateParams, homeSrv){


  // //fetches the thread data from service and assigns it to thread
  homeSrv.findThread($stateParams.thread_id).then(function(resp){
    //console.log(resp)
    $scope.thread = resp.data[0]

    $scope.thread.timeAgo = (moment($scope.thread.created_at, "YYYYMMDD, h:mm:ss").fromNow())
  })
  // console.log($stateParams.thread_id)

// get the display_name from the session object
$http({
   method: "GET",
   url: '/auth/me'
 }).then((response) => {

       if(!response.data.user) {
           $window.location = "http://localhost:3000/auth"
           defer.reject()
       } else {

         $scope.display_name = response.data.user[1]

       }
   })


// '/'/'/'/'/'/'/'/'/'/'/'/
// submit a new top level comment to a thread
  $scope.addComment = function(){
    console.log("fire")
    var data = {
      thread_id: $scope.thread.thread_id,
      parent_comment: 0,
      author_display: $scope.display_name,
      comment_content: $scope.comment_content
    }
    threadService.createComment(data).then(function(resp){
      // after clicking the button, do this!
      $scope.comment_content = "";


    })

  }







// END OF MODULE ///////////////////////////////////////////////////////////////
})
