import {Schema, Model, model} from "mongoose";

const mongoose = require('mongoose');
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// save often used addresses and addresses for events.
// did not save addresses from members
const task: Schema = new Schema({
        title: { // name of the Address like 'Gruppenraum' or 'St. Gabriel'
            type: String,
            required: true
        },
        description: {
            type: String,
        },
        dueDate: {
            type: Date,
        },
        competent: // organizer / competent for this task
            [{
                type: ObjectId,
                ref: 'User'
            }],
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


export const Task: Model = model("task", task);
