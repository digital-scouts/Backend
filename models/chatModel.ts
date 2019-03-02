import {Schema, Model, model} from "mongoose";

const groupChat: Schema = new Schema({
        roomName: {
            type: String,
            require: false
        },
        user: [{
            type: String,
            require: true
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

const singleChat: Schema = new Schema({
        roomName: {
            type: String,
            require: false
        },
        user: [{
            type: String,
            require: true
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

export const GroupChat: Model = model("GroupChat", groupChat);
export const SingleChat: Model = model("SingleChat", singleChat);
