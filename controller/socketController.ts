import {User} from "../models/userModel";
import {ChatController} from './chatController';
import App from "../expressApp";
import * as jwt from "jsonwebtoken";

export class SocketController {

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
                if (err || user === null) {
                    console.error(err);
                    return;
                } else {
                    socket.emit('authStatus', true);
                    console.log(user)
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

    /**
     *
     * @param socket
     * @param {string} chatID
     * @param {string} messageType
     * @param data
     */
    static async handleNewMessage(socket, chatID: string, messageType: string, data) {
        //todo store message in db
        //todo check if receiver is online -> send message

        let userID: string;
        await SocketController.findUserIdBySocket(socket).then((id) => {
            userID = id;
        });
        if (userID !== null && userID !== undefined){
            ChatController.newTextMessage(userID, chatID, messageType, data);
        }
        else
            console.error("USER " + socket.id + " NOT FOUND: "+ userID)
    }

    private static async findUserIdBySocket(socket): Promise<string> {
        let id = null;
        await User.findOne({socketID: socket.id}, (err, user) => {
            if (err) {
                console.error("error: "+ err.messages);
                return null;
            } else {
                id = user._id
            }
        });
        return id;
    }
}
