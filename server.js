var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Mixed = mongoose.Schema.Types.Mixed;
var moment = require('moment');

mongoose.connect('mongodb://localhost/ctea-logs');
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var Student = mongoose.model('Student', { 
  firstName: String,
  lastName: String,
  studentId: Number,
  late: [{
    dateTime: Date
  }],
  outOfUniform: [{
    dateTime: Date
  }],
  bathroom: [{
    begin: Date,
    end: Date
  }]
});

var Period = mongoose.model('Period', {
  name: String,
  students: [{type: ObjectId, ref: 'Student'}]
});

app.use(express.static('./public'));

app.get('/api/periods', function(req, res) {
  Period.find({}, function(err, periods) {
    if(err) {
      console.log(err);
    } else {
      res.json(periods);
    }
  });
});

app.get('/api/students', function(req, res) {
  Student.find({}, function(err, students) {
    if(err) {
      console.log(err);
    } else {
      res.json(students);
    }
  });
});

app.get('/api/students/:periodId', function(req, res, next) {
  Period.findOne({_id: req.params.periodId}).populate('students').exec(function(err, period) {
    if(err) return next(err);
    return res.json(period.students);  
  });
});

app.post('/api/students', function(req, res, next) {
  var student = new Student(req.body);
  
  student.save(function(err) {
    if(err) return next(err);
    
    console.log('Successfully added a student to the database.');
    
    Period.findByIdAndUpdate(req.body.periodId, {$push: {'students': student._id}}, {}, function(err, period) {
      if (err) return next(err);

      console.log('Successfully added a student to the period.');
      res.end();
    });
  
  });
  
});

app.put('/api/students/:objectId/addEvent/:eventType/:eventId', function(req, res) {
  var objectId = req.params.objectId;
  var eventType = req.params.eventType;
  var eventId = req.params.eventId;
  var dateTime = moment().format('YYYY-MM-DD hh:mm:ss A');

  Student.findOne({_id: objectId}, function(err, student) {
    if(err) return next(err);
    if(!student) return res.end();

    if(eventType === 'late') {
      student.late.push({dateTime: dateTime});
    } else if(eventType === 'outOfUniform') {
      student.outOfUniform.push({dateTime: dateTime});
    } else if(eventType === 'bathroomBegin') {
      student.bathroom.push({begin: dateTime});
    } else if(eventType === 'bathroomEnd') {
      for (var i = 0; i < student.bathroom.length; i++) {
        if (student.bathroom[i]._id.equals(eventId)) {
          student.bathroom[i].end = dateTime;
          break;
        }
      }
    }

    student.save(function(err) {
      if(err) return next(err);
      return res.end();
    });
    
  });
});

//Redirect for front end routes
app.get('*', function(req, res) {
  return res.redirect('/#!' + req.originalUrl);
});

//Error handler needs to be the last route
app.use(function(err, req, res, next) {
  console.error(err.stack);
  var status = err.status || 500;
  var message = err.message || err.toString();
  return res.setStatus(status).send(message);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});


