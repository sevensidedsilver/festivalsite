'use strict';

angular.module('app', ['ui.router']).config(function ($stateProvider, $urlRouterProvider) {
    //$urlRouterProvider.when("login", window.location = "http://localhost:3000/auth")

    $stateProvider.state('home', {
        url: '/',
        templateUrl: "./app/views/home/home.html"

    }

    // login state
    ).state('login', {
        url: '/auth'

    }

    // the forum
    ).state('forum', {
        url: '/forum',
        templateUrl: "./app/views/forum/forum.html",
        title: 'Rha - Phorum',
        controller: 'forumCtrl',
        resolve: {
            user: function user(authService, $q, $state, $http, $window) {
                var defer = $q.defer();
                $http({
                    method: "GET",
                    url: '/auth/me'
                }).then(function (response) {

                    if (!response.data.user) {
                        $window.location = "http://localhost:3000/auth";
                        defer.reject();
                    } else {
                        defer.resolve(response.data);
                    }
                });
            }
        }
    }).state('addpost', {
        url: '/addpost',
        controller: 'newPostCtrl',
        templateUrl: "./app/views/forum/addpost.html",
        resolve: {
            user: function user(authService, $state) {
                return authService.getCurrentUser().then(function (response) {
                    if (!response.data) {
                        window.location = "http://localhost:3000/auth";
                    }return response.data;
                }).catch(function (err) {
                    window.location = "http://localhost:3000/auth";
                });
            }
        }
    }
    // up in a thread
    ).state('thread', {
        url: '/thread/:thread_id',
        templateUrl: "./app/views/forum/thread.html",

        //needs controller
        controller: "thread",
        resolve: {
            user: function user(authService, $state) {
                return authService.getCurrentUser().then(function (response) {
                    if (!response.data) {
                        window.location = "http://localhost:3000/auth";
                    }return response.data;
                }).catch(function (err) {
                    window.location = "http://localhost:3000/auth";
                });
            }
        }
    }

    // example from dallin
    ).state('admin', {
        templateUrl: 'views/adminView.html',
        url: '/admin',
        controller: 'mainCtrl',
        resolve: {
            user: function user(authService, $state) {
                return authService.getCurrentUser().then(function (response) {
                    if (!response.data) {
                        window.location = "http://localhost:3000/auth";
                    }return response.data;
                }).catch(function (err) {
                    window.location = "http://localhost:3000/auth";
                });
            }
        }
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

  $scope.getThreads = function () {

    homeSrv.openThreads().then(function (resp) {
      // console.log(resp.data)
      $scope.threads = resp.data;
    });
  };

  $scope.getThreads

  // assign threads to the scope


  ();
});
'use strict';

angular.module('app').controller('forumCtrl', function (authService, $scope, $stateParams, homeSrv) {

  $scope.getThreads = function () {

    homeSrv.openThreads().then(function (resp) {

      $scope.threads = resp.data;
    });
  };

  $scope.getThreads();

  $scope.time = moment("20170621, 7:14:44", "YYYYMMDD, h:mm:ss").fromNow();
});
'use strict';

angular.module('app').controller('newPostCtrl', function (postService, $state, authService, $scope, $http, $window, $stateParams, homeSrv) {

  //create post on button click and push to database

  $scope.postNewThread = function () {
    var data = {
      thread_author: $scope.display_name,
      thread_title: $scope.postTitle,
      thread_content: $scope.postText
    };

    $http({
      method: "POST",
      url: "/newthread",
      data: data
    }).then(function () {
      // whatever you want to do after the posting goes here!
      $scope.postTitle = "";
      $scope.postText = "";
      $state.go('forum');
    });
  };

  // this gets the session and pulls the displayName from it
  $http({
    method: "GET",
    url: '/auth/me'
  }).then(function (response) {

    if (!response.data.user) {
      $window.location = "http://localhost:3000/auth";
      defer.reject();
    } else {

      $scope.display_name = response.data.user.displayName;
    }
  });
});
'use strict';

angular.module('app').controller('thread', function ($scope, $http, $window, $stateParams, homeSrv) {

  // //fetches the thread data from service and assigns it to thread
  homeSrv.findThread($stateParams.thread_id).then(function (resp) {
    //console.log(resp)
    $scope.thread = resp.data[0];
  }
  // console.log($stateParams.thread_id)

  );
});
'use strict';

angular.module('app').service('authService', function ($http) {

  // returns the current user object from auth0
  this.getCurrentUser = function () {
    //console.log("test")
    return $http.get('/auth/me').then(function (response) {
      //console.log(response)
      return response;
    });
  };

  this.test = function () {

    return $http({
      method: "GET",
      url: "/auth/me"
    }).then(function (res) {
      //console.log(res)
    }).catch(function (error) {
      //console.log(error)
    });
  };
});
'use strict';

angular.module('app').service('postService', function ($http) {

  // returns the current user object from auth0
  this.getCurrentUser = function () {
    //console.log("test")
    return $http.get('/auth/me').then(function (response) {
      //console.log(response)
      return response;
    });
  };

  this.test = function () {

    return $http({
      method: "GET",
      url: "/auth/me"
    }).then(function (res) {
      //console.log(res)
    }).catch(function (error) {
      //console.log(error)
    });
  };
});
'use strict';

angular.module('app').service('homeSrv', function ($http) {

  this.openThreads = function () {
    return $http({
      url: '/threads',
      method: 'GET'
    }).then(function (resp) {
      return resp;
    });
  };

  this.findThread = function (id) {
    return $http({
      url: '/thread/' + id,
      method: 'GET'
    }).then(function (resp) {
      return resp;
    });
  };

  // moment JS to get the "X hours ago" for comments and threads
  this.liveTime = function (time) {
    //conver dis 2017-06-21T15:44:08.049Z


    //into dis 20170621, h:mm:ss

  };
});
//# sourceMappingURL=all.js.map
