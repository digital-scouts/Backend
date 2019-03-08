//https://socket.io/docs/server-api/
import * as jwt from "jsonwebtoken";
import {User} from "../models/userModel";
import * as app from "../expressApp";
const express = app.appE;
import myEmitter from '../events';


export default class SocketRouter {
    private readonly io;

    public constructor(ioServer) {
        this.io = ioServer;
        this.initIncomingCalls();
        this.initOutgoingCalls();

        console.log("Socket Router created...")
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
    static handleAuth(socket, token: string) {
        let userID = null;
        if (token) {
            jwt.verify(token, express.get('salt'), (error, decoded) => {
                if (error) {
                    socket.emit("authStatus", false, "Unauthorized: Token is not valid");
                    return;
                }
                userID = decoded.userID
            });
        } else {
            socket.emit('authStatus', false, "BadRequest: BadRequest");
            return;
        }

        if (userID != null) {
            User.findByIdAndUpdate(userID, {$set: {'socketID': socket.id}}, {new: true}, (err, user) => {
                if (err || user === null) {
                    console.error(err);
                    return;
                } else {
                    socket.emit('authStatus', true);
                    console.log("User authenticated")
                }
            });
        }
    }

    /**
     * @author lange
     * @since 2019-03-02
     * update socket id in database
     * @param socket
     * @return user
     */
    static handleDisconnect(socket) {
        User.findOneAndUpdate({'socketID': socket.id}, {$set: {'socketID': null}}, {new: true}, (err, user) => {
            if (err) {
                console.error(err);
                return;
            } else {
                return user;
            }
        });
    }


    private initIncomingCalls() {
        this.io.on('connection', socket => incomingCalls(socket));

        function incomingCalls(socket) {
            //user is unknown
            console.log('SOCKET: a user connected');

            socket.on('auth', (token) => {
                SocketRouter.handleAuth(socket, token);
            });

            /**
             * @author lange
             * @since 2019-03-02
             * todo
             * edit existing text messages
             * @param {string}  chatID - uniq chat identifier
             * @param {string} messageID{string} - uniq message identifier
             * @param data - message with meta data to send
             */
            socket.on('editMessage', (chatID: string, messageID: string, data) => {
                //todo validate user
                //todo search old message, set edited flag, and a source to new message
                //todo save edited message as new message
                console.log('SOCKET: editMessage');
            });

            /**
             * @author lange
             * @since 2019-03-02
             * todo
             * @param {string} messageID{string} - uniq message identifier
             */
            socket.on('deleteMessage', (messageID: string) => {

            });

            socket.on('disconnecting', (reason) => {
                //todo
                console.log('SOCKET: a user disconnecting');
            });

            socket.on('disconnect', function (reason) {
                SocketRouter.handleDisconnect(socket);
                console.log('SOCKET: a user disconnected');
            });

            socket.on('error', function (error) {
                //todo what can happen here?
                console.log('SOCKET: Woops an error');
                console.error(error);
            });
        }
    }

    private initOutgoingCalls(){
        myEmitter.on('newMessage', (socketId) => {
            this.io.to(socketId).emit('newMessage');
        });
    }
}
