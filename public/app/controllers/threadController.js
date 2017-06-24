angular.module('app').controller('thread', function($scope, $state, threadService, $http, $window, $stateParams, homeSrv){


  // display all the top level comments for a thread
    $scope.getcomments = function(){
    //  console.log($scope.thread.thread_id)
      let data = $scope.thread.thread_id

      threadService.getTopLevelComments(data).then(function(resp){


        resp.data.forEach(function(el){

          el.timeAgo = (moment(el.created_at, "YYYYMMDD, h:mm:ss").fromNow())
        })

        $scope.topLevelComments = resp.data

      //  console.log($scope.topLevelComments)
      })

  }


  // //fetches the thread data from service and assigns it to thread
  homeSrv.findThread($stateParams.thread_id).then(function(resp){
    //console.log(resp)
    $scope.thread = resp.data[0]

    $scope.thread.timeAgo = (moment($scope.thread.created_at, "YYYYMMDD, h:mm:ss").fromNow())
    $scope.getcomments()
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

         $scope.display_name = response.data.user[0].username

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
      $scope.topLevelComments.push(data)
    })
  }

// report thread =====================================

$scope.reportThread = function(thread_id){
    threadService.reportThread(thread_id).then(function(resp){
      alert("Thanks, an admin will review your report soon")
    })
}

// report a comment ===============================
  $scope.reportComment = function(data){
    threadService.reportcomment(data).then(function(resp){
      alert("Thanks, an admin will review your report soon");
    })
  }




// END OF MODULE ///////////////////////////////////////////////////////////////
})
