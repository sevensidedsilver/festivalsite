angular.module('app', ['ui.router'])






    .config(function($stateProvider, $urlRouterProvider){
      //$urlRouterProvider.when("login", window.location = "http://localhost:3000/auth")

      $stateProvider
        .state('home', {
            url: '/',
            templateUrl: "./app/views/home/home.html"

        })

// login state
        .state('login', {
            url: '/auth'

        })

// the forum
        .state('forum', {
            url: '/forum',
            templateUrl: "./app/views/forum/forum.html",
            title: 'Rha - Phorum',
            controller: 'forumCtrl',
            resolve:{
              user: function (authService, $q, $state, $http, $window) {
                var defer = $q.defer()
               $http({
                  method: "GET",
                  url: '/auth/me'
                }).then((response) => {

                      if(!response.data.user) {
                          $window.location = "http://localhost:3000/auth"
                          defer.reject()
                      } else {defer.resolve(response.data)}
                  })
              }
            }
        } )

        .state('addpost', {
            url: '/addpost',
            controller: 'newPostCtrl',
            templateUrl: "./app/views/forum/addpost.html",
            resolve: {
              user: (authService, $state) => {
                  return authService.getCurrentUser().then((response) => {
                      if(!response.data) {
                          window.location = "http://localhost:3000/auth"
                      } return response.data
                  }).catch(err => {
                      window.location = "http://localhost:3000/auth"
                  })
              }
            }
        } )
        // up in a thread
        .state('thread', {
              url: '/thread/:thread_id',
              templateUrl: "./app/views/forum/thread.html",

              //needs controller
              controller: "thread",
              resolve: {
                user: (authService, $state) => {
                    return authService.getCurrentUser().then((response) => {
                        if(!response.data) {
                            window.location = "http://localhost:3000/auth"
                        } return response.data
                    }).catch(err => {
                        window.location = "http://localhost:3000/auth"
                    })
                }
              }
          })

// example from dallin
          .state('admin', {
             templateUrl: 'views/adminView.html',
             url: '/admin',
               controller: 'mainCtrl',
               resolve: {
                 user: (authService, $state) => {
                     return authService.getCurrentUser().then((response) => {
                         if(!response.data) {
                             window.location = "http://localhost:3000/auth"
                         } return response.data
                     }).catch(err => {
                         window.location = "http://localhost:3000/auth"
                     })
                 }
               }
           })


        $urlRouterProvider
            .otherwise('/')
    })
