var mongoose_1 = require("mongoose");
var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = mongoose_1.Schema.ObjectId;
//frequency given in days [only single lesson, weekly, Every two weeks, monthly]
var frequencies = [0, 7, 14, 30];
// a groupLesson belongs to a Group
// a Group can have more than one groupLesson Reason: in case of switching it in 2 weeks, we dont want to loose the old date for next week
var groupLesson = new mongoose_1.Schema({
    group: {
        type: ObjectId,
        ref: "Group",
        require: true
    },
    frequency: {
        type: Number,
        enum: frequencies,
        default: 7,
        require: true
    },
    startDate: {
        type: Date,
        require: true
    },
    end: {
        type: Date,
        require: false
    },
    duration: {
        type: Number,
        max: 5,
        default: 1.5,
        require: true
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
exports.GroupLesson = mongoose_1.model("GroupLesson", groupLesson);
//# sourceMappingURL=groupLessonModel.js.map