angular.module('app').service('homeSrv', function($http){

  this.openThreads = function(){
    return $http({
      url: '/threads',
      method: 'GET',
    }).then(function(resp){
      return resp;
    })
  }

  // see if current user has any thread updates
  this.display_updates = function(current_user){
    // console.log(current_user)
    return $http({
      url: '/get_feed_top/' + current_user,
      method: 'GET',
    }).then(function(resp){
      // return (resp);
      let feed_top = (resp.data[0].feed_top)
      if (feed_top == null || feed_top.length < 1) {
        return false
      } else {

        return feed_top
      }
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
