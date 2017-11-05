let path = require('path');
let fileSystem = require('fs');
let express = require('express');
let logger = require('morgan');
let routes = require('./routes');
let app = express();
let port = 8080;


app.use(logger('dev'));

console.log(path.join('../game'));

app.use(express.static(path.join('../game')));



app.get("/index.html", (req, res) => {
    res.send('Hello world');
});

app.listen(port);
console.log('Listening on port ' + port);

