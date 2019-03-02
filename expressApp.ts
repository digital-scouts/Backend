import * as express from "express";
import * as mongoose from "mongoose";
import * as bodyParser from "body-parser";
import * as morgan from "morgan";
import * as path from 'path';
import {Config} from "./config";
import {ErrorREST, Errors} from "./errors";

import indexRouter from "./routes/index";
import usersRouter from "./routes/api/users";
import authRouter from "./routes/api/auth";
import adminAccount from "./routes/api/adminAccounts";

class ExpressApp {
    public express: express.Application;

    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
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
                error = new ErrorREST("InternalServerError");
            }

            response.status(error.response.status).send(error.response);
        });
// Set global constants
        this.express.set('salt', Config.salt);
        this.express.set('DEBUG', Config.DEBUG);

    }

    private routes(): void {
        this.express.use('/', indexRouter);

        this.express.use('/api/users', usersRouter);
        this.express.use('/api/auth', authRouter);
        this.express.use('/api/admin/accounts', adminAccount);

        this.express.get('/chat', function(req, res){
            res.sendFile(__dirname + '/public/chat.html');
        });
    }

    private mongo() {

        const db_url = Config.database;
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
}
export default new ExpressApp().express;
