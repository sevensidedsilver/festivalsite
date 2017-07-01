angular.module('app').controller('adminController', function(adminService, $state, threadService, authService, $scope, $http, $window, $stateParams, homeSrv){


// get all reported comments
$scope.getReportedComments = function(){
  adminService.getReportedComments().then(function(resp){
    $scope.comments = resp.data
  })
}
$scope.getReportedComments();


// get all reported threads
$scope.getReportedThreads = function(){
  adminService.getReportedThreads().then(function(resp){
    $scope.threads = resp.data
  })
}
$scope.getReportedThreads();

// deletes a comment
$scope.deleteComment = function(comment_id){

  adminService.deleteComment(comment_id).then(function(resp){
    return resp
  })
}

// dismiss comment reported
$scope.dismissComment = function(comment_id){

  adminService.dismissComment(comment_id).then(function(resp){
    return resp
  })
}

// deletes a thread
$scope.deleteThread = function(thread_id){
  adminService.deleteThread(thread_id).then(function(resp){
    return resp
  })
}

//dismiss thread report
$scope.dismissThread = function(thread_id){
  adminService.dismissThread(thread_id).then(function(resp){
    return resp
  })
}



  //this gets the session and pulls the displayName from it
  $http({
     method: "GET",
     url: '/auth/me'
   }).then((response) => {

         if(!response.data.user) {
             $window.location = "http://www.rhapsodyfestival.com/auth"
             defer.reject()
         } else {

           $scope.display_name = response.data.user[1]
           $scope.admin = {
             display_name : $scope.display_name

           }

         }
     })





})
