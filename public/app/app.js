angular.module('app', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider){
      $stateProvider
        .state('home', {
            url: '/',
            templateUrl: "./app/views/home/home.html"
        })

        .state('forum', {
            url: '/forum',
            templateUrl: "./app/views/forum/forum.html",
            title: 'Rha - Phorum'

        } )

        .state('addpost', {
            url: '/addpost',
            templateUrl: "./app/views/forum/addpost.html",


        } )
        .state('thread', {
              url: '/thread/:id',
              templateUrl: "./app/views/forum/thread.html",

          })
        $urlRouterProvider
            .otherwise('/')
    })
