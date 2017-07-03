angular.module('app')
.directive('comments', function ($compile) {
  return {
      restrict: "E",
      // scope: {
      //   comment: "="
      // },
      templateUrl: "../app/directives/threadTemplate.html",
      link: function (scope, element, attrs) {
        //check if this member has children
        if (scope.comment.children.length > 0) {
            // append the collection directive to this element
            $compile('<comments class="ng-scope id_{{comment.comment_id}}" comment="comment" ng-repeat="comment in comment.children | orderBy: &quot;-created_at&quot;""></comments>')(scope, function(cloned, scope){
              element.append(cloned);
              });
        }
      }



      // compile: function(element) {
      //     // Use the compile function from the RecursionHelper,
      //     // And return the linking function(s) which it returns
      //     return recursionHelper.compile(element);
      // }
  };
});









// templateUrl: "../app/directives/threadTemplate.html"
