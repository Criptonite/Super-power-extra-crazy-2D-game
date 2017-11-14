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


router.post



http.createServer(app).listen(8080);