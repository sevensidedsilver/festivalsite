angular.module('app').controller('homeCtrl', function($scope, homeSrv){

  $scope.test = "testing controller"

  $scope.service = homeSrv.serviceTest

})
