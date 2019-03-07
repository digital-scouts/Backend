import * as express from 'express';
import * as mongoose from "mongoose";
import * as bodyParser from "body-parser";
import * as morgan from "morgan";
import * as path from 'path';
import * as http from 'http';
import debug from 'debug';

debug('digital-scouts-backend:server');
import {Config} from "./config";
import {ErrorREST, Errors} from "./errors";
import SocketRouter from './routes/socketRouter';

import indexRouter from "./routes/index";
import usersRouter from "./routes/api/users";
import authRouter from "./routes/api/auth";
import adminAccount from "./routes/api/adminAccounts";
import chatRouter from './routes/api/chat';

class ExpressApp {
    public express;
    public server;

    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.mongo();
        console.log('Node.ts setup finished');
    }

    private middleware(): void {
        this.express.use(bodyParser.urlencoded({extended: false}));
        this.express.use(bodyParser.json({limit: "8mb"}));
        this.express.use(express.json({limit: "8mb"}));
        this.express.use(express.static(path.join(__dirname, 'public')));
        this.express.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
            next();
        });
        // Use morgan to log requests to the console.
        this.express.use(morgan('dev'));


        this.express.use('/', indexRouter);

        this.express.use('/api/users', usersRouter);
        this.express.use('/api/auth', authRouter);
        this.express.use('/api/chat', chatRouter);
        this.express.use('/api/admin/accounts', adminAccount);

        this.express.get('/chat', function (req, res) {
            res.sendFile(__dirname + '/public/chat.html');
        });


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

            if (error != null && error.response != null) {
                logRequest(console.error, request);
                console.error("CUSTOM ERROR OCCURRED:");
                console.error(error);
            } else {
                logRequest(console.error, request);
                console.error("ERROR OCCURRED:");
                console.error(error);

                // Replace the error with a suitable one for the end user
                error = new ErrorREST(Errors.InternalServerError);
            }

            response.status(error.response.status).send(error.response);
        });
        // Set global constants
        this.express.set('salt', Config.salt);
        this.express.set('DEBUG', Config.DEBUG);

        //prepare server
        const port = normalizePort(process.env.PORT || '3000');
        this.express.set('port', port);

        const server = http.createServer(this.express);
        server.listen(port);
        server.on('error', onError);
        server.on('listening', onListening);
        this.server = server;
        const io = new SocketRouter(require('socket.io')(server));

        /**
         * Normalize a port into a number, string, or false.
         */
        function normalizePort(val) {
            const port = parseInt(val, 10);

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

            const bind = typeof port === 'string'
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
            const addr = server.address();
            const bind = typeof addr === 'string'
                ? 'pipe ' + addr
                : 'port ' + addr.port;
            debug('Listening on ' + bind);
        }
    }

    private mongo() {
        let db_url = function (nodeEnvironment) {
            switch (nodeEnvironment) {
                case 'test':
                    console.log("running on test database");
                    return Config.test_database;
                default:
                    console.log("running on normal database");
                    return Config.database;
            }
        }(process.env.NODE_ENV);
        // Connect to the mongoDB via mongoose
        mongoose.connect(db_url, {useNewUrlParser: true});
        mongoose.set("useCreateIndex", true);
        let db = mongoose.connection;

        // Bind connection to error event ( to get notification of connection errors)
        db.on('error', console.error.bind(console, 'connection error: '));
        db.once('open', function () {
            // connected
            console.log('MongoDB connected..');
        });
    }
}

const app = new ExpressApp(), server = app.server, express = app.express;
const appObj = {server, express};
export default appObj;
