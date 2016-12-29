var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
  res.json(students);
});

app.post('/api/students', function(req, res) {
  students.push(req.body);
  res.end();
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});