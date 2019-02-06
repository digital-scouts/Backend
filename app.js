const config = require('./config'),
    indexRouter = require('./routes/index'),
    usersRouter = require('./routes/api/users'),
    mongoose = require('mongoose'),
    express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    createError = require('http-errors'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    app = express();


configureExpress();
configureDatabase();

module.exports = app;

console.log('Node.js setup finished');

function configureExpress() {
    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/', indexRouter);
    app.use('/users', usersRouter);

// catch 404 and forward to error handler
    app.use(function(req, res, next) {
        next(createError(404));
    });

    // error handler
    app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });


    app.use(express.json({limit: "8mb"}));
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        next();
    });

    // Use body parser so we can get info from POST and/or URL parameters.
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json({limit: "8mb"}));

    // Use morgan to log requests to the console.
    app.use(morgan('dev'));

    // Set global constants
    app.set('salt', config.salt);
    // app.set('map_api', config.map_api);
    // app.set('DEBUG', config.DEBUG);
    // app.set('configForUser', config.configForUser);
}


function configureDatabase() {
    let db_url = config.database;

    // Connect to the mongoDB via mongoose
    mongoose.connect(db_url, { useNewUrlParser: true });
    var db = mongoose.connection;

    // Bind connection to error event ( to get notification of connection errors)
    db.on('error', console.error.bind(console, 'connection error: '));
    db.once('open', function() {
        // connected
        console.log('MongoDB connected..');
    });
}