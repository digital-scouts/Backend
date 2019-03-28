import {Schema, Model, model} from "mongoose";

const mongoose = require('mongoose');

const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

//frequency given in days [only single lesson, weekly, Every two weeks, monthly]
const frequencies = [0, 7, 14, 30];

// a groupLesson belongs to a Group
// a Group can have more than one groupLesson Reason: in case of switching it in 2 weeks, we dont want to loose the old date for next week
const groupLesson: Schema = new Schema({
        group: //only one group for a lesson. Reason: it is possible to change this later, change only on groups lessen then
            {
                type: ObjectId,
                ref: "Group"
            },
        frequency: //
            {
                type: Number,
                enum: frequencies,
                default: 7,
                require: true
            },
        startDate: // date of first group lesson, also important for weekday and time
            {
                type: Date,
                require: true
            },
        end: // last day with group lesson in this frequency
            {
                type: Date,
                require: false
            },
        duration: //duration of group lesson in hours
            {
                type: Number,
                max: 5,
                default: 1.5,
                require: true
            },
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


export const GroupLesson: Model = model("GroupLesson", groupLesson);
