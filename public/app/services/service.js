angular.module('app').service('homeSrv', function($http){

  this.openThreads = function(){
    return $http({
      url: '/threads',
      method: 'GET',
    }).then(function(resp){
      return resp;
    })
  }


  this.findThread = function(id){
    return $http({
      url: '/thread/' + id,
      method: 'GET',
    }).then(function(resp){
      return resp;
    })
  }


// moment JS to get the "X hours ago" for comments and threads
  this.liveTime = function(time) {
    //conver dis 2017-06-21T15:44:08.049Z


    //into dis 20170621, h:mm:ss

  }




})
