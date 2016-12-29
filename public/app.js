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
    if($scope.lastFourDigits !== $scope.activeStudent.studentId.toString()) {
      alert("Incorrect Student ID entered.");
      $scope.lastFourDigits = "";
      return;
    }

    $('#myModal').modal('hide');
    $scope.lastFourDigits = "";

    setTimeout(function() {
      $scope.askForStudentVerification = false;
    }, 1000);
    
    $http.put('/api/students/' + $scope.activeStudent._id + '/addEvent/' + $scope.eventType).then(function() {
      loadPage();
    }, function(err) {
      console.log(err);
    });
  };

  $scope.addDateTime = function(student) {
    $scope.dateTime = moment().format('ll LTS');
    student.push({dateTime: $scope.dateTime});
  };
}]);