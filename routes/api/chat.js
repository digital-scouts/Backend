"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var chatController_1 = require("../../controller/chatController");
var token_1 = require("../token");
var permission_1 = require("../permission");
var Chat = /** @class */ (function () {
    function Chat() {
        this.router = express_1.Router();
        this.init();
    }
    Chat.prototype.init = function () {
        this.router.route('/')
            .get(token_1.verifyToken, permission_1.checkPermission, chatController_1.ChatController.getAllChats)
            .post(token_1.verifyToken, permission_1.checkPermission, chatController_1.ChatController.createNewChat)
            .delete(token_1.verifyToken, permission_1.checkPermission, chatController_1.ChatController.deleteAll);
        this.router.route('/:id')
            .get(token_1.verifyToken, permission_1.checkPermission, chatController_1.ChatController.getOneChat);
        this.router.route('/message/:id')
            .get(token_1.verifyToken, permission_1.checkPermission, chatController_1.ChatController.getOneMessage);
        this.router.route('/message')
            .post(token_1.verifyToken, permission_1.checkPermission, chatController_1.ChatController.newTextMessage);
    };
    return Chat;
}());
var chatRouter = new Chat();
chatRouter.init();
exports.default = chatRouter.router;
//# sourceMappingURL=chat.js.map