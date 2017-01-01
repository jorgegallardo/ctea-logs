var app = angular.module('cteaLogs', ['angularMoment', 'ngRoute'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'pages/class.html',
    controller: 'MainController'
  });
}])
.controller('ModalController', ['$scope', '$http', 'StudentService', function($scope, $http, StudentService) {
  $scope.activeStudent = StudentService.activeStudent;
  
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
  function loadPage() {
    //retrieve students from server
    $http.get('/api/students').then(function(response) {
      $scope.students = response.data;
    }, function(err) {
      console.log(err);
    });
  }
}])

.service('StudentService', function() {
  this.activeStudent = null;
})

.controller('MainController', ['$scope', '$http', 'StudentService', function($scope, $http, StudentService) {
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
    StudentService.activeStudent = student;
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
    $scope.lastFourDigits = "";
    $scope.eventType = eventType;
    $scope.askForStudentVerification = true;
  };

  $('#myModal').on('hidden.bs.modal', function () {
    loadPage();
  });

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