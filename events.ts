/**
 * eventhandler for intern communication
 */
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

/**
 * Man in the middle for debugging
 * this event is send from NotificationController.notifyAboutNewChatMessage
 * this event is received in socketRouter.initOutgoingCalls
 */
myEmitter.on('newMessage', (socketId) => {
    console.log('in the middle: an event occurred!');
});

export default myEmitter;