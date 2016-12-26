var app = angular.module('cteaLogs', [])

.controller('MainController', ['$scope', function($scope) {
  $scope.students = [
    {
      firstName: 'Bob',
      lastName: 'George',
      studentId: 1234,
      late: [],
      outOfUniform: [],
      bathroom: []
    }
  ];

  $scope.setStudent = function(student) {
    $scope.activeStudent = student;
  };

  $scope.addDateTime = function(student) {
    $scope.timeInMs = Date.now();
    student.push({dateTime: $scope.timeInMs});
  };
  
  $scope.captureTime = function() {
    $scope.timeInMs = Date.now();
    console.log($scope.timeInMs);
  };

  $scope.addStudent = function() {
    $scope.students.push({
      firstName: $scope.firstName,
      lastName: $scope.lastName,
      late: [],
      outOfUniform: [],
      bathroom: []
    });
    $scope.firstName = '';
    $scope.lastName = '';
  };
}]);