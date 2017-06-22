angular.module('app').controller('forumCtrl', function(authService, $scope, $stateParams, homeSrv){




    $scope.getThreads = function(){

      homeSrv.openThreads().then(function(resp){
        //console.log(resp)

        resp.data.forEach(function(el){

          el.timeAgo = (moment(el.created_at, "YYYYMMDD, h:mm:ss").fromNow())
        })
        $scope.threads = resp.data
      })

  }

    $scope.getThreads()




})
