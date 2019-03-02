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
        this.router.route('/group')
            .get(token, permission, (re, rs, ne) => ChatController.getAll(re, rs, ne, 'group'))
            .post(token, permission, (re, rs, ne) => ChatController.createNewChat(re, rs, ne, 'group'));

        this.router.route('/single')
            .get(token, permission, (re, rs, ne) => ChatController.getAll(re, rs, ne, 'single'))
            .post(token, permission, (re, rs, ne) => ChatController.createNewChat(re, rs, ne, 'single'));
    }
}

const chatRouter = new Chat();
chatRouter.init();

export default chatRouter.router;

