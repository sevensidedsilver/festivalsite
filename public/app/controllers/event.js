angular.module('app').controller('event', function($scope, $stateParams, eventsService){
// get the event to display
eventsService.getEvent($stateParams.id).then(resp => {

  console.log(resp.data[0])

  $scope.event = resp.data[0]
})














})
