import {Errors} from "../errors";
import {ErrorREST} from "../errors";
import {GroupChat} from '../models/chatModel';
import {SingleChat} from '../models/chatModel';

export class ChatController {

    /**
     * todo einschränkug der chatrückgabe nach config permission
     * @param request
     * @param response
     * @param next
     */
    static getAll(request, response, next, chatType) {
        switch (chatType) {
            case 'group':
                GroupChat.find().then(data => response.json(data)).catch(next);
                break;
            case 'single':
                SingleChat.find().then(data => response.json(data)).catch(next);
                break;
            default:
                return next(new ErrorREST("UnprocessableEntity", "You need to choose a valid chat type."))
        }
    }

    static async createNewChat(request, response, next, chatType) {
        let chat = null;
        switch (chatType) {
            case 'group':
                chat = new GroupChat({roomName: request.body.chatName, user: [request.decoded.userID]});
                break;
            case 'single':
                chat = new SingleChat({roomName: request.body.chatName, user: [request.decoded.userID]});
                break;
            default:
                return next(new ErrorREST("UnprocessableEntity", "You need to choose a valid chat type."))
        }

        chat.validate(err => {
            if (err)
                for (let errName in err.errors)
                    if (err.errors[errName].name === 'ValidatorError')
                        return next(new ErrorREST("UnprocessableEntity", err.errors[errName].message))
        });
        await chat.save().then(chat => response.status(200).json(chat)).catch(next);
    }
}
