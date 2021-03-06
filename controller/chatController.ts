import {ErrorREST, Errors} from "../errors";
import {Chat} from '../models/chatModel';
import {TextMessage} from "../models/messageModel";
import {User} from "../models/userModel";
import myEmitter from '../events';
import * as NotificationController from './notificationController';

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
     * @param request
     * @param response
     * @param next
     * @param chatType
     * @return {Promise<any>}
     */
    static async createNewChat(request, response, next) {
        let users: string[] = [request.decoded.userID];
        let length = 0;
        let pushed = 0;

        //concept info: you can create a group with yourself and add more users later
        if (request.body.member) {
            length = request.body.member.length;
            request.body.member.forEach(user => {
                User.findById(user).then(data => {
                    if (data && data.accountStatus.activated && data.role == request.decoded.role) {
                        users.push(user);
                    }
                    pushed++;
                });
            });
        }

        // wait until async push of members to users array finished
        async function checkFlag() {
            if (length != pushed) {
                setTimeout(checkFlag, 100);
            } else {
                let chat = new Chat({roomName: request.body.chatName, user: users});

                chat.validate(err => {
                    if (err)
                        for (let errName in err.errors)
                            if (err.errors[errName].name === 'ValidatorError')
                                return next(new ErrorREST(Errors.UnprocessableEntity, err.errors[errName].message))
                });
                await chat.save().then(chat => {
                    response.status(200).json(chat);

                    //notify each user except the creator about the new chat
                    users.forEach(user => {
                        if (user != request.decoded.userID) {
                            NotificationController.NotificationController.notifyAboutNewChat(user, chat._id);
                        }
                    });
                }).catch(next);
            }
        }

        checkFlag();


        //todo benachtichtige mitglieder über neuen chat
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
                            return next(new ErrorREST(Errors.UnprocessableEntity, "ValidatorError: " + err.errors[errName].message));
                        case 'ValidationError':
                            return next(new ErrorREST(Errors.UnprocessableEntity, "ValidationError: " + err.errors[errName].message));
                        case 'CastError':
                            return next(new ErrorREST(Errors.UnprocessableEntity, "CastError: " + err.errors[errName].message));
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
                                    message.save().then(message => {
                                        response.status(200).json(message);
                                        ChatController.sendMessage(request.body.chatID, message._id);
                                    });

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
     * notify all connected users in the chat, who did not received all messages about a new message(dont send the message)
     * @param chatID
     * @param messageID
     */
    private static sendMessage(chatID, messageID) {
        Chat.findById(chatID, 'user', (err, users) => {
            if (users) {
                users.user.forEach(userID => {
                    NotificationController.NotificationController.notifyAboutNewChatMessage(userID, chatID, messageID);

                });
            }
        });
    }
}
