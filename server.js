var express = require('express');
var app = express();

app.use(express.static('./public'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use('/angular', express.static(__dirname + '/node_modules/angular/'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});