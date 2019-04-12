import {Schema, Model, model} from "mongoose";
const mongoose = require('mongoose');

const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const chat: Schema = new Schema({
        roomName: {
            type: String,
            required: true
        },
        message: [{
            type: ObjectId,
            ref: 'TextMessage',//todo hier müssen auch andere nachrichten passen
            required: false
        }],
        user: [{
            type: String,
            required: true
        }]
    }, {
        timestamps: true
    },
    {
        writeConcern: {
            w: 1,
            j: true,
            wtimeout: 1000
        }
    }
);


export const Chat: Model = model("Chat", chat);
