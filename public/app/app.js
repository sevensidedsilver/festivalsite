angular.module('app', ['ui.router'])






    .config(function($stateProvider, $urlRouterProvider){
      //$urlRouterProvider.when("login", window.location = "http://localhost:3000/auth")

      $stateProvider
        .state('home', {
            url: '/',
            templateUrl: "./app/views/home/home.html"

        })
        .state('prepare', {
          url: '/prepare',
          templateUrl: "./app/views/prepare.html"
        })

        .state('principles', {
          url: '/principles',
          templateUrl: "./app/views/principles.html",
          controller: "principles",
          service: "principles"
        })

        .state('fire', {
          url: '/fire',
          templateUrl: "./app/views/fire.html"
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
                          $window.location = "https://shrouded-brook-34453.herokuapp.com/#!/auth"
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
                          window.location = "https://shrouded-brook-34453.herokuapp.com/#!/auth"
                      } return response.data
                  }).catch(err => {
                      window.location = "https://shrouded-brook-34453.herokuapp.com/#!/auth"
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
                            window.location = "https://shrouded-brook-34453.herokuapp.com/#!/auth"
                        } return response.data
                    }).catch(err => {
                        window.location = "https://shrouded-brook-34453.herokuapp.com/#!/auth"
                    })
                }
              }
          })

// example from dallin
          .state('admin', {
             templateUrl: './app/views/forum/admin.html',
             url: '/admin',
               controller: 'adminController',
               resolve: {
                 user: (authService, $state) => {
                     return authService.getCurrentUser().then((response) => {
                       //console.log(response.data.user[2])
                        if (response.data.user[2] === 0) {
                          window.alert("You are not an admin.")
                          $state.go('forum')
                        }

                         if(!response.data) {
                             window.location = "https://shrouded-brook-34453.herokuapp.com/#!/auth"
                         } return response.data
                     }).catch(err => {
                         window.location = "https://shrouded-brook-34453.herokuapp.com/#!/auth"
                     })
                 }
               }
           })


        $urlRouterProvider
            .otherwise('/')
    })
