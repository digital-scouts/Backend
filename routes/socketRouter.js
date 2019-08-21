"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//https://socket.io/docs/server-api/
var jwt = require("jsonwebtoken");
var userModel_1 = require("../models/userModel");
var app = require("../expressApp");
var express = app.appE;
var events_1 = require("../events");
var SocketRouter = /** @class */ (function () {
    function SocketRouter(ioServer) {
        this.io = ioServer;
        this.initIncomingCalls();
        this.initOutgoingCalls();
        console.log("Socket Router created...");
    }
    /**
     * @author lange
     * @since 2019-03-02
     * save socket id to database
     * emit status to socket
     * @param socket
     * @param {string} token
     * @return user
     */
    SocketRouter.handleAuth = function (socket, token) {
        var userID = null;
        if (token) {
            jwt.verify(token, express.get('salt'), function (error, decoded) {
                if (error) {
                    socket.emit("authStatus", false, "Unauthorized: Token is not valid");
                    return;
                }
                userID = decoded.userID;
            });
        }
        else {
            socket.emit('authStatus', false, "BadRequest: BadRequest");
            return;
        }
        if (userID != null) {
            userModel_1.User.findByIdAndUpdate(userID, { $set: { 'socketID': socket.id } }, { new: true }, function (err, user) {
                if (err || user === null) {
                    console.error(err);
                    return;
                }
                else {
                    socket.emit('authStatus', true);
                    console.log("User authenticated");
                }
            });
        }
    };
    /**
     * @author lange
     * @since 2019-03-02
     * update socket id in database
     * @param socket
     * @return user
     */
    SocketRouter.handleDisconnect = function (socket) {
        userModel_1.User.findOneAndUpdate({ 'socketID': socket.id }, { $set: { 'socketID': null } }, { new: true }, function (err, user) {
            if (err) {
                console.error(err);
                return;
            }
            else {
                return user;
            }
        });
    };
    SocketRouter.prototype.initIncomingCalls = function () {
        this.io.on('connection', function (socket) { return incomingCalls(socket); });
        function incomingCalls(socket) {
            //user is unknown
            console.log('SOCKET: a user connected');
            socket.on('auth', function (token) {
                SocketRouter.handleAuth(socket, token);
            });
            socket.on('disconnect', function (reason) {
                SocketRouter.handleDisconnect(socket);
                console.log('SOCKET: a user disconnected');
            });
            socket.on('error', function (error) {
                console.log('SOCKET: Woops an error. -> Client Disconnect.');
                console.error(error);
                SocketRouter.handleDisconnect(socket);
            });
        }
    };
    SocketRouter.prototype.initOutgoingCalls = function () {
        var _this = this;
        events_1.default.on('newMessage', function (socketId) {
            _this.io.to(socketId).emit('newMessage');
        });
    };
    return SocketRouter;
}());
exports.default = SocketRouter;
//# sourceMappingURL=socketRouter.js.map