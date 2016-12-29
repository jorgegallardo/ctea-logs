var app = angular.module('cteaLogs', ['angularMoment'])

.controller('MainController', ['$scope', '$http', function($scope, $http) {
  $scope.askForStudentVerification = false;
  $scope.exampleDate = moment().format('ll LTS');
  $scope.monthDayYear = moment().format('LL');

  $scope.students = [];
  loadPage(); // initial load from server

  function loadPage() {
    //retrieve students from server
    $http.get('/api/students').then(function(response) {
      $scope.students = response.data;
    }, function(err) {
      console.log(err);
    });
  };

  $scope.setStudent = function(student) {
    $scope.askForStudentVerification = false;
    $scope.activeStudent = student;
  };

  $scope.addStudent = function() {
    $http.post('/api/students', {
      firstName: $scope.firstName,
      lastName: $scope.lastName,
      studentId: $scope.studentId,
      late: [],
      outOfUniform: [],
      bathroom: []
    }).then(function(response) {
      alert('Successfully added student.');
      loadPage(); // reload students
    }, function(err) {
      alert('Unable to add student.');
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
    $scope.dateTime = moment().format('ll LTS');
    student.push({dateTime: $scope.dateTime});
  };
}]);