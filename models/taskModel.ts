import {Schema, Model, model} from 'mongoose';

const mongoose = require('mongoose');
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const task: Schema = new Schema({
        title: { // short text for this task
            type: String,
            required: true
        },
        description: { // longer explanation for this task
            type: String,
        },
        report: [{ // status report
            text: {
                type: String
            },
            date: {
                type: Date
            }
        }],
        dueDate: {
            type: Date,
            required: false
        },
        priority: {
            type: Number,
            min: [1, 'Priority can not be higher than \'1\''],
            max: [3, 'Priority can not be lower than \'3\''],
            default: 3
        },
        done: {
            type: Boolean,
            default: false
        },
        competent: // organizer / competent for this task
            [{
                type: ObjectId,
                ref: 'User'
            }],
        origin: { //todo set later
            type: String
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


export const Task: Model = model('task', task);
