import {Router} from "express";
import {ChatController} from "../../controller/chatController";

import {verifyToken as token} from "../token";
import {checkPermission as permission} from "../permission";

class Chat {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.route('/')
            .get(token, permission, ChatController.getAllChats)
            .post(token, permission, ChatController.createNewChat)
            .delete(token, permission, ChatController.deleteAll);

        this.router.route('/:id')
            .get(token, permission, ChatController.getOne);

    }
}

const chatRouter = new Chat();
chatRouter.init();

export default chatRouter.router;

