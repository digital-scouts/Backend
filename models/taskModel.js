"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
var task = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    report: [{
            type: String
        }],
    dueDate: {
        type: Date,
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
}, {
    timestamps: true
}, {
    writeConcern: {
        w: 1,
        j: true,
        wtimeout: 1000
    }
});
exports.Task = mongoose_1.model("task", task);
//# sourceMappingURL=taskModel.js.map