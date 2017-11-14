let express = require("express");
let http = require("http");
let path = require("path");
let logger = require('morgan');
let bodyParser = require('body-parser');
let fs = require("fs");
let config = require("./config");
let log = require("./libs/log")(module);
let net_server = require("./net_server");

let app = express();
let router = express.Router();

// app.engine("ejs", require("ejs-locals"));
// app.set(path.join(__dirname, "public"));
// app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public/game')));
app.use('/', router);


function getStaticFiles(name, res) {
    fs.exists(name, (exists) => {

        function errorInfo(err, mes) {
            res.writeHead(err, {"ContentType": "text/plain"});
            res.write(mes);
            res.end();
        }

        if (!exists) {
            errorInfo(404, "404 Not Found");
        }

        fs.readFile(name, "binary", (err, data) => {
            if (err) {
                return errorInfo(500, err);
            }

            if (path.extname(name) === ".js") {
                res.writeHead(200, {"ContentType": "text/javascript"});
                res.write(data, "binary");
                res.end();
            } else if (path.extname(name) === ".css") {
                res.writeHead(200, {"ContentType": "text/css"});
                res.write(data, "binary");
                res.end();
            } else {
                return errorInfo(403, "Forbiden");
            }
        })

    })
}

/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile(__dirname, "/index.html")
});


router.use("/boot", (req, res, next) => {
    let reqPath = path.join(__dirname, "bower_components", req.url);
    getStaticFiles(reqPath, res);
});

router.use("/game", (req, res, next) => {
    let reqPath = path.join(__dirname, "game-server", "room", "common", req.url);
    getStaticFiles(reqPath, res);
});

router.post("/enter", (req, res, next) => {
    let loginForUser = req.body.login;
    log.debug("LOGIN: " + loginForUser);
    net_server.getGameAddress(function (address) {

        res.end("/start");
    });
});



if(!fs.existsSync(path.join(__dirname, "bower_components"))){
    log.error("Run \"bower i\" first");
    exit(0);
}

if(!fs.existsSync(path.join(__dirname, "node_modules"))){
    log.error("Run \"npm i\" first");
    exit(0);
}

http.createServer(app).listen(8080, function () {
    log.info("Server start...");
});