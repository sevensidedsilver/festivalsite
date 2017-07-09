angular.module('app', ['ui.router'])






    .config(function($stateProvider, $urlRouterProvider){

      $stateProvider
        .state('home', {
            url: '/',
            templateUrl: "./app/views/home/home.html"

        })
        .state('prepare', {
          url: '/prepare',
          templateUrl: "./app/views/prepare.html"
        })

        .state('events', {
          url: '/events',
          templateUrl: "./app/views/events/events.html",
          controller: "events",

        })
        .state('event', {
          url: '/event/:id',
          templateUrl: "./app/views/events/event.html",
          controller: "event",
        })
        .state('create-event', {
          url: '/create-event',
          controller: "events",
          templateUrl: "./app/views/events/create-event.html",
          resolve: {
            user: (authService, $state) => {
                return authService.getCurrentUser().then((response) => {
                  console.log(response.data.user[2])
                   if (response.data.user[2] === 0 || response.data.user[2] === undefined) {
                     window.alert("Only admins can create events.")
                     $state.go('forum')
                   }

                    if(!response.data) {
                        window.location = "http://www.rhapsodyfestival.com/auth"
                    } return response.data
                }).catch(err => {
                    window.location = "http://www.rhapsodyfestival.com/auth"
                })
            }
          }
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
                          $window.location = "http://www.rhapsodyfestival.com/auth"
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
                          window.location = "http://www.rhapsodyfestival.com/auth"
                      } return response.data
                  }).catch(err => {
                      window.location = "http://www.rhapsodyfestival.com/auth"
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
                            window.location = "http://www.rhapsodyfestival.com/auth"
                        } return response.data
                    }).catch(err => {
                        window.location = "http://www.rhapsodyfestival.com/auth"
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
                             window.location = "http://www.rhapsodyfestival.com/auth"
                         } return response.data
                     }).catch(err => {
                         window.location = "http://www.rhapsodyfestival.com/auth"
                     })
                 }
               }
           })


        $urlRouterProvider
            .otherwise('/')
    })
