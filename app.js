const express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    path = require('path'),
    config = require('./config'),
    ErrorREST = require('./errors').ErrorREST,
    Errors = require('./errors').Errors,
    db_url = config.database;

// Routes directory
const indexRouter = require('./routes/index'),
    usersRouter = require('./routes/api/users'),
    authRouter = require('./routes/api/auth'),
    adminAccount = require('./routes/api/adminAccounts');

configureExpress();
configureDatabase();

    module.exports = app;

console.log('Node.js setup finished');

function configureExpress() {
    app = express();
    app.use(express.json({limit: "8mb"}));
    app.use(express.urlencoded({extended: false}));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        next();
    });

    // Use body parser so we can get info from POST and/or URL parameters.
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json({limit: "8mb"}));

    // Use morgan to log requests to the console.
    app.use(morgan('dev'));

    // Use REST routes
    app.use('/', indexRouter);

    app.use('/api/users', usersRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/admin/accounts', adminAccount);

    // Error handler
    app.use(function (error, request, response, next) {
        /* TODO Write a log file. */

        let validRESTError = error instanceof ErrorREST;
        if (validRESTError) {
            logRequest(console.log, request);
            console.log("ERROR OCCURRED:");
            console.log(error);
        } else {
            logRequest(console.error, request);
            console.error("ERROR OCCURRED:");
            console.error(error);

            // Replace the error with a suitable one for the end user
            error = new ErrorREST(Errors.InternalServerError);
        }

        response.status(error.response.status).send(error.response);

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
    });

    // Set global constants
    app.set('salt', config.salt);
    app.set('DEBUG', config.DEBUG);
}


function configureDatabase() {
    // Connect to the mongoDB via mongoose
    mongoose.connect(db_url, {useNewUrlParser: true});
    var db = mongoose.connection;

    // Bind connection to error event ( to get notification of connection errors)
    db.on('error', console.error.bind(console, 'connection error: '));
    db.once('open', function () {
        // connected
        console.log('MongoDB connected..');
    });
}