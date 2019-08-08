import {Schema, Model, model} from "mongoose";

const mongoose = require('mongoose');

const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

let answerTypes = {
    NO: 0,
    YES: 1,
    MAYBE: 2
};


const event: Schema = new Schema({
        public: // Public will be shown on the Website | Private is only visible to members/groups
            {
                type: Boolean,
                require: true,
                default: true,
            },
        origin: // Where does the element belong to?
            {
                type: String // todo not supported yet replace with object later
            },
        type: // type of the calenderElement [event, groupLesson, planningObject, task]
            {
                type: String,
                default: "event"
            },
        eventName: // title of the event
            {
                type: String,
                require: true
            },
        dateStart: // start date and time
            {
                type: Date,
                require: true,
            },
        dateEnd: // end date and time
            {
                type: Date,
                require: true,
            },
        description: // description of the event. Can be a Summary or a explanation.
            {
                type: String,
            },
        competent: // organizer / competent for this event (person or group(AK))
            [{
                type: ObjectId,
                ref: 'User'
            }],
        groups:  // members as Group. Who is the appointment for?
            [{
                type: ObjectId,
                ref: 'Group'
            }],
        members:  // members as User. Who is the appointment for?
            [{
                type: ObjectId,
                ref: 'User'
            }],
        feedback: [{//List of all users who have answered or canceled
            user: {
                type: ObjectId,
                ref: 'User'
            },
            answer: {
                type: Number,
                enum: answerTypes,
                min:0,
                max:2,
                required: true
            }
        }],
        address:  // address of the event
            {
                type: ObjectId,
                ref: 'Address'
            },
        attachments: {
            document:// link, deepLink (in App), document,
                [{
                    type: ObjectId,
                    ref: 'Document'
                }],
            picture: // list of pictures (only one is recommended) from last event for some impressions
                {
                    type: String // todo not supported yet replace with object later
                },
        },
        creator:// event creator info
            {
                type: ObjectId,
                ref: 'User',
                require: [true, "A Creator must be given for security reasons"]
            },
        lastEdit: //update this field, when someone change this event
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


export const Event: Model = model("Event", event);
