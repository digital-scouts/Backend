import {Schema, Model, model} from "mongoose";
import {Config} from "../config";

const mongoose = require('mongoose');

const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

//return string array with all roleNames set in config file


const group: Schema = new Schema({
        name: {
            type: String,
            require: [true, "Name is missing, each group needs a name to identify them."]
        },
        leader: [{
            type: ObjectId,
            ref: "User"
        }],
        logo: {
            type: String // todo not supported yet replace with object later
        },
        color: {
            type: String // todo not supported yet replace with object later
        },
        creator:// creator info
            {
                type: ObjectId,
                ref: 'User',
                require: [true, "A Creator must be given for security reasons"]
            },
        lastEdit: //update this field, when someone change this schema
            {
                type: ObjectId,
                ref: 'User',
                default: null
            }
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


export const Group: Model = model("Group", group);
