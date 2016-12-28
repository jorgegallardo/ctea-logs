var app = angular.module('cteaLogs', [])

.controller('MainController', ['$scope', function($scope) {
  $scope.askForStudentVerification = false;

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
    $scope.askForStudentVerification = false;
    $scope.activeStudent = student;
  };
  
  $scope.captureTime = function() {
    $scope.timeInMs = Date.now();
    console.log($scope.timeInMs);
  };

  $scope.addStudent = function() {
    $scope.students.push({
      firstName: $scope.firstName,
      lastName: $scope.lastName,
      studentId: $scope.studentId,
      late: [],
      outOfUniform: [],
      bathroom: []
    });
    $scope.firstName = '';
    $scope.lastName = '';
    $scope.studentId = '';
  };
  
  $scope.verifyStudentCheck = function(eventType) {
    $scope.eventType = eventType;
    $scope.askForStudentVerification = true;
  };

  $scope.checkStudentId = function() {
    if($scope.lastFourDigits != $scope.activeStudent.studentId.toString()) {
      alert("Incorrect Student ID entered.");
      $scope.lastFourDigits = "";
      return;
    }
    if ($scope.eventType == 'late') {
      $scope.addDateTime($scope.activeStudent.late);
    } else if ($scope.eventType == 'outOfUniform') {
      $scope.addDateTime($scope.activeStudent.outOfUniform);
    } else if ($scope.eventType == 'bathroom') {
      $scope.addDateTime($scope.activeStudent.bathroom);
    }
    $('#myModal').modal('hide');
    $scope.lastFourDigits = "";
  };

  $scope.addDateTime = function(student) {
    $scope.timeInMs = Date.now();
    student.push({dateTime: $scope.timeInMs});
  };
}]);