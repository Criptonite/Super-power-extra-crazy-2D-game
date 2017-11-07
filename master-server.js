let express = require("express");
let http = require("http");
let path = require("path");
let logger = require('morgan');
let bodyParser = require('body-parser');
let fs = require("fs");
// let config = require("config");
let app = express();
let router = express.Router();

app.engine("ejs", require("ejs-locals"));
app.set("views", path.join(__dirname, "templates"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', router);


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render("index");
});
//
// function getFile(filename, res) {
//     fs.exists(filename, function (exists) {
//         function error(status, message) {
//             res.writeHead(status, {"Content-Type": "text/plain"});
//             res.write(message);
//             res.end();
//         }
//
//         if (!exists) return error(404, "404 Not Found\n");
//
//         fs.readFile(filename, "binary", (err, file) => {
//             if (err) return error(500, err + "\n");
//
//             if (path.extname(filename) === ".js") {
//                 res.writeHead(200, {"Content-Type": "text/javascript"});
//                 res.write(file, "binary");
//                 res.end();
//             }
//             else if (path.extname(filename) === ".css") {
//                 res.writeHead(200, {"Content-Type": "text/css"});
//                 res.write(file, "binary");
//                 res.end();
//             }
//             else return error(403, "Access denied");
//         });
//     });
// }


// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     let err = new Error("Page not found");
//     err.status = 404;
//     next(err);
// });

// error handler
// app.use(function (err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = err;
//
//     // render the error page
//     res.status(err.status || 500);
//     res.render("error");
// });


http.createServer(app).listen(8080);