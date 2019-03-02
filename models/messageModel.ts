import {Schema, Model, model} from "mongoose";

/**
 * @author lange
 * @since 2019-03-02
 * @type {}
 */
const textMessage: Schema = new Schema({
        chatID: {
            type: String,
            require: true
        },
        senderID: {
            type: String,
            require: true
        },
        message: {
            type: String,
            require: true,
        },
        sendTime: {// possible to send a message later
            type: Date,
            require: true,
            default: new Date()
        },
        status: {
            receive: [{//user got a message / notification
                type: String,
                require: true,
                default: false
            }],
            read: [{//chat was opened after receive
                type: String,
                require: true,
                default: false
            }],
            readConfirmed: [{//feature: dont answer with an ok, mark the message as read
                type: String,
                require: true,
                default: false
            }]
        },
        deleteTime: { //check this before send messages to a user todo check live
            type: Date,
            require: true,
            default: null
        },
        silentMessage: {//send a message without notification
            type: Boolean,
            require: true,
            default: false
        },
        encoding: {//todo information about encoding
            type: {code: String},
            require: true,
            default: null
        },
        answerToID: {//reference to answered message
            type: String,
            require: false,
            default: null
        },
        editedNewID: {//set if message was edited, id is new message
            type: String,
            require: false,
            default: null
        },
        forwardedID: {//reference to forwarded message
            type: String,
            require: false,
            default: null
        },
    },
    {
        timestamps: true
    },
    {
        writeConcern: {
            w: 1,
            j: true,
            wtimeout: 1000
        }
    });

export const TextMessage: Model = model("TextMessage", textMessage);
