import {Notification} from "../models/notificationModel";
import {User} from "../models/userModel";
import {ConstGlobal} from '../constGlobal';

const appSections = ConstGlobal.app.sections;

export class NotificationController {

    /**
     *
     * @param userId
     * @param messageId
     */
    static notifyAboutNewChatMessage(userId, messageId) {

    }

    /**
     *
     * @param userId
     * @param chatId
     */
    static notifyAboutNewChat(userId, chatId) {

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

    }

}