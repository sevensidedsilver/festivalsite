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
        templateUrl: './app/views/forum/admin.html',
        url: '/admin',
        controller: 'adminController',
        resolve: {
            user: function user(authService, $state) {
                return authService.getCurrentUser().then(function (response) {
                    //console.log(response.data.user[2])
                    if (response.data.user[2] === 0) {
                        window.alert("You are not an admin.");
                        $state.go('forum');
                    }

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

angular.module('app').controller('adminController', function (adminService, $state, threadService, authService, $scope, $http, $window, $stateParams, homeSrv) {

  // get all reported comments
  $scope.getReportedComments = function () {
    adminService.getReportedComments().then(function (resp) {
      $scope.comments = resp.data;
    });
  };
  $scope.getReportedComments();

  // get all reported threads
  $scope.getReportedThreads = function () {
    adminService.getReportedThreads().then(function (resp) {
      $scope.threads = resp.data;
    });
  };
  $scope.getReportedThreads();

  // deletes a comment
  $scope.deleteComment = function (comment_id) {

    adminService.deleteComment(comment_id).then(function (resp) {
      return resp;
    });
  };

  // dismiss comment reported
  $scope.dismissComment = function (comment_id) {

    adminService.dismissComment(comment_id).then(function (resp) {
      return resp;
    });
  };

  // deletes a thread
  $scope.deleteThread = function (thread_id) {
    adminService.deleteThread(thread_id).then(function (resp) {
      return resp;
    });
  };

  //dismiss thread report
  $scope.dismissThread = function (thread_id) {
    adminService.dismissThread(thread_id).then(function (resp) {
      return resp;
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
      $scope.admin = {
        display_name: $scope.display_name

      };
    }
  });
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
      console.log(response.data.user[0].username);
      $scope.display_name = response.data.user[0].username;
    }
  });
});
'use strict';

angular.module('app').controller('thread', function ($scope, $state, threadService, $http, $window, $stateParams, homeSrv) {

  // display all the top level comments for a thread
  $scope.getcomments = function () {
    //  console.log($scope.thread.thread_id)
    var data = $scope.thread.thread_id;

    threadService.getTopLevelComments(data).then(function (resp) {

      resp.data.forEach(function (el) {

        el.timeAgo = moment(el.created_at, "YYYYMMDD, h:mm:ss").fromNow();
      });

      $scope.topLevelComments = resp.data;

      //  console.log($scope.topLevelComments)
    });
  };

  // //fetches the thread data from service and assigns it to thread
  homeSrv.findThread($stateParams.thread_id).then(function (resp) {
    //console.log(resp)
    $scope.thread = resp.data[0];

    $scope.thread.timeAgo = moment($scope.thread.created_at, "YYYYMMDD, h:mm:ss").fromNow();
    $scope.getcomments();
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

      $scope.display_name = response.data.user[0].username;
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
      $scope.topLevelComments.push(data);
    });
  };

  // report thread =====================================

  $scope.reportThread = function (thread_id) {
    threadService.reportThread(thread_id).then(function (resp) {
      alert("Thanks, an admin will review your report soon");
    });
  };

  // report a comment ===============================
  $scope.reportComment = function (data) {
    threadService.reportcomment(data).then(function (resp) {
      alert("Thanks, an admin will review your report soon");
    });
  };

  // END OF MODULE ///////////////////////////////////////////////////////////////
});
'use strict';

angular.module('app').service('adminService', function ($http) {

  this.getReportedComments = function () {
    return $http({
      method: "GET",
      url: "/reportedcomments"
    }).then(function (resp) {
      return resp;
    });
  };

  this.getReportedThreads = function () {
    return $http({
      method: "GET",
      url: "/reportedthreads"

    }).then(function (resp) {
      return resp;
    });
  };
  // delete comment
  this.deleteComment = function (comment_id) {
    //console.log(comment_id)
    return $http({
      method: "DELETE",
      url: "/delete/comments/comment_id/" + comment_id
      //data must be an object!

    }).then(function (resp) {
      //console.log(data)
      return resp;
    });
  };
  // delete thread
  this.deleteThread = function (thread_id) {

    return $http({
      method: "DELETE",
      url: "/delete/threads/thread_id/" + thread_id
      //data must be an object!

    }).then(function (resp) {
      //console.log(data)
      return resp;
    });
  };
  // dismiss comment
  this.dismissComment = function (comment_id) {

    return $http({
      method: "PUT",
      url: "/dismisscomment/" + comment_id

    }).then(function (resp) {
      return resp;
    });
  };
  // dismiss thread
  this.dismissThread = function (thread_id) {

    return $http({
      method: "PUT",
      url: "/dismissthread/" + thread_id

    }).then(function (resp) {
      return resp;
    });
  };
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
  },

  // get top level comments for a threadService
  this.getTopLevelComments = function (data) {
    return $http({
      method: "GET",
      url: "/gettoplevelcomments/" + data

    }).then(function (resp) {

      return resp;
    });
  };

  // post comment
  this.createComment = function (data) {
    return $http({
      method: "POST",
      url: "/newcomment",
      data: data
    });
  },

  // report a comment
  this.reportcomment = function (data) {
    // console.log(data)
    return $http({
      method: "PUT",
      url: "/reportcomment/" + data
    });
  }, this.reportThread = function (data) {
    return $http({
      method: "PUT",
      url: "/reportthread/" + data
    });
  };
});
//# sourceMappingURL=all.js.map
