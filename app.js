angular.module('app', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider){
      $stateProvider
        .state('home', {
            url: '/',
            templateUrl: "../views/home/home.html"
        })

        .state('forum', {
            url: '/forum',
            templateUrl: "../views/forum/forum.html",
            title: 'Rha - Phorum'

        } )

        .state('addpost', {
            url: '/addpost',
            templateUrl: "../views/forum/addpost.html",


        } )
        $urlRouterProvider
            .otherwise('/')
    })
