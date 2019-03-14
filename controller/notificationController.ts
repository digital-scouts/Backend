import {Notification} from "../models/notificationModel";
import {User} from "../models/userModel";
import {ConstGlobal} from '../constGlobal';
import myEmitter from "../events";

const appSections = ConstGlobal.app.sections;

export class NotificationController {

    /**
     *
     * @param userId
     * @param chatId
     * @param messageId
     */
    static notifyAboutNewChatMessage(userId, chatId, messageId) {

        //emit user if he is connected right now
        User.findById(userId, 'socketID', (err, user) => {
            if (user) {
                myEmitter.emit('newMessage', user.socketID);


            } else {
                console.log("Error user not found for id: " + userId + " error: " + err)
            }
        });

        //todo update user notification
        //todo send push notification
    }

    /**
     *
     * @param userId
     * @param chatId
     */
    static notifyAboutNewChat(userId, chatId) {
        //emit user if he is connected right now
        User.findById(userId, 'socketID', (err, user) => {
            if (user) {
                myEmitter.emit('', user.socketID);
                //todo event definieren

            } else {
                console.log("Error user not found for id: " + userId + " error: " + err)
            }
        });

        //todo update user notification
        //todo send push notification
    }

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
    private static createNotification(priority: number, title: string, message: string, category: string, meta) {
//todo
    }
}