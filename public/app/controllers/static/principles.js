angular.module('app').controller('principles', function(adminService, $state, threadService, authService, $scope, $http, $window, $stateParams, principlesService){

  $scope.principles = principlesService.principles

  $scope.random = function() {
    return 0.5 - Math.random();
}

})
