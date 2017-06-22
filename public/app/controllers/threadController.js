angular.module('app').controller('thread', function($scope, $http, $window, $stateParams, homeSrv){


  // //fetches the thread data from service and assigns it to thread
  homeSrv.findThread($stateParams.thread_id).then(function(resp){
    //console.log(resp)
    $scope.thread = resp.data[0]

    $scope.thread.timeAgo = (moment($scope.thread.created_at, "YYYYMMDD, h:mm:ss").fromNow())
  })
  // console.log($stateParams.thread_id)




// '/'/'/'/'/'/'/'/'/'/'/'/
// submit a new top level comment to a thread
  $scope.addComment = function(){
    console.log("fire")
    var data = {
      thread_id: $scope.thread.thread_id,
      parent_comment: 0,
      author_display: ""
    }



  }







// END OF MODULE ///////////////////////////////////////////////////////////////
})
