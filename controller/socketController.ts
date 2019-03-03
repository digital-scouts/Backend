import {User} from "../models/userModel";
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
}