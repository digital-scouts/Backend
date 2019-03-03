import {ErrorREST} from "../errors";
import {Chat} from '../models/chatModel';
import {TextMessage} from "../models/messageModel";
import {User} from "../models/userModel";

export class ChatController {

    /**
     * todo einschränkug der chatrückgabe nach config permission
     * @param request
     * @param response
     * @param next
     * @param chatType
     */
    static getAllChats(request, response, next) {
        Chat.find().then(data => response.json(data)).catch(next);
    }

    /**
     * todo prüfe permission
     * @param request
     * @param response
     * @param next
     */
    static getOneChat(request, response, next) {
        Chat.findById(request.params.id).then(data => response.json(data)).catch(next);
    }

    /**
     *
     * @param request
     * @param response
     * @param next
     */
    static getOneMessage(request, response, next) {
        TextMessage.findById(request.params.id).then(data => response.json(data)).catch(next);
    }

    /**
     * todo only for debug, block this later
     * @param request
     * @param response
     * @param next
     */
    static deleteAll(request, response, next) {
        Chat.deleteMany().then(data => response.json(data)).catch(next);
    }

    /**
     * todo prüfe ob raum erstellt werden kann
     * todo zweiter chatpartner für einen raum benötigt
     * @param request
     * @param response
     * @param next
     * @param chatType
     * @return {Promise<any>}
     */
    static async createNewChat(request, response, next) {
        let chat = new Chat({roomName: request.body.chatName, user: [request.decoded.userID]});

        chat.validate(err => {
            if (err)
                for (let errName in err.errors)
                    if (err.errors[errName].name === 'ValidatorError')
                        return next(new ErrorREST("UnprocessableEntity", err.errors[errName].message))
        });
        await chat.save().then(chat => response.status(200).json(chat)).catch(next);
    }

    /**
     * todo return status
     *
     * @param socket
     * @param {string} chatID
     * @param data
     * @return {Promise<any>}
     */
    static newTextMessage(socket, chatID: string, data) {
        let userID;

        function isUserPartOfChat(member) {
            // console.log("isUserPartOfChat, searing: " + userID + " found: " + member + " res: " + (member.toString() === userID.toString()));
            return (member.toString() === userID.toString());
        }

        let message = new TextMessage(data);
        message.validate(err => {
            if (err)
                for (let errName in err.errors)
                    if (err.errors[errName].name === 'ValidatorError')
                        socket.emit('newMessageStatus', false, "UnprocessableEntity");
        });

        //find sender userId
        User.findOne({socketID: socket.id}, (err, user) => {
            if (err) {
                console.error("error: " + err.messages);
                return;
            } else {
                userID = user._id;
                if (user != null && userID !== null && userID !== undefined) {
                    // console.log("1 User gefunden")
                    //find the chat, check permission and push message to message array
                    Chat.findById(chatID, (err, resChat) => {
                        // console.log("searching Chat group: " + resChat)
                        if (resChat != null && resChat.user.find(isUserPartOfChat)) {
                            // console.log("2 Chat gefunden")
                            Chat.findByIdAndUpdate(chatID, {$push: {message: message}}, {new: true}, (err, doc) => {
                                if (err) {
                                    console.error("WHOOPS (Update chat after new message): " + err);
                                    socket.emit('newMessageStatus', false, "Unknown error during chat update");
                                }
                                // console.log("3 Message gesichert")
                                message.save();
                                socket.emit('newMessageStatus', true, "Chat successful updated");
                            });
                        } else {
                            socket.emit('newMessageStatus', false, "Chat did not exist or you are not in this chat");
                        }
                    });
                } else {
                    console.error("USER " + socket.id + " NOT FOUND: " + userID)
                }
            }
        });
    }

    /**
     * notify all connected users in the chat (dont send the message)
     * todo push to all other
     * @param chatID
     */
    private static sendMessage(chatID){

    }
}
