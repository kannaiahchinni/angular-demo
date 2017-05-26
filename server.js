var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));

// defining routes 
app.get('*', function (req, res) {

    res.sendfile('./public/index.html');

});

app.listen(8080);
console.log("App listening port 8080");