angular.module('angularForm', [])
.controller('FormController', function($scope, $http) {
  $scope.currentUser = {
    id: '',
    email: '',
    name: ''
  };

  $http.get('http://localhost:3001/users/')
  .success(function(data, status, headers, config) {
    $scope.currentUser = data[0];
  })
  .error(function(data, status, headers, config) {
    console.log(data)
  });

})
