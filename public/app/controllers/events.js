angular.module('app').controller('events', function($scope, $state, threadService, $http, $window, $stateParams, eventsService){
// only admins can create events, check if user is admin and display the "New event" button if so
$scope.isAdmin = false
$http({
   method: "GET",
   url: '/auth/me'
 }).then((response) => {
      if (response.data.user[2] === 1) {
        $scope.isAdmin = true
      }
   })






// create new event
  $scope.createEvent = () => {
    let displayDate = $scope.date.toString()
    displayDate = displayDate.substring(0, 15)

    let event = {
      title: $scope.title,
      location: $scope.location,

      displayDate: displayDate,
      date: $scope.date,


      startTime: $scope.startTime,
      endTime: $scope.endTime,
      goal: $scope.goal,
      image: $scope.image,
      fbEvent: $scope.fbEvent,
      desc1: $scope.line1,
      desc2: $scope.line2,
      desc3: $scope.line3,
      desc4: $scope.line4,
      desc5: $scope.line5
    }
    console.log(event.date)
    eventsService.createEvent(event)
    $state.go('events')
  }


// get all events for upcoming eventsng repeat
  $scope.getAllEvents = () => {
    eventsService.getAllEvents().then(resp => {


      $scope.events = resp.data

      if ($scope.events.length < 1) {
        $scope.noEvents = true
        console.log("no events")
      }

    })
  }

  $scope.getAllEvents()




// mark an event as past
$scope.eventHappened = (id) =>{
  eventsService.eventHappened(id)

  $scope.getAllEvents()
}








// end of controller ===============================
})
