var express = require('express');
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var path = require('path');
var http = require('http');
var debug_1 = require('debug');
var timedScripts = require('./timedScripts.js');
debug_1.default('digital-scouts-backend:server');
var config_1 = require("./config");
var errors_1 = require("./errors");
var socketRouter_1 = require('./routes/socketRouter');
var index_1 = require("./routes/index");
var users_1 = require("./routes/api/users");
var auth_1 = require("./routes/api/auth");
var adminAccounts_1 = require("./routes/api/adminAccounts");
var chat_1 = require('./routes/api/chat');
var calendar_1 = require("./routes/api/calendar");
var group_1 = require("./routes/api/group");
var address_1 = require("./routes/api/address");
var mail_1 = require("./routes/api/mail");
var nami_1 = require("./routes/api/nami");
var debug_2 = require("./routes/api/debug");
var ExpressApp = (function () {
    //Run configuration methods on the Express instance.
    function ExpressApp() {
        this.app = express();
        this.middleware();
        this.mongo();
        timedScripts.timedScripts.startScripts();
        console.log('Node setup finished...');
    }
    ExpressApp.prototype.middleware = function () {
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json({ limit: "8mb" }));
        this.app.use(express.json({ limit: "8mb" }));
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
            res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
            next();
        });
        // Use morgan to log requests to the console.
        this.app.use(morgan('dev'));
        this.app.use('/', index_1.default);
        this.app.use('/api/users', users_1.default);
        this.app.use('/api/auth', auth_1.default);
        this.app.use('/api/chat', chat_1.default);
        this.app.use('/api/admin/accounts', adminAccounts_1.default);
        this.app.use('/api/calendar', calendar_1.default);
        this.app.use('/api/group', group_1.default);
        this.app.use('/api/address', address_1.default);
        this.app.use('/api/mail', mail_1.default);
        this.app.use('/api/nami', nami_1.default);
        this.app.use('/api/debug', debug_2.default);
        this.app.get('/chat', function (req, res) {
            res.sendFile(__dirname + '/public/chat.html');
        });
        // Error handler
        this.app.use(function (error, request, response, next) {
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
            if (error != null && error.response != null) {
                logRequest(console.error, request);
                console.error("CUSTOM ERROR OCCURRED:");
                console.error(error);
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
        //prepare server
        var port = normalizePort(process.env.PORT || '3000');
        this.app.set('port', port);
        var server = http.createServer(this.app);
        server.listen(port);
        server.on('error', onError);
        server.on('listening', onListening);
        this.server = server;
        var io = new socketRouter_1.default(require('socket.io')(server));
        /**
         * Normalize a port into a number, string, or false.
         */
        function normalizePort(val) {
            var port = parseInt(val, 10);
            if (isNaN(port)) {
                // named pipe
                return val;
            }
            if (port >= 0) {
                // port number
                return port;
            }
            return false;
        }
        /**
         * Event listener for HTTP server "error" event.
         */
        function onError(error) {
            if (error.syscall !== 'listen') {
                throw error;
            }
            var bind = typeof port === 'string'
                ? 'Pipe ' + port
                : 'Port ' + port;
            // handle specific listen errors with friendly messages
            switch (error.code) {
                case 'EACCES':
                    console.error(bind + ' requires elevated privileges');
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    console.error(bind + ' is already in use');
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        }
        /**
         * Event listener for HTTP server "listening" event.
         */
        function onListening() {
            var addr = server.address();
            var bind = typeof addr === 'string'
                ? 'pipe ' + addr
                : 'port ' + addr.port;
            debug_1.default('Listening on ' + bind);
        }
    };
    ExpressApp.prototype.mongo = function () {
        var db_url = function (nodeEnvironment) {
            switch (nodeEnvironment) {
                case 'test':
                    console.log("running on test database");
                    return config_1.Config.test_database;
                case 'local':
                    console.log("running on local database");
                    return config_1.Config.local_database;
                default:
                    console.log("running on docker database");
                    return config_1.Config.database;
            }
        }(process.env.NODE_ENV);
        // Connect to the mongoDB via mongoose
        mongoose.connect(db_url, { useNewUrlParser: true });
        mongoose.set("useCreateIndex", true);
        var db = mongoose.connection;
        // Bind connection to error event ( to get notification of connection errors)
        db.on('error', console.error.bind(console, 'connection error: '));
        db.once('open', function () {
            // connected
            console.log('MongoDB connected...');
        });
    };
    return ExpressApp;
})();
var app = new ExpressApp();
var serverE = app.server;
exports.serverE = serverE;
var appE = app.app;
exports.appE = appE;
//# sourceMappingURL=expressApp.js.map