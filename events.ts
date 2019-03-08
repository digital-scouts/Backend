/**
 * eventhandler for intern communication
 */
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

/**
 * Man in the middle for debugging
 */
myEmitter.on('newMessage', (socketId) => {
    console.log('in the middle: an event occurred!');
});

export default myEmitter;