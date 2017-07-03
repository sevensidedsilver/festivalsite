angular.module('app').controller('forumCtrl', function($http, $window, adminService, authService, $scope, $stateParams, homeSrv){

// get current user
let current_user
$http({
   method: "GET",
   url: '/auth/me'
 }).then((response) => {

       if(!response.data.user) {
           $window.location = "http://localhost:3000/auth"
           defer.reject()
       } else {
         //console.log(response.data.user[2])
        //  console.log(response.data.user)
         $scope.display_name = response.data.user[1];
         $scope.user_id = response.data.user[0]
         let current_user = response.data.user[0]

         if (response.data.user[2] === 1) {
           // hide the admin button
           //console.log("its 0")
           $scope.moderate = true
         } else if (response.data.user[2] === 0) {
           $scope.moderate = false
           //console.log('its not 0')
         }

         $scope.updated_threads =[]
         $scope.display_updates = function(current_user){

           homeSrv.display_updates(current_user).then((resp) => {
             $scope.thread_updates = resp
             let loop_these = resp
             let dupes_removed = []
             for(var i = 0; i < loop_these.length; i++) {
               if (dupes_removed.indexOf(loop_these[i]) == -1)
                dupes_removed.push(loop_these[i])
             }
             dupes_removed.forEach(function(el){
               homeSrv.findThread(el).then((resp)=>{
                 $scope.updated_threads.push(resp.data[0])
               })
             })
           })
         }
         $scope.display_updates(current_user)
       }
   })
   // find the number of reported threads + reported comments
   $scope.getReported = function(){
     let needMod = []
     adminService.getReportedComments().then((resp)=>{
       resp.data.forEach((el)=>{
         needMod.push(el)
       })

     })

     adminService.getReportedThreads().then((resp)=>{
       resp.data.forEach((el)=>{
         needMod.push(el)
       })
       $scope.modNumber = (needMod.length)
       if (needMod.length < 1){
         $scope.moderate = false
       }
     })




   }
   $scope.getReported()






    $scope.getThreads = function(){

      homeSrv.openThreads().then(function(resp){
        //console.log(resp)

        resp.data.forEach(function(el){

          el.timeAgo = (moment(el.created_at, "YYYYMMDD, h:mm:ss").fromNow())
        })
        $scope.threads = resp.data
      })

  }

    $scope.getThreads()




})
