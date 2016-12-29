var express = require('express');
var app = express();

var students = [
  {
    firstName: 'Bob',
    lastName: 'George',
    studentId: 1234,
    late: [],
    outOfUniform: [],
    bathroom: []
  }
];

app.use(express.static('./public'));

app.get('/api/students', function(req, res) {
  return res.json(students);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});