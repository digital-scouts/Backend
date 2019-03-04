"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter = require('events');
var myEmitter = new EventEmitter();
myEmitter.on('newMessage', function (socketId) {
    console.log('in the middle: an event occurred!');
});
exports.default = myEmitter;
