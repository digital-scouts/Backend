const EventEmitter = require('events');

const myEmitter = new EventEmitter();

myEmitter.on('newMessage', (socketId) => {
    console.log('in the middle: an event occurred!');
});

export default myEmitter;
