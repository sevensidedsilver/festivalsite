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
      //console.log(resp)

      resp.data.forEach(function (el) {

        el.timeAgo = moment(el.created_at, "YYYYMMDD, h:mm:ss").fromNow();
      });
      $scope.threads = resp.data;
    });
  };

  $scope.getThreads();
});
'use strict';

angular.module('app').controller('newPostCtrl', function (postService, $state, threadService, authService, $scope, $http, $window, $stateParams, homeSrv) {

  //create post on button click and push to database

  $scope.postNewThread = function () {
    var data = {
      thread_author: $scope.display_name,
      thread_title: $scope.postTitle,
      thread_content: $scope.postText
      //new Date(year, month, day, hours, minutes, seconds)

      //  console.log(data.created_at)
    };threadService.postThread(data).then(function (resp) {
      // whatever you want to do after the posting goes here!
      $scope.postTitle = "";
      $scope.postText = "";
      $state.go('forum');
    });
  };

  //this gets the session and pulls the displayName from it
  $http({
    method: "GET",
    url: '/auth/me'
  }).then(function (response) {

    if (!response.data.user) {
      $window.location = "http://localhost:3000/auth";
      defer.reject();
    } else {

      $scope.display_name = response.data.user[1];
      //  $http({
      //    method: "PUT",
      //    url
      //
      //  })
    }
  });
});
'use strict';

angular.module('app').controller('thread', function ($scope, $state, threadService, $http, $window, $stateParams, homeSrv) {

  // //fetches the thread data from service and assigns it to thread
  homeSrv.findThread($stateParams.thread_id).then(function (resp) {
    //console.log(resp)
    $scope.thread = resp.data[0];

    $scope.thread.timeAgo = moment($scope.thread.created_at, "YYYYMMDD, h:mm:ss").fromNow();
  }
  // console.log($stateParams.thread_id)

  // get the display_name from the session object
  );$http({
    method: "GET",
    url: '/auth/me'
  }).then(function (response) {

    if (!response.data.user) {
      $window.location = "http://localhost:3000/auth";
      defer.reject();
    } else {

      $scope.display_name = response.data.user[1];
    }
  }

  // '/'/'/'/'/'/'/'/'/'/'/'/
  // submit a new top level comment to a thread
  );$scope.addComment = function () {
    console.log("fire");
    var data = {
      thread_id: $scope.thread.thread_id,
      parent_comment: 0,
      author_display: $scope.display_name,
      comment_content: $scope.comment_content
    };
    threadService.createComment(data).then(function (resp) {
      // after clicking the button, do this!
      $scope.comment_content = "";
    });
  };

  // END OF MODULE ///////////////////////////////////////////////////////////////
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

  this.timeFrom = function (time) {
    return moment(time, "YYYYMMDD, h:mm:ss").startOf('seconds').fromNow();
  };
});
'use strict';

angular.module('app').service('threadService', function ($http) {

  // post http posts to database
  this.postThread = function (data) {
    return $http({
      method: "POST",
      url: "/newthread",
      data: data
    });
  };

  // post comment
  this.createComment = function (data) {
    return $http({
      method: "POST",
      url: "/newcomment",
      data: data

    });
  };
});
//# sourceMappingURL=all.js.map
