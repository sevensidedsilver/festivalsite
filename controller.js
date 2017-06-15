angular.module('app').controller('homeCtrl', function($scope, homeSrv){

// show the menu on click
  $scope.menuclass = "mobile-menu"
  $scope.togglemenu = function(){
    if ($scope.menuclass === "mobile-menu"){
      $scope.menuclass = "mobile-menu show-mobile-menu"
    } else if ($scope.menuclass === "mobile-menu show-mobile-menu"){
      $scope.menuclass = "mobile-menu"
    }
  }

  $scope.hideMenu = function (){
    $scope.menuclass = "mobile-menu"
  }


})
