var app = angular.module('cteaLogs', ['angularMoment'])

.controller('MainController', ['$scope', function($scope) {
  $scope.askForStudentVerification = false;
  $scope.exampleDate = moment().format('ll LTS');
  $scope.monthDayYear = moment().format('LL');   // December 28, 2016

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
  
  $scope.verifyStudent = function(eventType) {
    $scope.eventType = eventType;
    $scope.askForStudentVerification = true;
  };

  $scope.checkStudentId = function() {
    if($scope.lastFourDigits != $scope.activeStudent.studentId.toString()) {
      alert("Incorrect Student ID entered.");
      $scope.lastFourDigits = "";
      return;
    }
    if ($scope.eventType === 'late') {
      $scope.addDateTime($scope.activeStudent.late);
    } else if ($scope.eventType === 'outOfUniform') {
      $scope.addDateTime($scope.activeStudent.outOfUniform);
    } else if ($scope.eventType === 'bathroom') {
      $scope.addDateTime($scope.activeStudent.bathroom);
    }
    $('#myModal').modal('hide');
    $scope.lastFourDigits = "";
    setTimeout(function() {
      $scope.askForStudentVerification = false;
    }, 1000);
  };

  $scope.addDateTime = function(student) {
    $scope.time = moment().format('ll LTS');
    student.push({dateTime: $scope.time});
  };
}]);