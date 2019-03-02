import {User} from "../models/userModel";
import {TextMessage} from '../models/messageModel';
import App from "../expressApp";
import * as jwt from "jsonwebtoken";

export class SocketController {

    /**
     * save socket id to database
     * emit status to socket
     * @param socket
     * @param {string} token
     * @return user
     */
    static handleAuth(socket, token: string) {
        let userID = null;
        if (token) {
            jwt.verify(token, App.get('salt'), (error, decoded) => {
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
                if (err) {
                    console.error(err);
                    return;
                } else {
                    socket.emit('authStatus', true);
                    return user;
                }
            });
        }
    }

    /**
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

    /**
     *
     * @param {string} chatID
     * @param {string} messageType
     * @param data
     */
    static handleNewMessage(chatID: string, messageType: string, data) {
        //todo store message in db
        //todo check if receiver is online -> send message

        switch (messageType) {
            case 'text':
                let message = new TextMessage();
        }


    }
}
