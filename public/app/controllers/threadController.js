angular.module('app').controller('thread', function($scope, $state, threadService, $http, $window, $stateParams, homeSrv){

  // get the display_name from the session object
  $http({
     method: "GET",
     url: '/auth/me'
   }).then((response) => {

         if(!response.data.user) {
             $window.location = "http://www.rhapsodyfestival.com/auth"
             defer.reject()
         } else {
           //console.log(response.data.user)
           $scope.display_name = response.data.user[1];
           $scope.user_id = response.data.user[0]


         }
     })

  // remove thread from feed_top if user has it in that array
  $scope.removeFromTop = function(user_id, thread_id) {
    // console.log(user_id, thread_id)
    threadService.removeFromTop(user_id, thread_id).then((resp)=>{
        resp.forEach((el)=>{
          if (el == thread_id) {
            threadService.remove_top(user_id, thread_id)
          }

        })
    })
  }


  // display all the top level comments for a thread
    $scope.getcomments = function(){
    //  console.log($scope.thread.thread_id)
      let data = $scope.thread.thread_id

      threadService.getTopLevelComments(data).then(function(resp){

        $scope.comments = resp.data
        //console.log(resp.data)


      })

  }


  // //fetches the thread data from service and assigns it to thread
  homeSrv.findThread($stateParams.thread_id).then(function(resp){
    //console.log(resp)
    $scope.thread = resp.data[0]

    $scope.thread.timeAgo = (moment($scope.thread.created_at, "YYYYMMDD, h:mm:ss").fromNow())
    $scope.getcomments()


    $scope.isItStarred($scope.user_id, $scope.thread.thread_id)

    $scope.removeFromTop($scope.user_id, $scope.thread.thread_id)
  })
  // console.log($stateParams.thread_id)





// thread is starred or NOT star
$scope.isItStarred = function(user_id, thread_id){
   threadService.isItStarred(user_id, thread_id).then(function(resp){
    $scope.starred = resp
  })
}

// toggle star on
$scope.starThis = function(user_id, thread_id){
  // console.log("controller sending" , user_id, thread_id)

  threadService.starThis(user_id, thread_id).then(function(resp){
    $scope.starred = resp
  })
}

// toggle star off
$scope.unStarThis = function(user_id, thread_id){
  // console.log("controller sending", user_id, thread_id)

  threadService.unStarThis(user_id, thread_id).then(function(resp){
    //console.log(resp)
    $scope.starred = resp
  })
}










// '/'/'/'/'/'/'/'/'/'/'/'/
// submit a new top level comment to a thread
  $scope.addComment = function(){
    //console.log("fire")
    var data = {
      thread_id: $scope.thread.thread_id,
      parent_comment: 0,
      author_display: $scope.display_name,
      comment_content: $scope.comment_content,
      author_id: $scope.user_id
    }
    if (data.comment_content.length >= 5) {
      threadService.createComment(data).then(function(resp){
        // after clicking the button, do this!
        $scope.comment_content = "";
        //$scope.comments.push(data)
        $scope.getcomments()

        // find every user that has this thread starred!
        threadService.feed_top(data)

        // add this thread to their feed_top array



      })
    } else {alert("comments must have at least 5 characters!")}

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

// hide a comment thread =========================================== HIDE

  $scope.onHide = true
  $scope.togglecomment = function($event, comment) {
    if (angular.element($event.target).parent().parent().parent().hasClass('hide')){
          angular.element($event.target).parent().parent().parent().removeClass('hide');
          comment.hideShow = "[–]"
          angular.element($event.target).removeClass('showBlue')
    } else {
          angular.element($event.target).parent().parent().parent().addClass('hide');
          angular.element($event.target).val()
          comment.hideShow = "[+]"
          angular.element($event.target).addClass('showBlue')
    }


  }




// post a reply comment
//show the reply action area
  $scope.replyComment = function(comment){
        comment.showCommentReplyTextBox = true;
  }

// post the reply
  $scope.addChildComment = function(comment){
    let data = {
      thread_id: $scope.thread.thread_id,
      parent_comment: comment.comment_id,
      author_display: $scope.display_name,
      comment_content: comment.child_comment_content
    }
    if (data.comment_content.length >= 3){
      threadService.createComment(data).then(function(resp){
        // after clicking the button, do this!
        comment.child_comment_content = "";
        $scope.getcomments()
      })

    } else (alert("replies to comments need at least 3 characters!"))


  }

//cancel the reply
  $scope.replyCommentCancel = function(comment){
    comment.showCommentReplyTextBox = false;
  }


// END OF MODULE ///////////////////////////////////////////////////////////////
})
