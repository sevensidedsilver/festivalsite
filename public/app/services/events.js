angular.module('app').service('eventsService', function($http){

this.createEvent = (event) => {
  // console.log(event)
  return $http ({
    url: '/create-event',
    method: 'post',
    data: event
  })
}

// GET ALL EVENTS
this.getAllEvents = () => {
  return $http ({
    method: 'GET',
    url: '/get-all-events'
  }).then(resp => {
    //console.log(resp)
    return resp
  })
}
// get one event for individual event page
this.getEvent = (id) => {
  return $http ({
    method: "GET",
    url: "/get-event/" + id
  }).then(resp => (resp))


}


this.eventHappened = id => {
  return $http ({
    method: "PUT",
    url: "/event-happened/" + id
  })
}



})
