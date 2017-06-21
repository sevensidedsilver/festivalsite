angular.module('app').controller('forumCtrl', function(authService, $scope, $stateParams, homeSrv){




    $scope.getThreads = function(){

      homeSrv.openThreads().then(function(resp){

        $scope.threads = resp.data

      })

  }

    $scope.getThreads()


    $scope.time = moment("20170621, 7:14:44", "YYYYMMDD, h:mm:ss").fromNow();



})
