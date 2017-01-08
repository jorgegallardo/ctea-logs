var app = angular.module('cteaLogs', ['angularMoment', 'ngRoute'])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true).hashPrefix('!');

  $routeProvider
  .when('/', {
    templateUrl: 'pages/class.html',
    controller: 'MainController'
  })
  .when('/period/:periodId', {
    templateUrl: 'pages/class.html',
    controller: 'MainController'
  })
  .otherwise({
    redirectTo: '/'
  });
}])
.controller('NavController', ['$scope', '$http', function($scope, $http) {

  function loadPeriods() {
    //retrieve students from server
    $http.get('/api/periods').then(function(response) {
      $scope.periods = response.data;
    }, function(err) {
      console.log(err);
    });
  }

  loadPeriods();
}])
.controller('ModalController', ['$scope', '$http', 'StudentService', function($scope, $http, StudentService) {
  
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
    
    $http.put('/api/students/' + $scope.activeStudent._id + '/addEvent/' + $scope.eventType + '/' + ($scope.activeStudent.activeBathroomEvent ? $scope.activeStudent.activeBathroomEvent._id : 0)).then(function() {
    }, function(err) {
      console.log(err);
    });
  };

  $scope.verifyStudent = function(eventType) {
    $scope.lastFourDigits = "";
    $scope.eventType = eventType;
    $scope.askForStudentVerification = true;
  };

  $scope.addDateTime = function(student) {
    $scope.dateTime = moment().format('ll LTS');
    student.push({dateTime: $scope.dateTime});
  };

  $('#myModal').on('shown.bs.modal', function () {
    $scope.$apply(function() {
      $scope.activeStudent = StudentService.activeStudent;
    });
  });
}])

.service('StudentService', function() {
  this.activeStudent = null;
})

.service('PeriodService', function() {
  this.activePeriod = null;
})

.controller('MainController', ['$scope', '$http', '$routeParams', 'StudentService', function($scope, $http, $routeParams, StudentService) {
  $scope.askForStudentVerification = false;
  $scope.exampleDate = moment().format('ll LTS');
  $scope.monthDayYear = moment().format('LL');

  var periodId = $routeParams.periodId;

  $scope.students = [];
  loadStudents(); // initial load from server
  loadPeriods();

  function loadStudents() {
    //retrieve students from server
    $http.get('/api/students' + (periodId ? ('/' + periodId) : '')).then(function(response) {
      var students = response.data;
      for (var i = 0; i < students.length; i++) {
        students[i].isBathroomActive = false;
        for (var j = 0; j < students[i].bathroom.length; j++) {
          if(students[i].bathroom[j].begin && !students[i].bathroom[j].end) {
            students[i].isBathroomActive = true;
            students[i].activeBathroomEvent = students[i].bathroom[j];
            break;
          }
        }
      }
      $scope.students = students;
    }, function(err) {
      console.log(err);
    });
  };

  function loadPeriods() {
    //retrieve students from server
    $http.get('/api/periods').then(function(response) {
      $scope.periods = response.data;
      if ($scope.periods.length > 0) $scope.selectedPeriod = $scope.periods[0];
    }, function(err) {
      console.log(err);
    });
  }

  $scope.setStudent = function(student) {
    $scope.askForStudentVerification = false;
    $scope.activeStudent = student;
    StudentService.activeStudent = student;
    //$('#myModal').modal('show');
  };

  $scope.addStudent = function() {
    $http.post('/api/students', {
      firstName: $scope.firstName,
      lastName: $scope.lastName,
      studentId: $scope.studentId,
      periodId: $scope.selectedPeriod._id,
      late: [],
      outOfUniform: [],
      bathroom: []
    }).then(function(response) {
      loadStudents(); // reload students
    }, function(err) {
      alert('Unable to add student.');
    });

    $scope.firstName = '';
    $scope.lastName = '';
    $scope.studentId = '';
  };

  $('#myModal').on('hidden.bs.modal', function () {
    loadStudents();
  });

}]);