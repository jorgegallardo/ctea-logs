var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var moment = require('moment');

mongoose.connect('mongodb://localhost/ctea-logs');
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var Student = mongoose.model('Student', { 
  firstName: String,
  lastName: String,
  studentId: Number,
  late: [{}],
  outOfUniform: [{}],
  bathroom: [{}]
});

app.use(express.static('./public'));

app.get('/api/students', function(req, res) {
  Student.find({}, function(err, students) {
    if(err) {
      console.log(err);
    } else {
      res.json(students);
    }
  });
});

app.post('/api/students', function(req, res) {
  var student = new Student(req.body);
  student.save(function(err) {
    if(err) {
      console.log('Unable to add student to database. It\'s likely that you entered an inappropriate data type in one of the fields.')
    } else {
      console.log('Successfully added a student to the database.');
    }
  });
  res.end();
});

app.put('/api/students/:objectId/addEvent/:eventType/', function(req, res) {
  var objectId = req.params.objectId;
  var eventType = req.params.eventType;
  var dateTime = moment().format('YYYY-MM-DD hh:mm:ss A');

  Student.findOne({_id: objectId}, function(err, student) {
    if(err) return next(err);
    if(!student) return res.end();
    if(eventType === 'late') {
      student.late.push({dateTime: dateTime});
    }
    else if(eventType === 'outOfUniform') {
      student.outOfUniform.push({dateTime: dateTime});
    }
    else if(eventType === 'bathroom') {
      student.bathroom.push({dateTime: dateTime});
    }
    student.save(function(err) {
      if(err) return next(err);
      return res.end();
    });
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});