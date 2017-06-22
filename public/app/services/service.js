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

  this.timeFrom = function(time) {
    return(moment(time, "YYYYMMDD, h:mm:ss" ).startOf('seconds').fromNow())
  }




})
