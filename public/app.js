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
      loadStudents();
    }, function(err) {
      console.log(err);
    });
  };
  function loadStudents() {
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

  function loadPeriods() {
    //retrieve students from server
    $http.get('/api/periods').then(function(response) {
      $scope.periods = response.data;
    }, function(err) {
      console.log(err);
    });
  }

  function loadStudents() {
    //retrieve students from server
    $http.get('/api/students' + (periodId ? ('/' + periodId) : '')).then(function(response) {
      console.log(response.data);
      $scope.students = response.data;
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

  loadPeriods();

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
  
  $scope.verifyStudent = function(eventType) {
    $scope.lastFourDigits = "";
    $scope.eventType = eventType;
    $scope.askForStudentVerification = true;
  };

  $('#myModal').on('hidden.bs.modal', function () {
    loadStudents();
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
      loadStudents();
    }, function(err) {
      console.log(err);
    });
  };

  $scope.addDateTime = function(student) {
    $scope.dateTime = moment().format('ll LTS');
    student.push({dateTime: $scope.dateTime});
  };
}]);