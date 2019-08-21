"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var userModel_1 = require("../models/userModel");
var constGlobal_1 = require("../constGlobal");
var events_1 = require("../events");
var appSections = constGlobal_1.ConstGlobal.app.sections;
var NotificationController = /** @class */ (function () {
    function NotificationController() {
    }
    /**
     *
     * @param userId
     * @param chatId
     * @param messageId
     */
    NotificationController.notifyAboutNewChatMessage = function (userId, chatId, messageId) {
        //emit user if he is connected right now
        userModel_1.User.findById(userId, 'socketID', function (err, user) {
            if (user) {
                events_1.default.emit('newMessage', user.socketID);
            }
            else {
                console.log("Error user not found for id: " + userId + " error: " + err);
            }
        });
        //todo update user notification
        //todo send push notification
    };
    /**
     *
     * @param userId
     * @param chatId
     */
    NotificationController.notifyAboutNewChat = function (userId, chatId) {
        //emit user if he is connected right now
        userModel_1.User.findById(userId, 'socketID', function (err, user) {
            if (user) {
                events_1.default.emit('', user.socketID);
                //todo event definieren
            }
            else {
                console.log("Error user not found for id: " + userId + " error: " + err);
            }
        });
        //todo update user notification
        //todo send push notification
    };
    /**
     * create a new notification and append it to user model (show all unread messages in app)
     * send a push message
     *
     * @param priority
     * @param title
     * @param message
     * @param category
     * @param meta
     */
    NotificationController.createNotification = function (priority, title, message, category, meta) {
        //todo
    };
    return NotificationController;
}());
exports.NotificationController = NotificationController;
//# sourceMappingURL=notificationController.js.map