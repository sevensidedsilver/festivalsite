angular.module('forum-app').controller('forum-controller', function($scope, forumSrv){

  $scope.test = forumSrv.serviceTest
})
