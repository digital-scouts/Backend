"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
var chat = new Schema({
    roomName: {
        type: String,
        required: true
    },
    message: [{
            type: ObjectId,
            ref: 'TextMessage',
            required: false
        }],
    user: [{
            type: String,
            required: true
        }]
}, {
    timestamps: true
}, {
    writeConcern: {
        w: 1,
        j: true,
        wtimeout: 1000
    }
});
exports.Chat = mongoose_1.model("Chat", chat);
//# sourceMappingURL=chatModel.js.map