"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var path = require("path");
var config_1 = require("./config");
var errors_1 = require("./errors");
var index_1 = require("./routes/index");
var users_1 = require("./routes/api/users");
var auth_1 = require("./routes/api/auth");
var adminAccounts_1 = require("./routes/api/adminAccounts");
var ExpressApp = /** @class */ (function () {
    //Run configuration methods on the Express instance.
    function ExpressApp() {
        this.express = express();
        this.middleware();
        this.routes();
        this.mongo();
        console.log('Node.ts setup finished');
    }
    ExpressApp.prototype.middleware = function () {
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(bodyParser.json({ limit: "8mb" }));
        this.express.use(express.json({ limit: "8mb" }));
        this.express.use(express.static(path.join(__dirname, 'public')));
        this.express.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
            next();
        });
        // Use morgan to log requests to the console.
        this.express.use(morgan('dev'));
        // Error handler
        this.express.use(function (error, request, response, next) {
            function logRequest(logger, request) {
                logger("REQUEST:");
                logger(request.method + " " + request.url);
                logger("HEADERS:");
                logger(request.headers);
                logger("FORM:");
                logger(request.form);
                logger("QUERY:");
                logger(request.query);
                logger("BODY:");
                logger(request.body);
            }
            var validRESTError = error instanceof errors_1.ErrorREST;
            if (validRESTError) {
                logRequest(console.log, request);
                console.log("ERROR OCCURRED:");
                console.log(error);
            }
            else {
                logRequest(console.error, request);
                console.error("ERROR OCCURRED:");
                console.error(error);
                // Replace the error with a suitable one for the end user
                error = new errors_1.ErrorREST(errors_1.Errors.InternalServerError);
            }
            response.status(error.response.status).send(error.response);
        });
        // Set global constants
        this.express.set('salt', config_1.Config.salt);
        this.express.set('DEBUG', config_1.Config.DEBUG);
    };
    ExpressApp.prototype.routes = function () {
        this.express.use('/', index_1.default);
        this.express.use('/api/users', users_1.default);
        this.express.use('/api/auth', auth_1.default);
        this.express.use('/api/admin/accounts', adminAccounts_1.default);
    };
    ExpressApp.prototype.mongo = function () {
        var db_url = config_1.Config.database;
        // Connect to the mongoDB via mongoose
        mongoose.connect(db_url, { useNewUrlParser: true });
        var db = mongoose.connection;
        // Bind connection to error event ( to get notification of connection errors)
        db.on('error', console.error.bind(console, 'connection error: '));
        db.once('open', function () {
            // connected
            console.log('MongoDB connected..');
        });
    };
    return ExpressApp;
}());
var app = new ExpressApp();
exports.default = app.express;
