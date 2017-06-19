'use strict';

angular.module('app', ['ui.router']).config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: "./app/views/home/home.html"
    }).state('forum', {
        url: '/forum',
        templateUrl: "./app/views/forum/forum.html",
        title: 'Rha - Phorum'

    }).state('addpost', {
        url: '/addpost',
        templateUrl: "./app/views/forum/addpost.html"

    }).state('thread', {
        url: '/thread/:id',
        templateUrl: "./app/views/forum/thread.html"

    });
    $urlRouterProvider.otherwise('/');
});
'use strict';

angular.module('app').controller('homeCtrl', function ($scope, $stateParams, homeSrv) {

  // show the menu on click
  $scope.menuclass = "mobile-menu";
  $scope.togglemenu = function () {
    if ($scope.menuclass === "mobile-menu") {
      $scope.menuclass = "mobile-menu show-mobile-menu";
    } else if ($scope.menuclass === "mobile-menu show-mobile-menu") {
      $scope.menuclass = "mobile-menu";
    }
  };

  $scope.hideMenu = function () {
    $scope.menuclass = "mobile-menu";
  };
  $scope.threads = homeSrv.dummyThreads;

  // console.log($stateParams)

});
'use strict';

angular.module('app').service('homeSrv', function () {
  this.serviceTest = "we are testing the service";

  this.dummyThreads = [{ id: 1,
    author: 'sparklePony666',
    title: "Is it safe to camp next to temple?",
    text: "I made a kevlar tarp for my tent and am pretty sure the tent won't melt under it. What do you think?",
    time: 1497558123
  }, { id: 2,
    author: "djGon",
    title: "Do I have to register poofers?",
    text: "I made a kevlar tarp for my tent and am pretty sure the tent won't melt under it. What do you think?",
    time: 1497559123
  }, { id: 3,
    author: "babygypsy",
    title: "I don't want to park in the mud, parking honestly seems like a disaster in general.",
    text: "this is bs ect ect ecte the tent won't melt under it. What do you think?",
    time: 1497558523
  }, { id: 4,
    author: "Pez",
    title: "Parking needs more volunteers people",
    text: "we need a lot more shifts filled",
    time: 1497548521
  }];
});