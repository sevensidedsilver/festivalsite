angular.module('app').controller('thread', function($scope, $http, $window, $stateParams, homeSrv){


  // //fetches the thread data from service and assigns it to thread
  homeSrv.findThread($stateParams.thread_id).then(function(resp){
    //console.log(resp)
    $scope.thread = resp.data[0]




  })
  // console.log($stateParams.thread_id)

})
