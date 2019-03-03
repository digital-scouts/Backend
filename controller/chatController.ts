import {ErrorREST} from "../errors";
import {Chat} from '../models/chatModel';

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
    static getOne(request, response, next) {
        Chat.findById(request.params.id).then(data => response.json(data)).catch(next);
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
     * todo error handling
     *
     * @param {string} userID
     * @param {string} chatID
     * @param {string} messageType
     * @param data
     * @return {Promise<any>}
     */
    static async newTextMessage(userID: string, chatID: string, messageType: string, data) {
        let chat = null;
        const isUserPartOfChat = function (el) {
            console.log("isUserPartOfChat, searing: " + userID + " found: " + el);
            return el === userID;
        };

        //create message first
        let message = new Chat(data);

        message.validate(err => {
            if (err)
                for (let errName in err.errors)
                    if (err.errors[errName].name === 'ValidatorError')
                        return {status: false, message: "UnprocessableEntity: " + err}
        });

        //find the chat, check permission and push message to message array
        await Chat.findById(chatID, (err, resChat) => {
            // console.log("searching Chat group: " + resChat)
            if (resChat != null && isUserPartOfChat) {
                Chat.findByIdAndUpdate(chatID, {$push: {message: message}}, {new: true}, (err, doc) => {
                    if (err){
                        console.error("WOOPS: " + err);
                        return;
                    }
                    console.log("Chat erstellt: " + doc)
                });
                chat = resChat;
            }
        });

        if (chat == null) {
            console.error("NO CHAT")
            return {status: false, message: "Chat not found"};
        }
        // console.log("Chat must be found now: " + chat)
        return {status: true, message: chat}
    }
}
