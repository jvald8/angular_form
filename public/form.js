var angularForm = angular.module('angularForm', []);

angularForm.controller('FormController', function($scope, $http) {
  $scope.user = {
    email: '',
    password: ''
  };

  $scope.submitForm = function(user) {

    $http.post('/users', user)
    .success(function(data, status, headers, config) {

    })
    .error(function(data, status, headers, config) {

    })
  }

  $scope.loginForm = function(user) {

    $http.post('/authenticate', user)
    .success(function(data, status, headers, config) {

    })
    .error(function(data, status, headers, config) {

    })

  }
})
