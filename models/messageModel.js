"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
/**
 * @author lange
 * @since 2019-03-02
 * @type {}
 */
var textMessage = new mongoose_1.Schema({
    chatID: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Chat',
        require: true,
    },
    senderID: {
        type: String,
        require: true
    },
    message: {
        type: String,
        require: true,
    },
    sendTime: {
        type: Date,
        require: true,
        default: new Date()
    },
    status: {
        receive: [{
                type: String,
                require: true,
                default: false
            }],
        read: [{
                type: String,
                require: true,
                default: false
            }],
        readConfirmed: [{
                type: String,
                require: true,
                default: false
            }]
    },
    deleteTime: {
        type: Date,
        require: true,
        default: null
    },
    silentMessage: {
        type: Boolean,
        require: true,
        default: false
    },
    encoding: {
        type: String,
        require: [true, "Information about encoding required"],
    },
    answerToID: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'TextMessage',
        require: false,
        default: null
    },
    editedNewID: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'TextMessage',
        require: false,
        default: null
    },
    forwardedID: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'TextMessage',
        require: false,
        default: null
    },
}, {
    timestamps: true
}, {
    writeConcern: {
        w: 1,
        j: true,
        wtimeout: 1000
    }
});
exports.TextMessage = mongoose_1.model("TextMessage", textMessage);
//# sourceMappingURL=messageModel.js.map