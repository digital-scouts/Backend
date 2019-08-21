var mongoose_1 = require("mongoose");
var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = mongoose_1.Schema.ObjectId;
var answerTypes = {
    NO: 0,
    YES: 1,
    MAYBE: 2
};
var event = new mongoose_1.Schema({
    public: {
        type: Boolean,
        require: true,
        default: true,
    },
    origin: {
        type: String // todo not supported yet replace with object later
    },
    type: {
        type: String,
        default: "event"
    },
    eventName: {
        type: String,
        require: true
    },
    dateStart: {
        type: Date,
        require: true,
    },
    dateEnd: {
        type: Date,
        require: true,
    },
    description: {
        type: String,
    },
    competent: [{
            type: ObjectId,
            ref: 'User'
        }],
    groups: [{
            type: ObjectId,
            ref: 'Group'
        }],
    members: [{
            type: ObjectId,
            ref: 'User'
        }],
    feedback: [{
            user: {
                type: ObjectId,
                ref: 'User'
            },
            answer: {
                type: Number,
                enum: answerTypes,
                min: 0,
                max: 2,
                required: true
            }
        }],
    address: {
        type: ObjectId,
        ref: 'Address'
    },
    attachments: {
        document: [{
                type: ObjectId,
                ref: 'Document'
            }],
        picture: {
            type: String // todo not supported yet replace with object later
        },
    },
    creator: {
        type: ObjectId,
        ref: 'User',
        require: [true, "A Creator must be given for security reasons"]
    },
    lastEdit: {
        type: ObjectId,
        ref: 'User',
        default: null
    }
}, {
    timestamps: true
}, {
    writeConcern: {
        w: 1,
        j: true,
        wtimeout: 1000
    }
});
exports.Event = mongoose_1.model("Event", event);
//# sourceMappingURL=eventModel.js.map