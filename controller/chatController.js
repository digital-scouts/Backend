var errors_1 = require("../errors");
var chatModel_1 = require('../models/chatModel');
var messageModel_1 = require("../models/messageModel");
var userModel_1 = require("../models/userModel");
var NotificationController = require('./notificationController');
var ChatController = (function () {
    function ChatController() {
    }
    /**
     * todo einschränkug der chatrückgabe nach config permission
     * @param request
     * @param response
     * @param next
     * @param chatType
     */
    ChatController.getAllChats = function (request, response, next) {
        chatModel_1.Chat.find().then(function (data) { return response.json(data); }).catch(next);
    };
    /**
     * todo prüfe permission
     * @param request
     * @param response
     * @param next
     */
    ChatController.getOneChat = function (request, response, next) {
        chatModel_1.Chat.findById(request.params.id).then(function (data) { return response.json(data); }).catch(next);
    };
    /**
     *
     * @param request
     * @param response
     * @param next
     */
    ChatController.getOneMessage = function (request, response, next) {
        messageModel_1.TextMessage.findById(request.params.id).then(function (data) { return response.json(data); }).catch(next);
    };
    /**
     * todo only for debug, block this later
     * @param request
     * @param response
     * @param next
     */
    ChatController.deleteAll = function (request, response, next) {
        chatModel_1.Chat.deleteMany().then(function (data) { return response.json(data); }).catch(next);
    };
    /**
     * todo prüfe ob raum erstellt werden kann
     * @param request
     * @param response
     * @param next
     * @param chatType
     * @return {Promise<any>}
     */
    ChatController.async = createNewChat(request, response, next);
    return ChatController;
})();
exports.ChatController = ChatController;
{
    var users = [request.decoded.userID];
    var length_1 = 0;
    var pushed = 0;
    //concept info: you can create a group with yourself and add more users later
    if (request.body.member) {
        length_1 = request.body.member.length;
        request.body.member.forEach(function (user) {
            userModel_1.User.findById(user).then(function (data) {
                if (data && data.accountStatus.activated && data.role == request.decoded.role) {
                    users.push(user);
                }
                pushed++;
            });
        });
    }
    // wait until async push of members to users array finished
    async;
    function checkFlag() {
        if (length_1 != pushed) {
            setTimeout(checkFlag, 100);
        }
        else {
            var chat = new chatModel_1.Chat({ roomName: request.body.chatName, user: users });
            chat.validate(function (err) {
                if (err)
                    for (var errName in err.errors)
                        if (err.errors[errName].name === 'ValidatorError')
                            return next(new errors_1.ErrorREST(errors_1.Errors.UnprocessableEntity, err.errors[errName].message));
            });
            await;
            chat.save().then(function (chat) {
                response.status(200).json(chat);
                //notify each user except the creator about the new chat
                users.forEach(function (user) {
                    if (user != request.decoded.userID) {
                        NotificationController.NotificationController.notifyAboutNewChat(user, chat._id);
                    }
                });
            }).catch(next);
        }
    }
    checkFlag();
}
newTextMessage(request, response, next);
{
    var userID = request.decoded.userID;
    function isUserPartOfChat(member) {
        // console.log("isUserPartOfChat, searing: " + userID + " found: " + member + " res: " + (member.toString() === userID.toString()));
        return (member.toString() === userID.toString());
    }
    var message = new messageModel_1.TextMessage(request.body);
    message.validate(function (err) {
        if (err)
            for (var errName in err.errors)
                switch (err.errors[errName].name) {
                    case 'ValidatorError':
                        return next(new errors_1.ErrorREST(errors_1.Errors.UnprocessableEntity, "ValidatorError: " + err.errors[errName].message));
                    case 'ValidationError':
                        return next(new errors_1.ErrorREST(errors_1.Errors.UnprocessableEntity, "ValidationError: " + err.errors[errName].message));
                    case 'CastError':
                        return next(new errors_1.ErrorREST(errors_1.Errors.UnprocessableEntity, "CastError: " + err.errors[errName].message));
                }
    });
    //find sender userId
    userModel_1.User.findById(request.decoded.userID, function (err, user) {
        if (user) {
            //find the chat, check permission and push message to message array
            chatModel_1.Chat.findById(request.body.chatID, function (err, resChat) {
                if (resChat != null) {
                    if (resChat.user.find(isUserPartOfChat)) {
                        chatModel_1.Chat.findByIdAndUpdate(request.body.chatID, { $push: { message: message } }, { new: true }, function (err, doc) {
                            if (doc) {
                                message.save().then(function (message) {
                                    response.status(200).json(message);
                                    ChatController.sendMessage(request.body.chatID, message._id);
                                });
                            }
                            else {
                                return next(new errors_1.ErrorREST(errors_1.Errors.InternalServerError, "Unknown error during chat update"));
                            }
                        });
                    }
                    else {
                        return next(new errors_1.ErrorREST(errors_1.Errors.Forbidden, "You are not in this chat"));
                    }
                }
                else {
                    return next(new errors_1.ErrorREST(errors_1.Errors.NotFound, "Chat did not exist"));
                }
            });
        }
        else {
            return next(new errors_1.ErrorREST(errors_1.Errors.NotFound, "User does not exist."));
        }
    });
}
sendMessage(chatID, messageID);
{
    chatModel_1.Chat.findById(chatID, 'user', function (err, users) {
        if (users) {
            users.user.forEach(function (userID) {
                NotificationController.NotificationController.notifyAboutNewChatMessage(userID, chatID, messageID);
            });
        }
    });
}
//# sourceMappingURL=chatController.js.map