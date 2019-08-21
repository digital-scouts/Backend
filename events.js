"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * eventhandler for intern communication
 */
var EventEmitter = require('events');
var myEmitter = new EventEmitter();
/**
 * Man in the middle for debugging
 * this event is send from NotificationController.notifyAboutNewChatMessage
 * this event is received in socketRouter.initOutgoingCalls
 */
myEmitter.on('newMessage', function (socketId) {
    console.log('in the middle: an event occurred!');
});
exports.default = myEmitter;
//# sourceMappingURL=events.js.map