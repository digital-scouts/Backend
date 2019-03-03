import {ErrorREST, Errors} from "../errors";
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
                        return next(new ErrorREST(Errors.UnprocessableEntity, err.errors[errName].message))
        });
        await chat.save().then(chat => response.status(200).json(chat)).catch(next);
    }

    /**
     * todo return status
     *
     * @return {Promise<any>}
     * @param request
     * @param response
     * @param next
     */
    static newTextMessage(request, response, next) {
        let userID = request.decoded.userID;

        function isUserPartOfChat(member) {
            // console.log("isUserPartOfChat, searing: " + userID + " found: " + member + " res: " + (member.toString() === userID.toString()));
            return (member.toString() === userID.toString());
        }

        let message = new TextMessage(request.body);
        message.validate(err => {
            if (err)
                for (let errName in err.errors)
                    switch (err.errors[errName].name) {
                        case 'ValidatorError':
                            return next(new ErrorREST(Errors.UnprocessableEntity, "ValidatorError: "+ err.errors[errName].message));
                        case 'ValidationError':
                            return next(new ErrorREST(Errors.UnprocessableEntity, "ValidationError: "+ err.errors[errName].message));
                        case 'CastError':
                            return next(new ErrorREST(Errors.UnprocessableEntity, "CastError: "+ err.errors[errName].message));
                    }
        });

        //find sender userId
        User.findById(request.decoded.userID, (err, user) => {
            if (user) {
                //find the chat, check permission and push message to message array
                Chat.findById(request.body.chatID, (err, resChat) => {
                    if (resChat != null) {
                        if (resChat.user.find(isUserPartOfChat)) {
                            Chat.findByIdAndUpdate(request.body.chatID, {$push: {message: message}}, {new: true}, (err, doc) => {
                                if (doc) {
                                    message.save().then(message => response.status(200).json(message));
                                } else {
                                    return next(new ErrorREST(Errors.InternalServerError, "Unknown error during chat update"));
                                }
                            });
                        } else {
                            return next(new ErrorREST(Errors.Forbidden, "You are not in this chat"));
                        }
                    } else {
                        return next(new ErrorREST(Errors.NotFound, "Chat did not exist"));
                    }
                });

            } else {
                return next(new ErrorREST(Errors.NotFound, "User does not exist."));
            }
        });
    }

    /**
     * notify all connected users in the chat (dont send the message)
     * todo push to all other
     * @param chatID
     */
    private static sendMessage(chatID) {

    }
}
