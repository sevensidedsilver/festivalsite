'use strict';

angular.module('app', ['ui.router']).config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider.state('home', {
        url: '/',
        templateUrl: "./app/views/home/home.html"

    }).state('prepare', {
        url: '/prepare',
        templateUrl: "./app/views/prepare.html"
    }).state('principles', {
        url: '/principles',
        templateUrl: "./app/views/principles.html",
        controller: "principles",
        service: "principles"
    }).state('fire', {
        url: '/fire',
        templateUrl: "./app/views/fire.html"
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
                        $window.location = "https://shrouded-brook-34453.herokuapp.com/auth";
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
                        window.location = "https://shrouded-brook-34453.herokuapp.com/auth";
                    }return response.data;
                }).catch(function (err) {
                    window.location = "https://shrouded-brook-34453.herokuapp.com/auth";
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
                        window.location = "https://shrouded-brook-34453.herokuapp.com/auth";
                    }return response.data;
                }).catch(function (err) {
                    window.location = "https://shrouded-brook-34453.herokuapp.com/auth";
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
                        window.location = "https://shrouded-brook-34453.herokuapp.com/auth";
                    }return response.data;
                }).catch(function (err) {
                    window.location = "https://shrouded-brook-34453.herokuapp.com/auth";
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
      $window.location = "https://shrouded-brook-34453.herokuapp.com/auth";
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
    // threadService.unReadThread()
    var data = {
      thread_author: $scope.display_name,
      thread_title: $scope.postTitle,
      thread_content: $scope.postText
    };
    if (data.thread_title.length >= 5) {
      threadService.postThread(data).then(function (resp) {
        // whatever you want to do after the posting goes here!
        $scope.postTitle = "";
        $scope.postText = "";
        $state.go('forum');
      });
    } else {
      alert("Post titles must contain at least 5 characters!");
    }
  };

  //this gets the session and pulls the displayName from it
  $http({
    method: "GET",
    url: '/auth/me'
  }).then(function (response) {

    if (response.data.user === false) {
      $window.location = "https://shrouded-brook-34453.herokuapp.com/auth";
      defer.reject();
    } else {
      //  console.log(response.data.user)
      $scope.display_name = response.data.user[1];

      //  console.log(response.data.user[0].username)

    }
  });
});
'use strict';

angular.module('app').controller('thread', function ($scope, $state, threadService, $http, $window, $stateParams, homeSrv) {

  // get the display_name from the session object
  $http({
    method: "GET",
    url: '/auth/me'
  }).then(function (response) {

    if (!response.data.user) {
      $window.location = "http://localhost:3000/auth";
      defer.reject();
    } else {
      //console.log(response.data.user)
      $scope.display_name = response.data.user[1];
      $scope.user_id = response.data.user[0];
    }
  }

  // display all the top level comments for a thread
  );$scope.getcomments = function () {
    //  console.log($scope.thread.thread_id)
    var data = $scope.thread.thread_id;

    threadService.getTopLevelComments(data).then(function (resp) {

      $scope.comments = resp.data;
      //console.log(resp.data)

    });
  };

  // //fetches the thread data from service and assigns it to thread
  homeSrv.findThread($stateParams.thread_id).then(function (resp) {
    //console.log(resp)
    $scope.thread = resp.data[0];

    $scope.thread.timeAgo = moment($scope.thread.created_at, "YYYYMMDD, h:mm:ss").fromNow();
    $scope.getcomments();

    $scope.isItStarred($scope.user_id, $scope.thread.thread_id);
  }
  // console.log($stateParams.thread_id)


  // thread is starred or NOT star
  );$scope.isItStarred = function (user_id, thread_id) {
    threadService.isItStarred(user_id, thread_id).then(function (resp) {
      $scope.starred = resp;
    });
  };

  // toggle star on
  $scope.starThis = function (user_id, thread_id) {
    // console.log("controller sending" , user_id, thread_id)

    threadService.starThis(user_id, thread_id).then(function (resp) {
      $scope.starred = resp;
    });
  };

  // toggle star off
  $scope.unStarThis = function (user_id, thread_id) {
    // console.log("controller sending", user_id, thread_id)

    threadService.unStarThis(user_id, thread_id).then(function (resp) {
      console.log(resp);
      $scope.starred = resp;
    });
  };

  // '/'/'/'/'/'/'/'/'/'/'/'/
  // submit a new top level comment to a thread
  $scope.addComment = function () {
    //console.log("fire")
    var data = {
      thread_id: $scope.thread.thread_id,
      parent_comment: 0,
      author_display: $scope.display_name,
      comment_content: $scope.comment_content
    };
    if (data.comment_content.length >= 5) {
      threadService.createComment(data).then(function (resp) {
        // after clicking the button, do this!
        $scope.comment_content = "";
        //$scope.comments.push(data)
        $scope.getcomments();
      });
    } else {
      alert("comments must have at least 5 characters!");
    }
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

  // hide a comment thread =========================================== HIDE
  $scope.togglecomment = function (comment_id) {};

  // post a reply comment
  //show the reply action area
  $scope.replyComment = function (comment) {
    comment.showCommentReplyTextBox = true;
  };

  // post the reply
  $scope.addChildComment = function (comment) {
    var data = {
      thread_id: $scope.thread.thread_id,
      parent_comment: comment.comment_id,
      author_display: $scope.display_name,
      comment_content: comment.child_comment_content
    };
    if (data.comment_content.length >= 3) {
      threadService.createComment(data).then(function (resp) {
        // after clicking the button, do this!
        comment.child_comment_content = "";
        $scope.getcomments();
      });
    } else alert("replies to comments need at least 3 characters!");
  };

  //cancel the reply
  $scope.replyCommentCancel = function (comment) {
    comment.showCommentReplyTextBox = false;
  };

  // END OF MODULE ///////////////////////////////////////////////////////////////
});
'use strict';

angular.module('app').directive('comments', function ($compile) {
  return {
    restrict: "E",
    // scope: {
    //   comment: "="
    // },
    templateUrl: "../app/directives/threadTemplate.html",
    link: function link(scope, element, attrs) {
      //check if this member has children
      if (scope.comment.children.length > 0) {
        // append the collection directive to this element
        $compile('<comments comment="comment" ng-repeat="comment in comment.children"></comments>')(scope, function (cloned, scope) {
          element.append(cloned);
        });
      }
    }

    // compile: function(element) {
    //     // Use the compile function from the RecursionHelper,
    //     // And return the linking function(s) which it returns
    //     return recursionHelper.compile(element);
    // }
  };
});

// templateUrl: "../app/directives/threadTemplate.html"
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

angular.module('app').service('recursion', function ($http) {});
'use strict';

angular.module('app').factory('recursionHelper', ['$compile', function ($compile) {
    // return {
    //     childAction: function(){
    //
    //
    //
    //
    //     }

    // /**
    //  * Manually compiles the element, fixing the recursion loop.
    //  * @param element
    //  * @param [link] A post-link function, or an object with function(s) registered via pre and post properties.
    //  * @returns An object containing the linking functions.
    //  */
    return { compile: function compile(element, link) {
            // Normalize the link parameter
            if (angular.isFunction(link)) {
                link = { post: link };
            }

            // Break the recursion loop by removing the contents
            var contents = element.contents().remove();
            var compiledContents;
            return {
                pre: link && link.pre ? link.pre : null,
                /**
                 * Compiles and re-adds the contents
                 */
                post: function post(scope, element) {
                    // Compile the contents
                    if (!compiledContents) {
                        compiledContents = $compile(contents);
                    }
                    // Re-add the compiled contents to the element
                    compiledContents(scope, function (clone) {
                        element.append(clone);
                    });

                    // Call the post-linking function, if any
                    if (link && link.post) {
                        link.post.apply(null, arguments);
                    }
                }
            };
        }
    };
}]);
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
  // mark new thread as unread for all users
  this.unReadThread = function (data) {
    return $http({
      method: "get",
      url: "/unreadthread",
      data: data
    });
  },

  // get top level comments for a threadService
  this.getTopLevelComments = function (data) {
    return $http({
      method: "GET",
      url: "/getallcomments/" + data

    }).then(function (resp) {
      //console.log(resp)
      return resp;
    });
  },

  /// is it starred?
  // check using the user id and the thread id passed from the controller
  this.isItStarred = function (user_id, thread_id) {
    // console.log("we have the ", user_id, thread_id)
    return $http({
      method: "GET",
      url: "/isitstarred/" + user_id + "/" + thread_id
    }).then(function (resp) {
      // console.log(resp.data)
      return resp.data;
    });
  },
  // toggle star on
  this.starThis = function (user_id, thread_id) {
    //console.log("we got here")
    return $http({
      method: "put",
      url: "/starthis/" + user_id + "/" + thread_id
    }).then(function (resp) {
      return resp.data;
    });
  },
  //toggle star off
  this.unStarThis = function (user_id, thread_id) {
    return $http({
      method: "put",
      url: "/unstarthis/" + user_id + "/" + thread_id
    }).then(function (resp) {
      // console.log(resp.data)
      return resp.data;
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
'use strict';

angular.module('app').controller('principles', function (adminService, $state, threadService, authService, $scope, $http, $window, $stateParams, principlesService) {

  $scope.principles = principlesService.principles;

  $scope.random = function () {
    return 0.5 - Math.random();
  };
});
'use strict';

angular.module('app').service('principlesService', function ($http) {

  this.principles = [{
    title: "Radical Self Reliance",
    text: "This event encourages you to discover and rely upon yourself. There's no food trucks or trash cans at the event!"
    //  image: "../app/images/principles/sel-reliance.jpg"
  }, {
    title: "Radical Inclusion",
    text: "Anyone may be apart of Rhapsody. There are no prerequisites for participation - we welcome the stranger."
    //  image: "../app/images/principles/sel-reliance.jpg"
  }, {
    title: "Gifting",
    text: "We devote ourselves to act of giving. Gifts are unconditional. Gifts do not exchange or contemplate returns!"
    //  image: "../app/images/principles/sel-reliance.jpg"
  }, {
    title: "Decommodification",
    text: "We discourage mediation of our environment by sponsorship, transactions, or advertising. Resist subsituting consumption for participation."
    //  image: "../app/images/principles/sel-reliance.jpg"
  }, {
    title: "Radical Self Expression",
    text: "This arises from the individual. Your expression is offered as a gift to others - respecting the rights/liberties of the recipient."
    //  image: "../app/images/principles/sel-reliance.jpg"
  }, {
    title: "Communal Effort",
    text: "We value collaboration! Everyone strives to create public and shared works of expression and communication."
    //  image: "../app/images/principles/sel-reliance.jpg"
  }, {
    title: "Civic Responsibility",
    text: "We value civility. Assume responsibility for anyone participating in something you've organized and act in accordance with the law."
    //  image: "../app/images/principles/sel-reliance.jpg"
  }, {
    title: "Leave No Trace",
    text: "Respect the environment. Clean up after yourselves and whenever possible, leave places in a better state than you found it in."
    //  image: "../app/images/principles/sel-reliance.jpg"
  }, {
    title: "Radical Participation",
    text: "Transformative change only comes through sincere personal participation. We believe in achieving through doing. Everone is invited to work and play."
    //  image: "../app/images/principles/sel-reliance.jpg"
  }, {
    title: "Immediacy",
    text: "There's no moment like the present. Overcome the barriers that stand between you, me, and our good times together! Recognize your inner self by acting purely in the moment."
    //  image: "../app/images/principles/sel-reliance.jpg"
  }];
});
//# sourceMappingURL=all.js.map
